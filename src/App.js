import React, { Component } from 'react';
import lampion from './lampion.jpg';
import './App.css';
import {japlcejAPI, routesURLs} from './config.js';
import ModalLogin from './ModalLogin.js'
import GameSection from './GameSection.js'
import UserInfo from './UserInfo.js'

class Hamburger extends React.Component {
  render() {
    return (<a href="#menu">
				&#9776; Menu
			</a>
	);
  }
}

class LogInOutButton extends React.Component {
  constructor(props) {
		super(props);
		this.state = {showModalLogin: false, userLoggedIn : this.props.userLoggedIn};
		this.toggleModalLogin = this.toggleModalLogin.bind(this);
		this.onLoginSuccess = this.onLoginSuccess.bind(this);	
	}	

  toggleModalLogin = () => {
    this.setState({
      showModalLogin: !this.state.showModalLogin
    });
  }
  
  onLoginSuccess = (jsonUserLoginInfo) => {
	  this.setState({
      showModalLogin: false,
      userLoggedIn:true      
    });
    
    this.props.onLoginSuccess(jsonUserLoginInfo);
  }

  onClickLogInOutButton() {
	  this.setState({showModalLogin: !this.state.userLoggedIn});
	  
	  if (this.state.userLoggedIn) { // le client clique pour logout
		  fetch(japlcejAPI + routesURLs.LOGOUT)
			.then(response => response.json())
		.then(data => {
			this.setState({userLoggedIn : false});
			this.onLoginSuccess(null); // on efface les infos clients de la session précédente
			});
	  }
	  else // le client clique pour login
	  {
		  // rien à faire . ShowModal fait
	  }
  }	

 render() { //onClick={() => this.setState((this.state.userLoggedIn)?{showModalLogin: true}:{userLoggedIn: false})}>{(this.state.userLoggedIn)? "Log Out" : "Log In"}
    return (
    <div id="loginZone">
    <button
        className="loginbtn"
        onClick={() => this.onClickLogInOutButton()}>{(this.state.userLoggedIn)? "Log Out" : "Log In"}
    </button>

    <ModalLogin show={this.state.showModalLogin} onClose={this.toggleModalLogin} onLoginSuccess={this.onLoginSuccess}>Veuillez saisir vos identifiants de connexion</ModalLogin>
   </div>
	);
  } 
}	

class MenuBar extends React.Component {
  constructor(props) {
		super(props);
	}	
		
  render() {
    return (<div className="MenuBar">
    <Hamburger />
    </div>);	
  }
}

class App extends Component {
  constructor(props) {
	super(props);
	this.onLoginSuccess = this.onLoginSuccess.bind(this);
	fetch(japlcejAPI + routesURLs.IS_LOGGEDIN_URL)
			.then(response => response.json())
		.then(data => this.setState({isLoggedIn : data.isLoggedIn}));
	this.state = {currentUser: null, userChanged : false};
	
  }	

  onLoginSuccess = (jsonUserLoginInfo) => {
	  console.log("OnLoginSuccess Invoked! " + jsonUserLoginInfo);
	  var _lastSession = (jsonUserLoginInfo == null)? null : jsonUserLoginInfo.lastSession;
	  var _avatarUrl = (jsonUserLoginInfo == null)? null : jsonUserLoginInfo.avatarUrl;
	  var _pseudo = (jsonUserLoginInfo == null)? null : jsonUserLoginInfo.pseudo;
	  
	  this.setState({userChanged : true, lastSession : _lastSession, avatarUrl : _avatarUrl, pseudo : _pseudo});
  }
 
		
  render() {	  
    return (
      <div className="App">
        <header className="App-header">
          <img src={lampion} className="App-logo" alt="logo" />
          <h1 className="App-title">Bonjour et bienvenue pour découvrir des outils vous 
					accompagnant dans l'apprentissage du chinois.</h1>
        </header>
		<MenuBar /> 
		<LogInOutButton onLoginSuccess={this.onLoginSuccess} userLoggedIn={this.state.userLoggedIn} />
		<UserInfo userChanged={this.state.userChanged} lastSession={this.state.lastSession} avatarUrl={this.state.avatarUrl} pseudo={this.state.pseudo}/>		
		<GameSection />
      </div>
    );
  }
}

export default App;
