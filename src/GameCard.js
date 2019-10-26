import React from 'react';
import GameScores from './GameScores'
import { i18n, useTranslation, withTranslation, Trans } from "react-i18next";

class _GameCard extends React.Component {
	constructor(props) {
		super(props);
		this.state={isAvailable : this.props.isAvailable, decorationCharacter : this.props.decorationCharacter,
       gameName : this.props.gameName, gameTextAbstract: this.props.gameTextAbstract};
    this.quitGame = this.props.quitGame;
    this.onClick=this.onClick.bind(this);
		this.onNewLevel=this.onNewLevel.bind(this);
	}

	onNewLevel(_newLevel) {
		if(_newLevel !== this.state.gameLevel) {
			this.setState({gameLevel : _newLevel});
		}
	}

  onClick() {
    this.props.onClick(this.state.gameName, this.state.gameLevel ,this.state.gameTextAbstract);
  }

	render() {
		const { t } = this.props;

		if (this.state.isAvailable) {
    return (
			<div className="cardGame" id={this.state.gameName}>
          <div className="cardGameDecorationCharacterTop">{this.state.decorationCharacter}<br/></div>
          <div className="cardGameAbstractText">{this.state.gameTextAbstract}</div><br/>
          <GameScores gameName={this.state.gameName} userLoggedIn={this.props.userLoggedIn} onNewLevel={this.onNewLevel} />
          <div className="cardGameGoButton" onClick={this.onClick}>{t("GameCard_go")}</div><br/>
          <div className="cardGameDecorationCharacterBottom">{this.state.decorationCharacter}</div>
			</div>
		);
  }
	else {
				return (
          <div className="cardGameComingSoon" id={this.state.gameName} onClick={(e) => {e.preventDefault();}}>
            <div className="cardGameDecorationCharacterTop">{this.state.decorationCharacter}<br/></div>
            <div className="cardGameAbstractText">{this.state.gameTextAbstract}</div><br/>
            <div className="cardGameGoButton">{t("GameCard_vote")}</div><br/>
            <div className="cardGameDecorationCharacterBottom">{this.state.decorationCharacter}</div>
    			</div>
				);
	}
 }
}
const GameCard = withTranslation()(_GameCard);
export default GameCard;
