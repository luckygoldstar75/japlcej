import React from 'react';
import {japlcejAPI, routesURLs} from './config-routes.js';
import GameCurrentCharacter from './GameCurrentCharacter.js'
import GameCurrentResult from './GameCurrentResult.js'
import {  withTranslation } from "react-i18next";


class _GameListenThenSelectCharacter extends React.Component {
	constructor(props) {
		super(props);

		this.state = {lastResultIsFalse: undefined,
			nbTries: 0,
			nbSuccess : 0,
			currentCharacter : 	{id : null,
				character : null,
				answer : null },
			level: this.props.level,
			apiAlive:true,
			answerExpected : true
		};

		this.auSuivant = this.auSuivant.bind(this);
		this.valider = this.valider.bind(this);
		this.getSuggestedAnswersAudio = this.getSuggestedAnswersAudio.bind(this);
	}

	_auSuivant() {
		this.setState({lastResultIsFalse : undefined, apiAlive : true,
			currentCharacter : {id : 'xxxxxxxxxxxxxxx', character : '家',
				suggestedAnswers: ["maison", "femme", "enfant", "montagne"]},
				answerExpected : true,
			})

			document.getElementById("suggestionsSelect").removeAttribute("disabled");
	}

	auSuivant() {
		var that = this;
		 //fetch new Character to guess
		 fetch(japlcejAPI + routesURLs.GUESS + "/listenThenSelectCharacter/" + this.state.level,
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
				that.setState({lastResultIsFalse : undefined, apiAlive : true,
					currentCharacter : {id : respjson.id, character : respjson.value,
						suggestedAnswers: respjson.suggestedAnswers}, answerExpected:true});
				document.getElementById("suggestionsSelect").removeAttribute("disabled");
		})
		.catch((error) => {console.error('Error: when attempting to fetch new chinese character : URL :'
				+ routesURLs.GUESS + " : ", error);
				that.setState({apiAlive : false});
				}
			)
	}

	_valider() {
		this.setState({lastResultIsFalse : false,
			nbSuccess : this.state.nbSuccess+1,
			nbTries : this.state.nbTries+1, answerExpected : false});

			document.getElementById("suggestionsSelect").disabled="true";
			document.getElementById("suggestionsSelect").value="maison";
	}

	valider() {
		var that = this;
		var inputValue = document.getElementById("suggestionsSelect")
			.options[document.getElementById("suggestionsSelect").selectedIndex].value;

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
						nbTries : that.state.nbTries+1,
						answerExpected : false
						});
				}
				else {
					that.setState({lastResultIsFalse : true,
						nbTries : that.state.nbTries+1,
						answerExpected : false});
				}

				document.getElementById("suggestionsSelect").disabled="true";
				document.getElementById("suggestionsSelect").value=respjson.answer.value;
			}
		})
		.catch(error => console.error('Error: when attempting to post guess character : URL :' +
		 				routesURLs.GUESS_CHARACTER + " : ", error))
		;
	}

	getSuggestedAnswersAudio() {
			var options = null;

			if (this.state.currentCharacter != null) {options = this.state.currentCharacter.suggestedAnswers};

			if (options != null && options.length > 0) {
				return options.map((suggestedAnswer, index) => <th scope="col" class="speaker">	🔊	{suggestedAnswer}</th>);
			}
	}

  render() {
	const { t } = this.props;

	 var myCharacterAnswer = (this.state.currentCharacter.answer == null)? "😀" : this.state.currentCharacter.answer.value;
	 var lastResultCharacter="✓";
	 var lastResultCharacterStyle = 'lastResultCharacter_none';

	 if (this.state.lastResultIsFalse !== null && this.state.lastResultIsFalse !== undefined) {
		 if(this.state.lastResultIsFalse) {lastResultCharacterStyle = 'lastResultCharacter_wrong' ; lastResultCharacter="✗"}
		 		else {lastResultCharacterStyle = 'lastResultCharacter_good' ; lastResultCharacter="✓"}
	}

    return ( <div className="GuessCharacterGame">
				<GameCurrentResult nbSuccess={this.state.nbSuccess} nbTries={this.state.nbTries} />
				<div style={{display: 'flex', flexDirection: 'row', flexFlow : 'flex-wrap', justifyContent: 'center'}}>
						<GameCurrentCharacter currentCharacter={this.state.currentCharacter}  />
						<div id="lastResult" className={lastResultCharacterStyle}>{lastResultCharacter}</div>
				</div>

				<table id="suggestionsAudio" autoFocus required>
					<tbody>
					<tr id="listSuggestions">
						{this.getSuggestedAnswersAudio()}
					</tr>
					</tbody>
				</table>

				<div id="actionButtons" className="guessCharacterInput">
					<button type="button" className="actionbutton" id="Valider" autoFocus onClick={this.valider}
						disabled={!this.state.answerExpected}>{t('Game_button_submit')}↵</button>
					<button type="button" className="actionbutton" id="Suivant" autoFocus
						onClick={this.auSuivant} disabled={this.state.answerExpected}>{t('Game_button_next')}↓</button>
				</div>

			</div>
			);
  }

  componentDidMount() {
		this.auSuivant();
  }
};
const GameListenThenSelectCharacter = withTranslation()(_GameListenThenSelectCharacter)
export default GameListenThenSelectCharacter ;
