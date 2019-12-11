import React, { Component } from 'react';
import { BrowserRouter, Route/*, Link*/ } from "react-router-dom";
import queryString from 'query-string';
import { useTranslation, withTranslation } from "react-i18next";

import {japlcejAPI, routesURLs} from './config-routes.js';

import lampion from './lampion.jpg';
import './App.css';

//import TopLevelRoute from './TopLevelRoute.js'

import ModalLogin from './ModalLogin.js'
import ModalSignup from './ModalSignup.js'
import ModalResetPassword from './ModalResetPassword.js'
//import ModalSignupReemissionLink from './ModalSignupReemissionLink.js'

import UserInfo from './UserInfo';
import GameSection from './GameSection';
import AppMessage from './AppMessage';

const changeLanguage = lng => {
  const { t, i18n } = useTranslation();
  i18n.changeLanguage(lng);
};

class _Hamburger extends React.Component {
  render() {
    const { t } = this.props;

    return (<a href="#menu" className="HamburgerMenu">
				&#9776; {t('Menu')}
			</a>
	);
  }
}
const Hamburger = withTranslation()(_Hamburger);


class _SignUpButton extends React.Component {
  constructor(props) {
		super(props);
		this.state = {showModalSignUp: this.props.showModalSignup,
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
  const { t } = this.props;

	if(this.state.userLoggedIn) {
      return null;
    }

    return (
    <div id="signupZone" className="signupZone">
    <button
        className="signupbtn" title={t("SignUpButton_title")}
        onClick={() => this.onClickSignUpButton()}>{(this.state.userSignedUp)?
              t("SignUpButton_notSignedUp") : t("SignUpButton_signedUp")}
    </button>

    <ModalSignup show={this.state.showModalSignUp}  onClose={this.closeModalSignUp}>t("Signup_invitation")</ModalSignup>
    </div>
	);
  }
}
const SignUpButton = withTranslation()(_SignUpButton);


class _LogInOutButton extends React.Component {
  constructor(props) {
		super(props);
    var _email= queryString.parse(decodeURI(this.props.location)).email;

		this.state = {email: _email, showModalLogin: this.props.showModalLogin,
            showModalForgottenPassword : false,
              userLoggedIn : this.props.userLoggedIn,
              isForgottenPasswordResetRequest : this.props.isForgottenPasswordResetRequest};
		this.toggleModalLogin = this.toggleModalLogin.bind(this);
		this.onLoginSuccess = this.onLoginSuccess.bind(this);
    };

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
  		.catch(error => {console.debug('Logout Error:', error);
  		 })
  		.then(data => {
  			if (data != null  && data.code === 200 && (data.json === null || data.json.error == null)) {
          this.setState({userLoggedIn : false});
  				this.props.onLogoutSuccess(); // on efface les infos clients de la session précédente
  			}
        else {
  				console.debug('Logout error . Code:', data.code, ' Error:' , data.json);
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
    const { t } = this.props;

    return (
    <div id="loginZone" className="loginZone">
    <button
        className="loginbtn" title={t("Login_Button_Title")}
        onClick={() => this.onClickLogInOutButton()}>{(this.state.userLoggedIn)? t("Login_out") : t("Login_in")}
    </button>

    <ModalLogin email={this.state.email} show={this.state.showModalLogin} onClose={this.toggleModalLogin} onLoginSuccess={this.onLoginSuccess}
        isForgottenPasswordResetRequest={this.state.isForgottenPasswordResetRequest}>t("Login_invitation")</ModalLogin>
   </div>
	);
  }
}
const LogInOutButton = withTranslation()(_LogInOutButton);

class MenuBar extends React.Component {
  render() {
    return (<div className="MenuBar">
    <Hamburger />
    </div>);
  }
}

class _App extends Component {
  constructor(props) {
	super(props);
	this.onLoginSuccess = this.onLoginSuccess.bind(this);
  this.onLogoutSuccess = this.onLogoutSuccess.bind(this);
  this.onSignUpSuccess = this.onSignUpSuccess.bind(this);
  this.messageHook = this.messageHook.bind(this);
  this.hideMessage = this.hideMessage.bind(this);

  this.state = {currentUser: null, userChanged : false, lastSession : null ,
		avatarUrl:null, pseudo : null, userSignedUp: false,
    message : {severity: null, text : null}
    };
  }

  onLoginSuccess = (jsonUserLoginInfo) => {
	console.debug("OnLoginSuccess Invoked! " + jsonUserLoginInfo);

	var _lastSession = null, _avatarUrl = null, _pseudo = null;
	if (jsonUserLoginInfo) {
	  _lastSession = jsonUserLoginInfo.lastSession;
	  _avatarUrl = jsonUserLoginInfo.avatarUrl;
	  _pseudo =  jsonUserLoginInfo.pseudo;
	}

	this.setState({userLoggedIn : true, userChanged : true, lastSession : _lastSession, avatarUrl : _avatarUrl, pseudo : _pseudo});
  }

  onLogoutSuccess = () => {
	  console.debug("OnLogoutSuccess Invoked! ");
	  this.setState({userLoggedIn : false, userChanged : true, lastSession : null, avatarUrl : null, pseudo : null});
  }

  onSignUpSuccess = () => {
      this.setState({userSignedUp: true});
  }

  messageHook(_message) {
    this.setState({message : _message});
  }

  hideMessage() {
	  this.setState({message : {severity: null, message : null}});
  }

  render(history) {
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
    float : 'right'
	};

 const { t } = this.props;

 return (

    <BrowserRouter>
      <Route render={(history) =>
      <div className="App">
       <div id="top" className="App-top">
          <header className="App-header">
            <div id="App-logo" style={logoStyle} alt="logo" />
            <div id="App-title" className="App-title">{t("App_title")}</div>
            <div id="toolbar" className="App-toolbar">
            <div id="signuploginbuttons" style={loginSignupButtonsStyle} >
              <UserInfo userChanged={this.state.userChanged} lastSession={this.state.lastSession}
                    avatarUrl={this.state.avatarUrl} pseudo={this.state.pseudo} welcomeMessageHook={this.infoSlideInMessage}/>
              <LogInOutButton showModalLogin={(history.location.pathname === '/login')} onLoginSuccess={this.onLoginSuccess}
                             onLogoutSuccess={this.onLogoutSuccess} userLoggedIn={this.state.userLoggedIn} />
              <SignUpButton showModalSignup={(history.location.pathname==="/signup")}  onSignUpSuccess={this.onSignupSuccess} userSignedUp={this.state.userSignedUp} />
              <ModalResetPassword show={((history.location.pathname === '/login/resetPassword') && (null !== history.location.search.match("^\\?email=.*&link=.*")))}
                                 location={history.location} /*onSuccess={TODO function here = redirect to / idéalement en mode loggué}
                                 OnClose={TODO function here}*//>
             <MenuBar />
            </div>
            </div>
        </header>
       </div>

       <AppMessage severity={this.state.message.severity} message={this.state.message.message} onClose={this.hideMessage}/>

       <div className="main-route-place">
         <Route exact path="*" render={() => ( <div id="GameView">
           <GameSection gameSelected={undefined} userLoggedIn={this.state.userLoggedIn} messageHook={this.messageHook}/>
         </div>)} />
       </div>
     </div>
   }/>
  </BrowserRouter>
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

const App = withTranslation()(_App);
export default App;
