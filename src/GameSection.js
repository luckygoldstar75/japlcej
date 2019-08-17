import React from 'react';
import GameReadCharacterWritePinyin from './GameReadCharacterWritePinyin';
import GameCard from './GameCard'

class Game extends React.Component {
	constructor(props) {
		super(props);
	}

  render() {
			let divBlocGame ="";

			divBlocGame = "<" + this.props.type +"/>";

		switch(this.props.type) {
    		case 'readCharacterWritePinyin':
					return ( <GameReadCharacterWritePinyin />	);
				default:
					return ( <GameReadCharacterWritePinyin />	);
	  }
  }
}

class GameSection extends React.Component {
	constructor(props) {
		super(props);
		this.state={gameSelected : this.props.gameSelected, userLoggedIn : this.props.userLoggedIn};
		this.selectGame = this.selectGame.bind(this);
		this.unselectGame = this.unselectGame.bind(this);
  }

	unselectGame() {
		this.setState({gameSelected : undefined, gameSelectedTextAbstract : undefined});
	}

	selectGame(_gameName, _gameTextAbstract) {
    this.setState({gameSelected : _gameName, gameSelectedTextAbstract : _gameTextAbstract});
  }

	render() {
		if (!this.state.gameSelected) {
    return (
			<div className="GameSection">
			<div id="GameSectionTitle">Choose your game!</div>
			  <div id="gameSelector">
			  	 <GameCard isAvailable={true} decorationCharacter="家" gameName="readCharacterWritePinyin" gameTextAbstract="Read character, write pinyin" quitGame={this.unselectGame} onClick={this.selectGame} userLoggedIn={this.props.userLoggedIn} />
					 <GameCard isAvailable={false} decorationCharacter="Vote!" gameName="readCharacterSelectFrench" gameTextAbstract="Read character, select french" />
					 <GameCard isAvailable={false} decorationCharacter="Vote!" gameName="readCharacterChoosePronunciation" gameTextAbstract="Read character, choose pronunciation" />
		    </div>
			</div>
		);
  }
	else {
				return (
					<div className="GameSection">
						<div id="gameSelector">
							 <label><input type="radio" id={this.state.gameSelected} checked="checked" readonly />
							 {this.state.gameSelectedTextAbstract}
							 </label>
							 <div className="gameReturnButton" onClick={this.unselectGame}>
					       ⇦<div className="">Return</div>
					     </div>
						</div>
						<Game type={this.state.gameSelected} />
					</div>
				);
	}
 }
}

export default GameSection;
