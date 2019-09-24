import React, { Component } from 'react';
import lampion from './lampion.jpg';
import './App.css';
import {japlcejAPI, routesURLs} from './config.js';
import ModalLogin from './ModalLogin.js'
import ModalSignup from './ModalSignup.js'
//import ModalSignupReemissionLink from './ModalSignupReemissionLink.js'

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

class SignUpButton extends React.Component {
  constructor(props) {
		super(props);
		this.state = {showModalSignUp: false,
      showModalSignUpReemissionLink : false,
      userSignedUp : this.props.userSignedUp,
      userLoggedIn : this.props.userLoggedIn};
		this.closeModalSignUp =  this.closeModalSignUp.bind(this);
	}

  closeModalSignUp() {
    this.setState({
      showModalSignUp: false
    });
  }

  onClickSignUpButton() {
	  this.setState({showModalSignUp: true,
		userSignedUp: false});
  }

 render() {
	if(this.state.userLoggedIn) {
      return null;
    }

    return (
    <div id="signupZone" className="signupZone">
    <button
        className="signupbtn" title="Sign Up"
        onClick={() => this.onClickSignUpButton()}>{(this.state.userSignedUp)? "Welcome!" : "Sign Up"}
    </button>

    <ModalSignup show={this.state.showModalSignUp}  onClose={this.closeModalSignUp}>Inscrivez-vous en quelques clics</ModalSignup>
    </div>
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

 onLogoutSuccess = () => {
	  this.setState({
      showModalLogin: false,
      userLoggedIn:false
    });
  }

  onClickLogInOutButton() {
	  if (this.state.userLoggedIn) { // le client clique pour logout
		  fetch(japlcejAPI + routesURLs.LOGOUT, {
			 method: "GET",
			 headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json, text/plain, */*'
			 },
			 credentials : 'include',
			 mode : 'cors',
			 redirect : 'follow'
			})
      .then(response => {return({code : response.status , json : response.json()})})
  		.catch(error => {console.error('Logout Error:', error);
  		 })
  		.then(data => {
  			if (data != null  && data.code === 200 && (data.json === null || data.json.error == null)) {
          this.setState({userLoggedIn : false});
  				this.props.onLogoutSuccess(); // on efface les infos clients de la session précédente
  			}
        else {
  				console.error('Logout error . Code:', data.code, ' Error:' , data.json);
  			}
      })
		 .catch(error => {console.error('Logout Error:', error);
		 	})
	  }
	  else // le client clique pour login
	  {
		  this.setState({showModalLogin: true,
		  userLoggedIn: false,});
	  }
  }

 render() { //onClick={() => this.setState((this.state.userLoggedIn)?{showModalLogin: true}:{userLoggedIn: false})}>{(this.state.userLoggedIn)? "Log Out" : "Log In"}
    return (
    <div id="loginZone" className="loginZone">
    <button
        className="loginbtn" title="Log Out"
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
  this.onLogoutSuccess = this.onLogoutSuccess.bind(this);
  this.onSignUpSuccess = this.onSignUpSuccess.bind(this);

  this.state = {currentUser: null, userChanged : false, lastSession : null ,
		avatarUrl:null, pseudo : null, userSignedUp: false};
  }

  onLoginSuccess = (jsonUserLoginInfo) => {
	console.log("OnLoginSuccess Invoked! " + jsonUserLoginInfo);

	var _lastSession = null, _avatarUrl = null, _pseudo = null;
	if (jsonUserLoginInfo) {
	  _lastSession = jsonUserLoginInfo.lastSession;
	  _avatarUrl = jsonUserLoginInfo.avatarUrl;
	  _pseudo =  jsonUserLoginInfo.pseudo;
	}

	this.setState({userLoggedIn : true, userChanged : true, lastSession : _lastSession, avatarUrl : _avatarUrl, pseudo : _pseudo});
  }

  onLogoutSuccess = () => {
	  console.log("OnLogoutSuccess Invoked! ");
	  this.setState({userLoggedIn : false, userChanged : true, lastSession : null, avatarUrl : null, pseudo : null});
  }

  onSignUpSuccess = () => {
      this.setState({userSignedUp: true});
  }

  render() {
	  const logoStyle = {
		backgroundImage: "url(" + lampion +")",
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover', /* Make the image cover the div */
		width: '40px',
		height: '40px',
    };

	const loginSignupButtonsStyle ={
		display: 'flex',
		flexDirection:'row',
		margin : '2px',
		flexFlow : 'flex-wrap',
	};

    return (
      <div className="App">
		<div id="top" className="App-top">
          <header className="App-header" >
            <div id="App-logo" style={logoStyle} alt="logo" />
            <div id="App-title" className="App-title">Bonjour et bienvenue pour découvrir des outils vous accompagnant dans l'apprentissage du chinois.</div>
            <div id="App-logo" style={logoStyle} alt="logo" />
          </header>
		  <div id="toolbar" className="App-toolbar">
			<div id="signuploginbuttons" style={loginSignupButtonsStyle} >
			    <LogInOutButton onLoginSuccess={this.onLoginSuccess} onLogoutSuccess={this.onLogoutSuccess} userLoggedIn={this.state.userLoggedIn} />
			    <SignUpButton onSignUpSuccess={this.onSignupSuccess} userSignedUp={this.state.userSignedUp} />
			    <MenuBar />
			</div>
		  </div>
		</div>
		<UserInfo userChanged={this.state.userChanged} lastSession={this.state.lastSession} avatarUrl={this.state.avatarUrl} pseudo={this.state.pseudo}/>
		<GameSection gameSelected={undefined} userLoggedIn={this.state.userLoggedIn} />
      </div>
    );
  }

  componentDidMount() {
	fetch(japlcejAPI + routesURLs.IS_LOGGEDIN,{
			 method: "GET",
			 headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json, text/plain, */*'
			 },
			 credentials : 'include',
			 mode : 'cors',
			 redirect : 'follow'
			}
	)
	.then(data => { if (data != null) {this.setState({userLoggedIn : data.isLoggedIn})}})
	.catch(error => {console.error('IsLoggedIn Error: ', error);
		 })
  }
}

export default App;
