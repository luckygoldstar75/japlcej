import React from 'react';
import {japlcejAPI, routesURLs} from './config';
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
    		case 'GameReadCharacterWritePinyin':
					return ( <GameReadCharacterWritePinyin />	);
				default:
					return ( <GameReadCharacterWritePinyin />	);
	  }
  }
}

class GameSection extends React.Component {
	constructor(props) {
		super(props);
		this.state={gameSelected : this.props.gameSelected};
		this.selectGame = this.selectGame.bind(this);
  }

	selectGame(event) {
    this.setState({gameSelected : event.target.id});
  }

	render() {
		if (!this.state.gameSelected) {
    return (
			<div className="GameSection">
			<div id="GameSectionTitle">Choose your game!</div>
			  <div id="gameSelector">
			  	 <GameCard isAvailable={true} decorationCharacter="家" gameName="GameReadCharacterWritePinyin" gameTextAbstract="Read character, write pinyin" onClick={this.selectGame}/>
					 <GameCard isAvailable={false} decorationCharacter="Vote!" gameName="GameReadCharacterSelectFrench" gameTextAbstract="Read character, select french" />
					 <GameCard isAvailable={false} decorationCharacter="Vote!" gameName="GameReadCharacterChoosePronunciation" gameTextAbstract="Read character, choose pronunciation" />
		   </div>
			</div>
		);
  }
	else {
				return (
					<div className="GameSection">
						<div id="gameSelector">
							 <label>GuessCharacter<input type="radio" id="gameWritePinyinFromCharacter" checked="checked" />
							 </label>
						</div>
						<Game type={this.state.gameSelected} />
					</div>
				);
	}
 }
}

export default GameSection;
