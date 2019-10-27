import React from 'react';
import GameScores from './GameScores'
import {japlcejAPI, routesURLs} from './config-routes.js';
import { i18n, useTranslation, withTranslation, Trans } from "react-i18next";

class GameLevelSelector extends React.Component {
	constructor(props) {
		super(props);
		this.changeLevel=this.changeLevel.bind(this);
	}

	changeLevel() {
		var that = this;
		var levelSelected = document.getElementById("levelsAvailableSelect")
			.options[document.getElementById("levelsAvailableSelect").selectedIndex].value;

		if(this.props.level !== levelSelected) {
				this.props.changeLevel(levelSelected);
		}
	}

	getLevelsAvailableOptions() {
			var options = null;

			if (this.props.levelsAvailable !== null && this.props.levelsAvailable !== undefined) {
				options = this.props.levelsAvailable;
			};

			if (options != null && options.length > 0) {
				return options.map((levelAvailable, index) => <option key={levelAvailable+index} value={levelAvailable}>
																								{levelAvailable}
																					</option>);
			}
		}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if(this.props.level !== prevProps.level && this.props.level !== null && this.props.level !== undefined) {
			document.getElementById("levelsAvailableSelect").value=this.props.level;
		}
		if(this.props.newAvailableLevel !== prevProps.newAvailableLevel &&
					this.props.newAvailableLevel !== null && this.props.newAvailableLevel !== undefined) {
					this.setState('newAvailableLevel' : newAvailableLevel); //will be used to select auto the newAvailableLevel with golden ribbon around select for notice for example
		}
	}

	render() {
		if (!this.props.userLoggedIn) {
			 return null;
		 }
		else {
			 return (
					<select id="levelsAvailableSelect" required onChange={this.changeLevel} >
						 {this.getLevelsAvailableOptions()}
					</select>
		);
		}
	}
}


class _GameCard extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			 progression : {percentageGood : undefined, percentageDone : undefined},
			 level : undefined,
			 levelsAvailable : undefined,
			 newAvailableLevel : undefined
		}; //level and levelsAvailable to be updated at constructor time
    this.quitGame = this.props.quitGame;
    this.onClick=this.onClick.bind(this);
		this.onLevelsAvailable=this.onLevelsAvailable.bind(this);
		this.changeLevel=this.changeLevel.bind(this);
	}

onLevelsAvailable(__levelsAvailable) {
		if(__levelsAvailable === undefined || __levelsAvailable === null) {
			this.setState(
				{
				levelsAvailable : null,
				level : null
				});
		}

		if ((this.state.levelsAvailable === null || this.state.levelsAvailable === undefined) ||
			(__levelsAvailable.length !== this.state.levelsAvailable.length) ||
		 !(__levelsAvailable.every((oldi, i) => {return oldi = this.state.levelsAvailable[i]})))  {
			this.setState(
				{
				levelsAvailable : __levelsAvailable,
				level : (__levelsAvailable.length > 0? __levelsAvailable[__levelsAvailable.length-1] : null)
				});
		}
	}

  onClick() {
    this.props.onClick(this.props.gameName, this.state.level ,this.props.gameTextAbstract);
  }


	changeLevel(newLevelSelected) {
			if(this.state.level !== newLevelSelected) {
					this.setState({level : newLevelSelected});
			}
		}



		static getLevelsAvailable(percentageTries, percentageGood, currentLevel) {
				var currentLevelIndex=Math.max(0,Object.keys(GameScores.getNbTriesThresholdBeforeNextLevel()).indexOf(currentLevel));
				if(percentageTries >= 100 && percentageGood >= 80) { currentLevelIndex++};

				var arrayOfLevelsAvailable=Object.keys(GameScores.getNbTriesThresholdBeforeNextLevel()).slice(0,currentLevelIndex+1);
				return arrayOfLevelsAvailable;
		}

		updateScores() {
			var _that=this;

			if (!_that.props.userLoggedIn) return;

			fetch(japlcejAPI + routesURLs.GETPLAYERRESULTS + "/" + _that.props.gameName +
				 ((_that.state.level === undefined || _that.state.level ===null) ? '' : "/" + _that.state.level), {
				 method: "GET",
				 headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json, text/plain, */*'
				},
				 credentials : 'include',
				 mode : 'cors',
				 redirect : 'follow'
				}
			)
		.then(response => {
			if (response.status ===204) return null;
			var responseJson=response.json();
			if(response.status !==200) {
				 console.error('GETPLAYERRESULTS Error: response status', response.status);
				 return;
			 }
			return(responseJson);
		})
		.catch(error => {console.error('GETPLAYERRESULTS Error:', error);
		 })
		.then(data => {
			if (data != null  &&  data.error == null) {
				var newDataProgression = {percentageDone : data.percentageTries, percentageGood : data.percentageGood, level : data.level};
				var __levelsAvailable=_GameCard.getLevelsAvailable(data.percentageTries, data.percentageGood, data.level);
				var potentialNewAvailableLevel = __levelsAvailable[__levelsAvailable.length-1];

				_that.onLevelsAvailable(__levelsAvailable);

				var newState;

				if (potentialNewAvailableLevel !== _that.state.newAvailableLevel) {
					newState.newAvailableLevel = potentialNewAvailableLevel;
				}

				if(_that.state.level !== data.level) {
					newState.level = data.level;
				}

				 if( (_that.state.progression.percentageDone !== newDataProgression.percentageDone) ||
						 (_that.state.progression.percentageGood !== newDataProgression.percentageGood)
				 ) {
					 newState.progression = {percentageDone : newDataProgression.percentageDone,
						 percentageGood : newDataProgression.percentageGood}
				};

				_that.setState(newState)
			}})
		.catch(error => {console.error('retrieveScores for game ' + _that.props.gameName + ' and user XXX? Error: ', error);
			 })
		}

	componentDidMount() {
	    this.updateScores();
	}

	componentDidUpdate() {
	    this.updateScores();
	}

	render() {
		const { t } = this.props;

		if (this.props.isAvailable) {
    return (
			<div className="cardGame" id={this.props.gameName}>
          <div className="cardGameDecorationCharacterTop">{this.props.decorationCharacter}<br/></div>
          <div className="cardGameAbstractText">{this.props.gameTextAbstract}</div><br/>
					<GameLevelSelector userLoggedIn={this.props.userLoggedIn} levelsAvailable={this.state.levelsAvailable}
							level={this.state.level} changeLevel={this.changeLevel}/>
          <GameScores gameName={this.props.gameName} level={this.state.level} percentageGood={this.state.progression.percentageGood}
						percentageDone={this.state.progression.percentageDone}
								userLoggedIn={this.props.userLoggedIn}/>
          <div className="cardGameGoButton" onClick={this.onClick}>{t("GameCard_go")}</div><br/>
          <div className="cardGameDecorationCharacterBottom">{this.props.decorationCharacter}</div>
			</div>
		);
  }
	else {
				return (
          <div className="cardGameComingSoon" id={this.props.gameName} onClick={(e) => {e.preventDefault();}}>
            <div className="cardGameDecorationCharacterTop">{this.props.decorationCharacter}<br/></div>
            <div className="cardGameAbstractText">{this.props.gameTextAbstract}</div><br/>
            <div className="cardGameGoButton">{t("GameCard_vote")}</div><br/>
            <div className="cardGameDecorationCharacterBottom">{this.props.decorationCharacter}</div>
    			</div>
				);
	}
 }
}
const GameCard = withTranslation()(_GameCard);
export default GameCard;
