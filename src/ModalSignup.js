import React from 'react';
import PropTypes from 'prop-types';
import {japlcejAPI, routesURLs} from './config-routes.js';
import AppMessage from './AppMessage.js';
import ModalSignupCommons from './ModalSignupCommons.js';
import ModalSignupReemissionLink from './ModalSignupReemissionLink.js'
import { i18n, useTranslation, withTranslation, Trans } from "react-i18next";


class ModalSignup extends React.Component {
   constructor(props) {
		super(props);
		this.state = {
			message : {text : null, severity : null},
      signupReemissionLinkRequest : false,

			};
		this.passwordChanged = ModalSignupCommons.passwordChanged.bind(this);
    this.confirmationPasswordChanged = this.confirmationPasswordChanged.bind(this);
		this.emailChanged = ModalSignupCommons.emailChanged.bind(this);
		this.handleSubmitSignup = this.handleSubmitSignup.bind(this);
		this.addMessage = ModalSignupCommons.addMessage.bind(this);
		this.hideMessage = ModalSignupCommons.hideMessage.bind(this);
    this.onSignupReemissionLinkRequest=this.onSignupReemissionLinkRequest.bind(this);
    this.onCloseReemissionLinkRequest=this.onCloseReemissionLinkRequest.bind(this);
	}

  confirmationPasswordChanged(e) {
     if(! ModalSignupCommons.isValidPassword(e.target.value) || e.target.value !== document.getElementById("password")) {
        e.target.style.backgroundColor = 'red';
     }
     else {
       e.target.style.backgroundColor ='white';
     }
   }

   onSignupReemissionLinkRequest() {
     this.setState({signupReemissionLinkRequest : true});
   }

   onCloseReemissionLinkRequest() {
     this.setState({signupReemissionLinkRequest : false});
     this.props.onClose();
   }

    handleSubmitSignup(event) {
	  var _that = this;
	  event.preventDefault();

	  //console.log("Submit Signup form bien reçu!");
	  fetch(japlcejAPI + routesURLs.SIGNUP,
			{method: "POST",
			 headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json, text/plain, */*'
			 },
			 body : JSON.stringify({email : this.state.email ,
					 password : this.state.password})
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
				_that.setState({message : {severity: 'error', text : error.text}})})
		.then( respjson => {
					// Examine the text in the response
					console.log(respjson);
					if(respjson != null && respjson.error === true) {
						_that.setState({message : {severity: 'error', text : respjson.message}});
					}
					else //NO error
					{
						console.log(_that.props);

            _that.setState({message : {severity: 'info', text : respjson?respjson.message:'oups'}});
					}
				});
  }

  render() {
    const {t} = this.props;

    // Render nothing if the "show" prop is false
    if(!this.props.show) {
      return null;
    }

    if (!this.state.signupReemissionLinkRequest)
    {
    return (
     <div className="backdrop" style={ModalSignupCommons.backdropStyle}>
        <div className="modal" style={ModalSignupCommons.modalStyle}>
		 <AppMessage severity={this.state.message.severity} message={this.state.message.text} onClose={this.hideMessage}/>

     <form onSubmit={this.handleSubmitSignup}>
			{t("SignUp_welcome")} <br/>
			<label>{t('SignUp_email')}
			<input type="email" name="email" placeholder={t("Login_your_email")} required  size="35" onChange={this.emailChanged}/>
			</label>
			<label>{t('SignUp_password')}
			<input type="password" id="password" placeholder={t("Login_your_password")} required  size="15" minLength="8"
                    maxLength="40" onChange={this.passwordChanged}/>
			</label>
      <label>{t('SignUp_confirmation_password')}
			<input type="password" id="confirmationPassword" placeholder={t("Login_your_password")} required  size="15" minLength="8"
                  maxLength="40" onChange={this.confirmationPasswordChanged}/>
			</label>

			<input type="submit" value={t('Button_submit')} />
		</form>

		 <a href="#newConfirmationLink" onClick={this.onSignupReemissionLinkRequest}>{t('SignUp_confirmation_link_needed')}</a>

          <div className="footer">
            <button onClick={this.props.onClose}>
              {t('Button_close')}
            </button>
          </div>
        </div>
      </div>
    );
  }
  else { //REEMISION LINK REQUEST
    return (<ModalSignupReemissionLink show={this.props.show}
            onClose={this.onCloseReemissionLinkRequest}>
      {t("SignUp_invitation")}</ModalSignupReemissionLink>
   );
  }
  }
}

export default withTranslation() (ModalSignup);
