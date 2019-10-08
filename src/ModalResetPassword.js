import React from 'react';
import PropTypes from 'prop-types';
import {japlcejAPI, routesURLs} from './config-routes.js';
import AppMessage from './AppMessage.js';
import ModalSignupCommons from './ModalSignupCommons.js';
import ModalSignupReemissionLink from './ModalSignupReemissionLink.js'
import queryString from 'query-string';
import { withRouter } from "react-router-dom";

class ModalResetPassword extends React.Component {
   constructor(props) {
		super(props);
    var _email= queryString.parse(decodeURI(this.props.location.search)).email;
    var _link = queryString.parse(decodeURI(this.props.location.search)).link;

		this.state = {
			message : {severity : null, text : null},
      show : this.props.show,
      email : _email,
      link : _link
			};
		this.passwordChanged = ModalSignupCommons.passwordChanged.bind(this);
    this.confirmationPasswordChanged = this.confirmationPasswordChanged.bind(this);
		this.emailChanged = ModalSignupCommons.emailChanged.bind(this);
		this.handleSubmitPasswordReset = this.handleSubmitPasswordReset.bind(this);
		this.addMessage = ModalSignupCommons.addMessage.bind(this);
		this.hideMessage = ModalSignupCommons.hideMessage.bind(this);
	}

  isInputPasswordOK() {
    var password = document.getElementById("password").value;
    var confirmationPassword = document.getElementById("confirmationPassword").value;

    return (ModalSignupCommons.isValidPassword(password) &&
      password === confirmationPassword);
  }

  confirmationPasswordChanged(e) {
     if(this.isInputPasswordOK()) {
        e.target.style.backgroundColor = 'white';
     }
     else {
       e.target.style.backgroundColor ='red';
     }
   }

    handleSubmitPasswordReset(event) {
	  var _that = this;
	  event.preventDefault();

    if(!_that.isInputPasswordOK()) {
      _that.setState({message : {severity: 'error', text : "please check passwords : they must match, contain 1 special character and 1 uppercase! Thank you!"}});
      return;
    }

	  //console.log("Submit Signup form bien reçu!");
	  fetch(japlcejAPI + routesURLs.DO_PASSWORD_RESET,
			{method: "POST",
			 headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json, text/plain, */*'
			 },
			 body : JSON.stringify({email : this.state.email ,
					 password : this.state.password, link: this.state.link})
			 ,
			 //credentials : 'include',
			 mode : 'cors',
			 redirect : 'follow'
			}
		).then(response => {
				if (response != null) {
					if (response.ok) {
					  //window.location = '/'	;
					}
					var contentType = response.headers.get("content-type");
					if(contentType && contentType.includes("application/json")) {
						return response.json();
					}
					throw new TypeError("Oops, we haven't got JSON!");
				}
				else return null;
		  })
	 	.catch(error => {console.error('Error:', error);
				_that.setState({message: {severity :'error', text : "unexpected error occured!"}})})
		.then( respjson => {
					// Examine the text in the response
					console.log(respjson);
					if(respjson != null && respjson.error === true) {
						_that.setState({message : {severity: 'error', text : respjson.message}});
					}
					else //NO error
					{
						console.log(_that.props);
            // TODO SET cookie auth to be back loggued and redirect to /login  avec email set??
            _that.setState({message : {severity: 'info', text : respjson?respjson.message:'Good job! Reset password was successfull!'}});
            _that.props.history.push("/login/?email=" + respjson.email);
					}
				});
  }

  render() {
    // Render nothing if the "show" prop is false
    if(!this.state.show) {
      return null;
    }

    return (
     <div className="backdrop" style={ModalSignupCommons.backdropStyle}>
        <div className="modal" style={ModalSignupCommons.modalStyle}>
		 <AppMessage severity={this.state.message.severity} message={this.state.message.text} onClose={this.hideMessage}/>

     <form onSubmit={this.handleSubmitPasswordReset}>
			Bienvenue pour votre changement de mot de passe <br/>
			<label>Email
			<input type="email" name="email" value={this.state.email==null?'':this.state.email} placeholder="youremail@here" required  size="35" onChange={this.emailChanged}/>
			</label>
			<label>Password
			<input type="password" id="password"  placeholder="your password"required  size="15" minLength="8"
                    maxLength="40" onChange={this.passwordChanged}/>
			</label>
      <label>Confirmation Password
			<input type="password" id="confirmationPassword" placeholder="your password"required  size="15" minLength="8"
                  maxLength="40" onChange={this.confirmationPasswordChanged}/>
			</label>

			<input type="submit" value="Submit" />
		</form>

        <div className="footer">
            <button onClick={() => {this.setState({show : false})}}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ModalResetPassword);
