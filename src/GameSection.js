import React from 'react';
import AppMessage from './AppMessage'
import GameReadCharacterWritePinyin from './GameReadCharacterWritePinyin';
import GameReadCharacterSelectFrench from './GameReadCharacterSelectFrench';
import GameReadCharacterChoosePronunciation from './GameReadCharacterChoosePronunciation';

import GameCard from './GameCard';
import { withTranslation  } from "react-i18next";

class _Game extends React.Component {
  render() {
		const { t } = this.props;

		switch(this.props.type) {
    		case 'readCharacterWritePinyin':
					return ( <GameReadCharacterWritePinyin level={this.props.level} />	);
				case 'readCharacterSelectFrench':
						return ( <GameReadCharacterSelectFrench level={this.props.level}  />	);
				case 'readCharacterChoosePronunciation':
								return ( <GameReadCharacterChoosePronunciation level={this.props.level} messageHook={this.props.messageHook} />	);
				default:
					return ( <AppMessage severity='error' message={t("Game_not_available_oups")} onClose={this.props.goBackToGameSelection} />	);
	  }
  }
}

const Game = withTranslation()(_Game);

class _GameSection extends React.Component {
	constructor(props) {
		super(props);
		this.state={gameSelected : this.props.gameSelected};
		this.selectGame = this.selectGame.bind(this);
		this.unselectGame = this.unselectGame.bind(this);
		this.goBackToGameSelection = this.goBackToGameSelection.bind(this);
  }

	unselectGame() {
		this.setState({gameSelected : undefined, gameSelectedTextAbstract : undefined});
	}

	selectGame(_gameName, _gameLevel, _gameTextAbstract) {
		const { t } = this.props;

		if(!this.props.userLoggedIn) {
				this.props.messageHook({severity : "info", message : t("Login_required")}); //message
		}
		else {
    	this.setState({gameSelected : _gameName, gameLevel : _gameLevel, gameSelectedTextAbstract : _gameTextAbstract});
		}
  }

	goBackToGameSelection() {
			this.setState({gameSelected : false});
	}

	componentDidUpdate() {
		// If login occurs while anonymous game started : go back logged in to gameselection
		if(!this.props.userLoggedIn && this.state.gameSelected !== undefined) {
			this.unselectGame();
		}
	}

	render() {
		const { t } = this.props;

		if (!this.state.gameSelected) {
    return (
			<div className="GameSection">
			<div id="GameSectionTitle">Choose your game!</div>
			  <div id="gameSelector">
					<GameCard isAvailable={true} decorationCharacter={t("CharacterMaison")} gameName="readCharacterSelectFrench"
								gameTextAbstract={t("GameTextAbstract_readCharacterSelectFrench")} quitGame={this.unselectGame}
						onClick={this.selectGame} userLoggedIn={this.props.userLoggedIn}/>

						<GameCard isAvailable={true} decorationCharacter="♬♪" gameName="readCharacterChoosePronunciation"
									gameTextAbstract={t("GameTextAbstract_readCharacterChoosePronunciation")} quitGame={this.unselectGame}
							onClick={this.selectGame} userLoggedIn={this.props.userLoggedIn} messageHook={this.props.messageHook} />

					 <GameCard isAvailable={true} decorationCharacter="ab" gameName="readCharacterWritePinyin"
					 		gameTextAbstract={t("GameTextAbstract_readCharacterWritePinyin")} quitGame={this.unselectGame}
							onClick={this.selectGame} userLoggedIn={this.props.userLoggedIn} />

					 <GameCard isAvailable={false} decorationCharacter={t("GameDecorationCharacter_gameNotAvailable")}
											gameName="listenThenSelectCharacter" gameTextAbstract={t("GameTextAbstract_listenThenSelectCharacter")} />
				{/*
				*/}
				</div>
			</div>
		);
  }
	else {
				return (
					<div className="GameSection">
						<div id="gameSelector">
							 <div>{t("GameTextAbstract_listenThenSelectCharacter")}</div>
							 <div className="gameReturnButton" onClick={this.unselectGame}>
	 					     ⇦<div className="">Return</div>
	 					  </div>
						</div>
						<Game type={this.state.gameSelected} level={this.state.gameLevel} messageHook={this.props.messageHook} />
					</div>
				);
	}
 }
}

const GameSection = withTranslation()(_GameSection);
export default GameSection;
