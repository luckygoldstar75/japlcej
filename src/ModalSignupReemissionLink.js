import React from 'react';
import PropTypes from 'prop-types';
import {japlcejAPI, routesURLs} from './config-routes.js';
import AppMessage from './AppMessage.js';
import ModalSignupCommons from './ModalSignupCommons.js';
import { i18n, useTranslation, withTranslation, Trans } from "react-i18next";

class ModalSignupReemissionLink extends React.Component {
   constructor(props) {
		super(props);
		this.state = {
			message : {text : null, severity : null}
			};
		this.passwordChanged = ModalSignupCommons.passwordChanged.bind(this);
		this.emailChanged = ModalSignupCommons.emailChanged.bind(this);
    this.handleSubmitReemissionSignupRequest = this.handleSubmitReemissionSignupRequest.bind(this);
		this.addMessage = ModalSignupCommons.addMessage.bind(this);
		this.hideMessage = ModalSignupCommons.hideMessage.bind(this);
	}


  handleSubmitReemissionSignupRequest(event) {
	  var _that = this;
	  event.preventDefault();

	  //console.log("Submit Signup form bien reçu!");
	  fetch(japlcejAPI + routesURLs.SIGNUP_REEMISSION_REQUEST,
			{method: "POST",
			 headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json, text/plain, */*'
			 },
			 body : JSON.stringify({email : this.state.email})
			 ,
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
				_that.setState.message = {severity: 'error', text : error}})
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
    const { t } = this.props;

    // Render nothing if the "show" prop is false
    if(!this.props.show) {
      return null;
    }

      return (
       <div className="backdrop" style={ModalSignupCommons.backdropStyle}>
       <div className="modal" style={ModalSignupCommons.modalStyle}>
  		 <AppMessage severity={this.state.message.severity} message={this.state.message.text} onClose={this.hideMessage}/>
        <form onSubmit={this.handleSubmitReemissionSignupRequest}>
  			  <div className="Modal_Title">{t('SignUp_welcome_reemission_link')}<br/><br/></div>
         <div className="Modal_Label">
         <label>{t('SignUp_email')}
  			 <input type="email" name="email" placeholder="youremail@here" required  size="35" onChange={this.emailChanged}/>
   			</label>
          </div>
  			 <input type="submit" value={t('Button_submit')} />
  		  </form>
         <div className="footer">
          <button onClick={this.props.onClose}>
                {t('Button_close')}
          </button>
         </div>
       </div>
       </div>
      );
  }
}
export default withTranslation() (ModalSignupReemissionLink);
