import React from 'react';
import {japlcejAPI, routesURLs} from './config-routes.js';
import GameCurrentCharacter from './GameCurrentCharacter.js'
import GameCurrentResult from './GameCurrentResult.js'
import {  withTranslation } from "react-i18next";

class _GameReadCharacterWritePinyinGameInput extends React.Component {
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
			const { t } = this.props;

				var answerExpected = (this.props.lastResultIsFalse == null) ;
				var i=document.getElementById("saisiePinyin");
				if (i) {
				if(!this.props.apiAlive)
				{
				  i.value="===> Sorry, our servers are unavailable to check your answer right now! Please, come back later!"
				}
				else if (this.props.lastResultIsFalse === undefined) {
				  i.value=""
				}
				else if(this.props.apiAlive===false) {
					i.className="pinyintextareawrong";
					i.value += " ===> Sorry, our servers are unavailable to check your answer right now! Please, come back later ";
					i.className="pinyintextarea";
					i.focus();
				}
				else if(this.props.lastResultIsFalse===true) {
				  i.className="pinyintextareawrong";
				  i.value += " ===> Remember and you will make better next time :  " + this.props.currentCharacterPinyin;
				  i.className="pinyintextarea";
				  i.focus();
				}
				else if (this.props.lastResultIsFalse ===false) {
				  i.value = "Excellent! That's what we call a nice shot!";
				}
				}
				//{this.pinyinSpecialButtons}
				return (
				<fieldset className="guessCharacterInputFieldset">
				  <div id="actions" className="guessCharacterInput">
						<div id="actionsPinYinButtonsLot1">
							<table >
							<tbody>
							<tr>
								<td><input key="ā" type="button" onClick={this.addChar} value="ā" className="pinyinbutton" /></td>
								<td><input key="á" type="button" onClick={this.addChar} value="á" className="pinyinbutton" /></td>
								<td><input key="ǎ" type="button" onClick={this.addChar} value="ǎ" className="pinyinbutton" /></td>
								<td><input key="à" type="button" onClick={this.addChar} value="à" className="pinyinbutton" /></td>
							</tr>
							<tr>
								<td><input key="ē" type="button" onClick={this.addChar} value="ē" className="pinyinbutton" /></td>
								<td><input key="é" type="button" onClick={this.addChar} value="é" className="pinyinbutton" /></td>
								<td><input key="ě" type="button" onClick={this.addChar} value="ě" className="pinyinbutton" /></td>
								<td><input key="è" type="button" onClick={this.addChar} value="è" className="pinyinbutton" /></td>
							</tr>
							<tr>
								<td><input key="ō" type="button" onClick={this.addChar} value="ō" className="pinyinbutton" /></td>
								<td><input key="ó" type="button" onClick={this.addChar} value="ó" className="pinyinbutton" /></td>
								<td><input key="ǒ" type="button" onClick={this.addChar} value="ǒ" className="pinyinbutton" /></td>
								<td><input key="ò" type="button" onClick={this.addChar} value="ò" className="pinyinbutton" /></td>
							</tr>
							</tbody>
							</table>
						</div>

						<div id ="actionsPinYinButtonsLot2">
							<table >
							<tbody>
							<tr>
								<td><input key="ī" type="button" onClick={this.addChar} value="ī" className="pinyinbutton" /></td>
								<td><input key="í" type="button" onClick={this.addChar} value="í" className="pinyinbutton" /></td>
								<td><input key="ǐ" type="button" onClick={this.addChar} value="ǐ" className="pinyinbutton" /></td>
								<td><input key="ì" type="button" onClick={this.addChar} value="ì" className="pinyinbutton" /></td>
							</tr>
							<tr>
								<td><input key="ū" type="button" onClick={this.addChar} value="ū" className="pinyinbutton" /></td>
								<td><input key="ú" type="button" onClick={this.addChar} value="ú" className="pinyinbutton" /></td>
								<td><input key="ǔ" type="button" onClick={this.addChar} value="ǔ" className="pinyinbutton" /></td>
								<td><input key="ù" type="button" onClick={this.addChar} value="ù" className="pinyinbutton" /></td>
							</tr>
							<tr>
								<td><input key="ǖ" type="button" onClick={this.addChar} value="ǖ" className="pinyinbutton" /></td>
								<td><input key="ǘ" type="button" onClick={this.addChar} value="ǘ" className="pinyinbutton" /></td>
								<td><input key="ǚ" type="button" onClick={this.addChar} value="ǚ" className="pinyinbutton" /></td>
								<td><input key="ǜ" type="button" onClick={this.addChar} value="ǜ" className="pinyinbutton" /></td>
							</tr>
							</tbody>
							</table>
					   </div>


					</div>

					<div id="actionsButtonsGuessCharacterPinyin" className="guessCharacterInput">
						<button type="button" className="actionbutton" id="Valider" autoFocus onClick={this.handleInputValidated}
							disabled={!answerExpected}>{t('Game_button_submit')}↵</button>
						<button type="button" className="actionbutton" id="Suivant" autoFocus
							onClick={this.handleNextCharacterRequested} disabled={answerExpected}>{t('Game_button_next')}↓</button>
					</div>

					<textarea name="saisie Pinyin" id="saisiePinyin" cols="50" rows="4"
								className="pinyintextarea" spellCheck="false"
									disabled={!answerExpected || !this.props.apiAlive} onKeyPress={this.saisiePinyinKeyPressed}>
					</textarea>

					</fieldset>
				);
	}
}

