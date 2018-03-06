import React, { Component } from 'react';
import lampion from './lampion.jpg';
import './App.css';
import {japlcejAPI, GET_CHARACTER_URL, IS_LOGGEDIN_URL} from './config.js';
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

class LoginButton extends React.Component {
  constructor(props) {
		super(props);
		this.state = {showModalLogin: false};
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
      showModalLogin: false
    });
    
    this.props.onLoginSuccess(jsonUserLoginInfo);
  }

 render() {
    return (
    <div id="loginButton">
    <button
        className="loginbtn"
        onClick={() => this.setState({showModalLogin: true})}>Log In
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
    <LoginButton onLoginSuccess={this.props.onLoginSuccess}/>
    </div>);	
  }
}

class App extends Component {
  constructor(props) {
	super(props);
	this.onLoginSuccess = this.onLoginSuccess.bind(this);
	fetch(japlcejAPI + IS_LOGGEDIN_URL)
			.then(response => response.json())
		.then(data => this.setState({isLoggedIn : data.isLoggedIn}));
	this.state = {currentUser: null, userChanged : false};
	
  }	

  onLoginSuccess = (jsonUserLoginInfo) => {
	  console.log("OnLoginSuccess Invoked! " + jsonUserLoginInfo);
	  var _lastSession = (jsonUserLoginInfo == null)? null : jsonUserLoginInfo.lastSession;
	  var _avatarUrl = (jsonUserLoginInfo == null)? null : jsonUserLoginInfo.avatarUrl;
	  this.setState({userChanged : true, lastSession : _lastSession, avatarUrl : _avatarUrl});
  }
 
		
  render() {	  
    return (
      <div className="App">
        <header className="App-header">
          <img src={lampion} className="App-logo" alt="logo" />
          <h1 className="App-title">Bonjour et bienvenue pour découvrir des outils vous 
					accompagnant dans l'apprentissage du chinois.</h1>
        </header>
		<MenuBar onLoginSuccess={this.onLoginSuccess} /> 
		<UserInfo userChanged={this.state.userChanged} lastSession={this.state.lastSession} avatarUrl={this.state.avatarUrl} pseudo={this.state.pseudo}/>		
		<GameSection />
      </div>
    );
  }
}

export default App;
