import React from 'react';
import {japlcejAPI, GET_CHARACTER_URL} from './config.js';

class GuessCharacterGameCurrentResult extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (<div id="currentResult" align="center">Réussis: {this.props.nbSuccess} / Total: {this.props.nbTries} </div>);
	}
}

class GuessCharacterGameCurrentCharacter extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return (<div id="caractereADeviner" align="center" className="caracterTobeGuessed">{this.props.currentCharacter}</div>);
	}
}

class GuessCharacterGameInput extends React.Component {
	constructor(props) {
		super(props);
		this.handleInputValidated = this.handleInputValidated.bind(this);
		this.saisiePinyinKeyPressed = this.saisiePinyinKeyPressed.bind(this);
		this.handleNextCharacterRequested = this.handleNextCharacterRequested.bind(this);
		this.addChar = this.addChar.bind(this);
		
		// Build special characters buttons
		let pinyinSpecialCharacter="āáǎàēéěèōóǒòīíǐìūúǔùǖǘǚǜ";
		this.pinyinSpecialButtons=[];
	  
		for (let c of pinyinSpecialCharacter) {
			this.pinyinSpecialButtons.push(<input key={c} type="button" onClick={this.addChar} value={c} className="pinyinbutton" />)
		}
	}

	addChar(event) {
		  var _pinyinInput=document.getElementById("saisiePinyin"); 	
		  var _char=event.target.value;
		  var start = _pinyinInput.selectionStart;
		  var end = _pinyinInput.selectionEnd;
		  var text = _pinyinInput.value;
		  var before = text.substring(0, start);
		  var after  = text.substring(end, text.length);
		  _pinyinInput.value=(before + _char + after);
		
		  _pinyinInput.selectionStart = _pinyinInput.selectionEnd = start + _char.length;
		  _pinyinInput.focus();
	}

	getInputValue() {return document.getElementById("saisiePinyin").value;}
	
	handleInputValidated(e) {this.props.onGameInputChange(this.getInputValue());};
	
	saisiePinyinKeyPressed(e) {
		if (e.charCode === 13 || e.charCode === 40) {this.handleInputValidated();}; //enter or down
	}
	
	handleNextCharacterRequested(e) { this.props.onNextCharacterRequested(); }
	
	render() {  
				var answerExpected = (this.props.lastResultIsFalse == null) ;
				var i=document.getElementById("saisiePinyin");
				if (i) {
				if(this.props.lastResultIsFalse) {				  
				  i.className="pinyintextareawrong";
				  i.value += " ===> No :  " + this.props.currentCharacterPinyin;
				  i.className="pinyintextarea";
				  i.focus();
				}
				else {
				  i.value = "";		
				}}
				
				return (
				  <fieldset>
					<div id="actions" align="center">
						<button type="button" className="actionbutton" id="Valider" autoFocus onClick={this.handleInputValidated} 
							disabled={!answerExpected}>Valider↵</button>
						
						{this.pinyinSpecialButtons}
						
						<textarea name="saisie Pinyin" id="saisiePinyin" cols="50" rows="4"
								className="pinyintextarea" spellCheck="false" 
									disabled={!answerExpected} onKeyPress={this.saisiePinyinKeyPressed} />
					</div>
					<button type="button" className="actionbutton" id="Suivant" autoFocus 
						onClick={this.handleNextCharacterRequested} disabled={answerExpected}>Suivant↓</button>					
				  </fieldset>
				);
	}
}

	
class GuessCharacterGame extends React.Component {
	constructor(props) {
		super(props);	
		
		this.state = {lastResultIsFalse: undefined,
			nbTries: 0,
			nbSuccess : 0,
			currentCharacter : 	"好"	,
			currenCharacterPinyin : "hǎo"
		};
		
		this.auSuivant = this.auSuivant.bind(this);
		this.valider = this.valider.bind(this);
	}
	
	auSuivant() {
		 //fetch new Caracter to guess
		 fetch(japlcejAPI + GET_CHARACTER_URL, 
			{method: "GET",
			 headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json, text/plain, */*'
			 },			 
			 credentials : 'include',
			 mode : 'cors',
			 redirect : 'follow'
			}
		).then(response => {console.log("response fetched : " + response.json()); 
						this.setState({currentCharacter : response.json()	});
						this.setState({lastResultIsFalse : undefined});
			})
		.catch(error => console.error('Error: when attempting to fetch new chinese character : URL :' + GET_CHARACTER_URL + " : ", error))
		;
   		 //this.setState({currentCharacter : 'è', currenCharacterPinyin : 'èe'}) ; //caracteres[indexHasard];
		 
	}	
	
	valider(inputValue) {
		if(this.state.currenCharacterPinyin.toLowerCase() !== inputValue.toLowerCase()) {
			this.setState({lastResultIsFalse : true,
				nbTries : this.state.nbTries+1});
		}
		else {
			this.setState({lastResultIsFalse : false,
				nbSuccess : this.state.nbSuccess+1,
				nbTries : this.state.nbTries+1});
		}		
	}
  

  
  render() {
    return ( <div className="GuessCharacterGame">
				<GuessCharacterGameCurrentResult nbSuccess={this.state.nbSuccess} nbTries={this.state.nbTries} />

				<GuessCharacterGameCurrentCharacter currentCharacter={this.state.currentCharacter} />

				<GuessCharacterGameInput lastResultIsFalse={this.state.lastResultIsFalse} 
					onGameInputChange={this.valider} onNextCharacterRequested={this.auSuivant} 
					currentCharacter={this.state.currentCharacter} 
					currentCharacterPinyin={this.state.currenCharacterPinyin}
					/>	
			</div>
			);
  }
  
  
   componentDidMount() {
    fetch(japlcejAPI + GET_CHARACTER_URL)
      .then(response => response.json())
      .then(data => this.setState({currentCharacter : data.character}));
  }
}

class Game extends React.Component {is
  render() {
			let divBlocGame ="";
	  
				switch(this.props.type) {
					case 'GuessCharacter' : 
						divBlocGame = <GuessCharacterGame />;
						break;
					default:
				}
    return ( <div className="Game">
				 {divBlocGame}
			 </div>
			);
  }
}

class GameSection extends React.Component {
  render() {
    return ( 
			<div className="GameSection">
			  <div id="gameSelector">
			  	 <label>GuessCharacter<input type="radio" id="gameChoiceGuessCharacter" checked="checked" />
			  	 </label>
			  </div>
			  <Game type="GuessCharacter" />
			</div>
			);
  }  
}

export default GameSection;
