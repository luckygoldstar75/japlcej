import React from 'react';
import PropTypes from 'prop-types';
import {japlcejAPI, routesURLs} from './config-routes.js';
import AppMessage from './AppMessage.js';

class ModalLogin extends React.Component {
   constructor(props) {
		super(props);
		this.state = {
      email : this.props.email||'',
			message : {text : null, severity : null},
      isForgottenPasswordResetRequest : this.props.isForgottenPasswordResetRequest
			};
		this.passwordChange = this.passwordChange.bind(this);
		this.emailChange = this.emailChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.addMessage = this.addMessage.bind(this);
		this.hideMessage = this.hideMessage.bind(this);
    this.setForgottenPasswordMode = this.setForgottenPasswordMode.bind(this);
    this.emailPasswordForgottenChange = this.emailPasswordForgottenChange.bind(this);
    this.handleForgottenPasswordSubmit=this.handleForgottenPasswordSubmit.bind(this);
	}

 passwordChange(e) {
    this.setState({
      password: e.target.value,
      message : {text : null, severity : null},
    })
  }

  emailChange(e) {
    this.setState({
      email: e.target.value,
      message :	{text : null, severity : null},
    })
  }

  emailPasswordForgottenChange(e) {
    this.setState({
      email: e.target.value,
      message :	{text : null, severity : null},
    })
  }

  setForgottenPasswordMode() {
    this.setState({isForgottenPasswordRequest : true});
  }

  addMessage(message) {
	  if (message == null) {
		  this.setState({message : {severity: null, text : null}});
	  }
	  else {
		  this.setState({message : {severity: message.severity, text : message.text}});
	  }
  }

  hideMessage() {
	  this.setState({message : {severity: null, text : null}});
  }

  handleSubmit(event) {
	  var _that = this;
	  event.preventDefault();

	  //console.log("Submit login form bien reçu!");
	  fetch(japlcejAPI + routesURLs.LOGIN,
			{method: "POST",
			 headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json, text/plain, */*'
			 },
			 body : JSON.stringify({email : this.state.email ,
					 password : this.state.password, test: "test"})
			 ,
			 credentials : 'include',
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
					if(respjson != null && respjson.error != null) {
						_that.setState({message : {severity: 'error', text : respjson.errMessage}});
					}
					else //NO error
					{
						console.log(_that.props);
						_that.props.onLoginSuccess(respjson);
					}
				});
  }

  handleForgottenPasswordSubmit(event) {
    var _that = this;
    event.preventDefault();

    //console.log("Submit login form bien reçu!");
    fetch(japlcejAPI + routesURLs.LOGIN_FORGOT_PASSWORD,
      {method: "POST",
       headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*'
       },
       body : JSON.stringify({email : this.state.email })
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
          if(respjson != null && respjson.error != null) {
            _that.setState({message : {severity: 'error', text : respjson.errMessage}});
          }
          else //NO error
          {
            console.log(_that.props);
            _that.setState({message : {severity: 'info', text : respjson.message}});
          }
        });
  }

  render() {
    // Render nothing if the "show" prop is false
    if(!this.props.show) {
      return null;
    }

    // The gray background
    const backdropStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: 50
    };

    // The modal "window"
    const modalStyle = {
      backgroundColor: '#fff',
      borderRadius: 5,
      maxWidth: 500,
      minHeight: 300,
      margin: '0 auto',
      padding: 30
    };



      if (!this.state.isForgottenPasswordRequest)
      {
        return (
        <div id="loginInputZone">
          <div className="backdrop" style={backdropStyle}>
          <div className="modal" style={modalStyle}>
        		  <AppMessage severity={this.state.message.severity} message={this.state.message.text} onClose={this.hideMessage}/>
        			Merci de saisir vos identifiants pour vous connecter<br/>
            <form onSubmit={this.handleSubmit}>
            	<label>Email
            	<input type="email" name="email" value={this.state.email} placeholder="youremail@here" required  size="35" onChange={this.emailChange}/>
            	</label>
            	<label>Password
            	<input type="password" name="password" placeholder="your password"required  size="15" maxLength="40" onChange={this.passwordChange}/>
            	</label>
            	<input type="submit" value="Submit" />
            </form>
            <div className="footer">
                 <a href="#forgottenPassword" onClick={this.setForgottenPasswordMode}>Mot de passe oublié ?</a>
                 <button onClick={this.props.onClose}>
                  Close
                 </button>
            </div>
        </div>
        </div>
     </div>
  );
  }
  else { // forgottenPasswordRequest
    return(
    <div id="loginInputZone">
      <div className="backdrop" style={backdropStyle}>
      <div className="modal" style={modalStyle}>
          <AppMessage severity={this.state.message.severity} message={this.state.message.text} onClose={this.hideMessage}/>
    <form onSubmit={this.handleForgottenPasswordSubmit}>
			Merci de saisir les informations nécessaires pour que nous puissions vous renvoyer un mail de confirmation <br/>
			<label>Email
			<input type="email" name="email" placeholder="youremail@here" required  size="35" onChange={this.emailPasswordForgottenChange}/>
			</label>
			<input type="submit" value="Submit" />
		</form>
    <div className="footer">
      <button onClick={this.props.onClose}>
        Close
      </button>
    </div>
      </div>
      </div>
   </div>
 );
 }
}}

ModalLogin.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node
};

export default ModalLogin;
