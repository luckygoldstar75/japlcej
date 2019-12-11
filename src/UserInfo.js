import React from 'react';
import loginLogo from './login.svg';
import {japlcejAPI, routesURLs} from './config-routes.js';
import { i18n, useTranslation, withTranslation, Trans } from "react-i18next";

class Avatar extends React.Component {
  render() {
    return (<img className="Avatar" width="38"
				src={this.props.imgurl}
				alt={this.props.pseudo}
			/>
	);
  }
}

class _Rank extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { t } = this.props;
    return (<div className="Rank"> #{this.props.rank} / {this.props.nbPoints} {t("Rank_points")}
			</div>);
  }
}
const Rank=withTranslation()(_Rank);

function nbDaysSinceLastSession(timestampLastSession) {
	if(timestampLastSession == null)
			return 0;
	else {
		var timestampDiff=Date.now() - timestampLastSession;
		var nbDaysDiff=Math.floor(timestampDiff/ (1000 * 60 *60* 24));
		return nbDaysDiff;
	}
}

class _WelcomeMessage extends React.Component {
  render() {
  const { t } = this.props;
	var welcomeString=t("WelcomeMessage_goodToSeeYou");
	if(this.props.userLastSession) {
  		var _nbDaysSinceLastSession = nbDaysSinceLastSession(this.props.userLastSession);
	   	if (isNaN(_nbDaysSinceLastSession) && _nbDaysSinceLastSession > 0) {
		  welcomeString+=t("WelcomeMessage_countingTime")
        + _nbDaysSinceLastSession + (_nbDaysSinceLastSession)>1?t("WelcomeMessage_days"):t("WelcomeMessage_day");
	        }
	}
	if (this.props.pseudo !== null && this.props.pseudo !== undefined) {
		return (
			<div id="snackbar">
				<div id="persoGreeting">
					<h1>Hello{this.props.pseudo === ""? "":",".concat(this.props.pseudo)}. {welcomeString}</h1>
				</div>
			</div>
		);
   }
   else {
	return null;
   }
  }

  componentDidMount() {
      var x = document.getElementById("snackbar");
      // Add the "show" class to DIV
      if (x !==null && x!== undefined) {
        x.className = "show";
        // After 3 seconds, remove the show class from DIV
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
      }
  }
};
const WelcomeMessage=withTranslation()(_WelcomeMessage);

class _UserInfo extends React.Component {
  constructor(props) {
		super(props);

		var myUser = { pseudo : this.props.pseudo ,
			lastSession : this.props.lastSession ,
			avatarUrl : (this.props.avatarUrl == null)?loginLogo :  this.props.avatarUrl ,
			rank:  null,
			nbPoints : null
			};

	    this.firstTimeRender = false;

	    this.state = { userInfo : myUser}; // fetch user Info

		this.retrieveRankingUserInfo();
		this.retrieveRankingUserInfo = this.retrieveRankingUserInfo.bind(this);
	}

  updateUserWithRankingUserInfo(userInfoJson) {

  }

  retrieveRankingUserInfo () {
	var _that = this;
	if (this.state.userInfo == null || this.state.userInfo.pseudo == null) {
		fetch(japlcejAPI + routesURLs.USER_RANK_INFO, {
			 method: "GET",
			 headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json, text/plain, */*'
			 },
			 //body : {},
			 credentials : 'include',
			 mode : 'cors',
			 redirect : 'follow'
			})
		.then(response => {
			if (response.ok) { return response.json();}})
		.catch(error => {console.error('Retrieve UserInfo Error:', error);
		 })
		.then(userInfoJson => {
			var avatarUrl= _that.props.avatarUrl;
			var pseudo = _that.props.pseudo;
			var lastSession = _that.props.lastSession;
			console.debug("UserInfo : retrieveUserInfo : data" : userInfoJson);
			if (userInfoJson == null) {return ;}
			else {
				var myCurrentUser = _that.state.userInfo;
					myCurrentUser.rank = userInfoJson.rank;
					myCurrentUser.nbPoints = userInfoJson.nbPoints;
					myCurrentUser.avatarUrl = avatarUrl;
					myCurrentUser.pseudo = pseudo;
					myCurrentUser.lastSession = lastSession;
				this.setState({userInfo : myCurrentUser});
			}
		});
	}
	else return;
  }

  render() {
    const { t } = this.props;

	  if (this.props.userChanged && this.firstTimeRender === false) {
		  this.firstTimeRender=true;
		  console.debug("let's call retrieveRankingUserInfo : firstTimeRender " + this.firstTimeRender) ;
		  this.retrieveRankingUserInfo();
	  }
	if (this.props.pseudo != null) {
		return (
			<div id="userInfo">
				<WelcomeMessage pseudo={this.state.userInfo.pseudo} userLastSession={this.state.userInfo.lastSession} />
				<div className="UserInfo">
					<Avatar pseudo={this.state.userInfo.pseudo} imgurl={this.state.userInfo.avatarUrl} />
					<Rank rank={this.state.userInfo.rank} nbPoints={this.state.userInfo.nbPoints} />
				</div>
			</div>
	);
	}
	else return null;
  }
}

const UserInfo = withTranslation()(_UserInfo);
export default UserInfo;
