import React, { Component } from 'react';
import lampion from './lampion.jpg';
import './App.css';






class Hamburger extends React.Component {
  render() {
    return (<a href="#menu">
				&#9776; Menu
			</a>
	);
  }
}

class Avatar extends React.Component {
  render() {
    return (<img className="Avatar"
				src={this.props.imgurl}
				alt={this.props.pseudo}
			/>
	);
  }
}

class Rank extends React.Component {
  render() {
    return (<div className="Rank"> #{this.props.rank} / {this.props.nbpoints} pts 
			</div>);
  }
}


function nbDaysSinceLastSession(dateLastSession) {
	if(dateLastSession == null)
			return 0;
	else { 
		return (Date.now() - dateLastSession);
	}
}

class WelcomeMessage extends React.Component {
  render() {
    return (
		<div id="greeting">
			<div id="persoGreeting">
				<h1>Hello, {this.props.pseudo}. 
				C'est bon de vous revoir . Cela faisait déjà {nbDaysSinceLastSession(this.props.userLastSession)} jour(s)!</h1>
			</div>
		</div>
	);
  }
}

class UserInfo extends React.Component {
  render() {
    return (
			<div id="userInfo">
				<WelcomeMessage pseudo={this.props.user.pseudo} userLastSession={this.props.user.lastLession} />
				<div className="UserInfo">
					<Avatar pseudo={this.props.user.pseudo} imgurl={this.props.user.avatarUrl} />
					<Rank rank={this.props.user.rank} nbpoints={this.props.user.nbPoints} />
				</div>
			</div>
	);
  }
}

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
			currenCharacterPinyin : "hăo"
		};
		
		this.auSuivant = this.auSuivant.bind(this);
		this.valider = this.valider.bind(this);
	}
	
	auSuivant() {
		 //fecth new Caracter to guess
		 /* var indexHasard=Math.floor((Math.random() * caracteres.length));
		 var myCar = caracteres[indexHasard].caracter;
		 document.getElementById('caractereADeviner').innerHTML=myCar;
		 * */
		 this.setState({currentCharacter : 'è', currenCharacterPinyin : 'èe'}) ; //caracteres[indexHasard];
		 this.setState({lastResultIsFalse : undefined});
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


class App extends Component {
  
  render() {
	  
  const myUser = {
	pseudo: 'titi',
	lastSession: "2018-01-02",
	name: 'Hello Kitty',
	avatarUrl: 'http://placekitten.com/g/64/64',
	rank : "11",
	nbPoints : "94230"
  };	  
	  
    return (
      <div className="App">
        <header className="App-header">
          <img src={lampion} className="App-logo" alt="logo" />
          <h1 className="App-title">Bonjour et bienvenue pour découvrir des outils vous 
					accompagnant dans l'apprentissage du chinois.</h1>
        </header>
		<Hamburger />
		<UserInfo user={myUser}  />		
		<GameSection />
      </div>
    );
  }
}

export default App;
