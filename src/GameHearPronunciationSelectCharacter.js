import React from 'react';
import {japlcejAPI, routesURLs} from './config-routes.js';
import GameCurrentCharacter from './GameCurrentCharacter.js';
import GameCurrentResult from './GameCurrentResult.js';
import CharacterSuggestion from './CharacterSuggestion.js';
import GameCurrentPronunciationForGuess from './GameCurrentPronunciationForGuess';

import {  withTranslation } from "react-i18next";

class _GameHearCharacterChoosePronunciation extends React.Component {
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
			answerExpected : true,
			selectedSuggestionIndex : undefined
		};

		this.auSuivant = this.auSuivant.bind(this);
		this.valider = this.valider.bind(this);
		this.getSuggestedAnswers = this.getSuggestedAnswers.bind(this);
		this.setSelectedSuggestionIndex = this.setSelectedSuggestionIndex.bind(this);
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
		 fetch(japlcejAPI + routesURLs.GUESS + "/hearPronunciationSelectCharacter/" + this.state.level,
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
					currentCharacter : {id : respjson.id, audio : respjson.value,
						suggestedAnswers: respjson.suggestedAnswers}, answerExpected:true,
					selectedSuggestionIndex : 0	});
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

		if (this.state.currentCharacter == null) {
			console.log("currentCharacter is empty : valider impossible. Nothing done");
			return;
		};

		var inputValue = this.state.currentCharacter.suggestedAnswers[this.state.selectedSuggestionIndex].audio;

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


				if(respjson.isGood) {
					that.setState(
						{currentCharacter : _currentCharacter,
						lastResultIsFalse : false,
						nbSuccess : that.state.nbSuccess+1,
						nbTries : that.state.nbTries+1,
						answerExpected : false,
						answer: respjson.answer.value
						});
				}
				else {
					that.setState(
						{currentCharacter : _currentCharacter,
						lastResultIsFalse : true,
						nbTries : that.state.nbTries+1,
						answerExpected : false,
						answer: respjson.answer.value
					});
				}
			}
		})
		.catch(error => console.error('Error: when attempting to post guess character : URL :' +
		 				routesURLs.GUESS_CHARACTER + " : ", error))
		;
	}

	getSuggestedAnswers() {
			if (typeof this.getSuggestedAnswers.counter == 'undefined') {
				this.getSuggestedAnswers.counter = 0;
			}
			var options = null;
			var _that=this;

			if (this.state.currentCharacter != null) {options = this.state.currentCharacter.suggestedAnswers};

			if (options != null && options.length > 0) {
				var resultingOptions =  options.map((_suggestedAnswer, _index) =>
						<th scope="col" className="characterSuggestionCell" key={"audio_".concat(_index)}>
							<CharacterSuggestion key={"characterSuggtraditionalestion_".concat(this.getSuggestedAnswers.counter++)}
											character={_suggestedAnswer} setSelectedSuggestionIndex={_that.setSelectedSuggestionIndex.bind(_that, _index)}
							 				isSelected={_index === _that.state.selectedSuggestionIndex}
											isGoodAnswer={_that.state.answer === _suggestedAnswer.audio}
											isActive={_that.state.answerExpected === true}
 							/>
						</th>
					);

				return resultingOptions;
			}
			else return null;
	}

	setSelectedSuggestionIndex(_index) {
		if (_index !== null && _index !== undefined && typeof _index === "number" && !isNaN(_index) &&  _index >= 0
					&& this.state.currentCharacter !==null && this.state.currentCharacter !== undefined
					&& this.state.currentCharacter.suggestedAnswers !==null && this.state.currentCharacter.suggestedAnswers !== undefined
					&& _index < this.state.currentCharacter.suggestedAnswers.length && this.state.selectedSuggestionIndex !== _index) {
				this.setState({selectedSuggestionIndex : _index});
		}
	}

  render() {
	const { t } = this.props;

	 var lastResultCharacter="✓";
	 var lastResultCharacterStyle = 'lastResultCharacter_none';

	 if (this.state.lastResultIsFalse !== null && this.state.lastResultIsFalse !== undefined) {
		 if(this.state.lastResultIsFalse) {lastResultCharacterStyle = 'lastResultCharacter_wrong' ; lastResultCharacter="✗"}
		 		else {lastResultCharacterStyle = 'lastResultCharacter_good' ; lastResultCharacter="✓"}
	}

	if (this.state.currentCharacter.id === null) {return null};

    return ( <div className="GuessCharacterGame">
				<GameCurrentResult nbSuccess={this.state.nbSuccess} nbTries={this.state.nbTries} />
				<div style={{display: 'flex', flexDirection: 'row', flexFlow : 'flex-wrap', justifyContent: 'center'}}>
						<GameCurrentPronunciationForGuess words={this.state.currentCharacter.audio} />
						<div id="lastResult" className={lastResultCharacterStyle}>{lastResultCharacter}</div>
				</div>

				<div style={{display: 'flex', flexDirection: 'row', flexFlow : 'flex-wrap', justifyContent: 'center'}}>
				<table id="suggestionsCharacters" autoFocus required>
					<tbody>
					<tr id="listSuggestions">
						{this.getSuggestedAnswers()}
					</tr>
					</tbody>
				</table>
				</div>

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
const GameHearPronunciationSelectCharacter = withTranslation()(_GameHearCharacterChoosePronunciation)
export default GameHearPronunciationSelectCharacter ;