const GameReadCharacterWritePinyinGameInput = withTranslation()(_GameReadCharacterWritePinyinGameInput);

class _GameReadCharacterWritePinyin extends React.Component {
	constructor(props) {
		super(props);

		this.state = {lastResultIsFalse: undefined,
			nbTries: 0,
			nbSuccess : 0,
			currentCharacter : 	{id : null,
				character : null,
				answer : null },
			level: this.props.level,
			apiAlive:true
		};

		this.auSuivant = this.auSuivant.bind(this);
		this.valider = this.valider.bind(this);
	}

	auSuivant() {
		 //fetch new Character to guess
		 fetch(japlcejAPI + routesURLs.GUESS + "/readCharacterWritePinyin/" + this.state.level,
			{method: "GET",
			 headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json, text/plain, */*'
			 },
			 //credentials : 'include',
			 mode : 'cors',
			 redirect : 'follow'
			}
		).then((response) => {
				var respjson = response.json();
				return respjson;
			})
		.then((respjson) => {
				console.debug("response fetched : " + respjson);
				this.setState({lastResultIsFalse : undefined, apiAlive : true,
					currentCharacter : {id : respjson.id, character : respjson.value, answer:null}});
		})
		.catch((error) => {console.error('Error: when attempting to fetch new chinese character : URL :'
				+ routesURLs.GUESS + " : ", error);
				this.setState({apiAlive : false});
				}
			)
	}

	valider(inputValue) {
		var that = this;

		if (this.state.currentCharacter == null) {
			console.log("currentCharacter is empty : valider impossible. Nothing done");
			return;
		};

		//post client's pinyin guess answer
		 fetch(japlcejAPI + routesURLs.GUESS + "/" + this.state.currentCharacter.id,
			{method: "POST",
			 headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json, text/plain, */*',
			 },
			 body : JSON.stringify({"type" : "string", "value" : inputValue})
			 ,
			 mode : 'cors',
			 credentials : 'include',
			 redirect : 'follow'
			}
		).then(response => {var respjson = response.json();
				//console.debug("response fetched : " + respjson);
				return respjson;
			})
		.then(respjson => {	//console.debug("response json : " + respjson);
			if (respjson != null) {
				var _currentCharacter = that.state.currentCharacter;
				_currentCharacter.answer = respjson.answer;
				that.setState({currentCharacter : _currentCharacter});
				if(respjson.isGood) {
					that.setState({lastResultIsFalse : false,
						nbSuccess : that.state.nbSuccess+1,
						nbTries : that.state.nbTries+1});
				}
				else {
					that.setState({lastResultIsFalse : true,
						nbTries : that.state.nbTries+1});
				}
			}
		})
		.catch(error => console.error('Error: when attempting to post guess character : URL :' + routesURLs.GUESS_CHARACTER + " : ", error))
		;
	}



  render() {
	const { t } = this.props;

	 var myCharacterAnswer = (this.state.currentCharacter.answer == null)? "😀" : this.state.currentCharacter.answer.value;

    return ( <div className="GuessCharacterGame">
				<GameCurrentResult nbSuccess={this.state.nbSuccess} nbTries={this.state.nbTries} />

				<GameCurrentCharacter currentCharacter={this.state.currentCharacter}  />

				<GameReadCharacterWritePinyinGameInput lastResultIsFalse={this.state.lastResultIsFalse}
					onGameInputChange={this.valider} onNextCharacterRequested={this.auSuivant}
					currentCharacter={this.state.currentCharacter}
					currentCharacterPinyin={myCharacterAnswer}
					apiAlive={this.state.apiAlive}
					/>
			</div>
			);
  }


  componentDidMount() {
	this.auSuivant();
  }
};
const GameReadCharacterWritePinyin = withTranslation()(_GameReadCharacterWritePinyin)
export default GameReadCharacterWritePinyin ;
