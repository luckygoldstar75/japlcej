import React from 'react';
import loginLogo from './login.svg';
import {japlcejAPI, routesURLs} from './config.js';

class Avatar extends React.Component {
  render() {
    return (<img className="Avatar" width="38"
				src={this.props.imgurl}
				alt={this.props.pseudo}
			/>
	);
  }
}

class Rank extends React.Component {
  render() {
    return (<div className="Rank"> #{this.props.rank} / {this.props.nbPoints} pts 
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
	if (this.props.pseudo !== null) {
		return (
			<div id="greeting">
				<div id="persoGreeting">
					<h1>Hello, {this.props.pseudo}. 
					C'est bon de vous revoir . Cela faisait déjà {nbDaysSinceLastSession(this.props.userLastSession)} jour(s)!</h1>
				</div>
			</div>
		);
   }
   else {
	return null;
   }
  }
};

class UserInfo extends React.Component {
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
			console.log("UserInfo : retrieveUserInfo : data" : userInfoJson);
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
	  if (this.props.userChanged && this.firstTimeRender === false) {
		  this.firstTimeRender=true;
		  console.log("let's call retrieveRankingUserInfo : firstTimeRender " + this.firstTimeRender) ;
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


export default UserInfo;
