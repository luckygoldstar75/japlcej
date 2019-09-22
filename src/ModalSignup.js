import React from 'react';
import PropTypes from 'prop-types';
import {japlcejAPI, routesURLs} from './config.js';
import AppMessage from './AppMessage.js';

const minimumPasswordSize = 8;

class ModalSignup extends React.Component {
   constructor(props) {
		super(props);
		this.state = {
			message : {text : null, severity : null}
			};
		this.passwordChanged = this.passwordChanged.bind(this);
    this.confirmationPasswordChanged = this.confirmationPasswordChanged.bind(this);
		this.emailChanged = this.emailChanged.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.addMessage = this.addMessage.bind(this);
		this.hideMessage = this.hideMessage.bind(this);
	}

  isValidPassword(pwd) {
      return (pwd !== null && pwd !== undefined &&  pwd.length >= minimumPasswordSize
       &&  pwd.match(/^(?=.*[a-z])^(?=.*[A-Z])^(?=.*\d)^(?=.*[^A-Za-z0-9])/));
  }

 passwordChanged(e) {
   var _message = {text : null, severity : null};
   var _password = e.target.value;

   if(!this.isValidPassword(_password)) {
     e.target.style.backgroundColor = 'red';
   }
   else {
     e.target.style.backgroundColor ='white';
   };

  this.setState({
      passwordValid : false,
      password: e.target.value,
      message : _message
    })
  }

  confirmationPasswordChanged(e) {
     if(! this.state.passwordValid || e.target.value !== document.getElementById("password")) {
        e.target.style.backgroundColor = 'red';
     }
     else {
       e.target.style.backgroundColor ='white';
     }
     this.passwordChanged(e);
   }


  emailChanged(e) {
    this.setState({
      email: e.target.value,
      message :	{text : null, severity : null},
    })
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
						//_that.props.onSignUpSuccess(respjson);
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

    return (
      <div className="backdrop" style={backdropStyle}>
        <div className="modal" style={modalStyle}>
		  <AppMessage severity={this.state.message.severity} message={this.state.message.text} onClose={this.hideMessage}/>

    <form onSubmit={this.handleSubmit}>
			Bienvenue et merci de saisir les informations nécessaires pour votre inscription <br/>
			<label>Email
			<input type="email" name="email" placeholder="youremail@here" required  size="35" onChange={this.emailChanged}/>
			</label>
			<label>Password
			<input type="password" id="password" placeholder="your password"required  size="15" minLenght="8"
                    maxLength="40" onChange={this.passwordChanged}/>
			</label>
      <label>Confirmation Password
			<input type="password" id="confirmationPassword" placeholder="your password"required  size="15" minLenght="8"
                  maxLength="40" onChange={this.confirmationPasswordChanged}/>
			</label>

			<input type="submit" value="Submit" />
		</form>

		 <a href="/newConfirmationLink" onClick="this.newConfirmationLinkRequested()">Need a new confirmation link ?</a>

          <div className="footer">
            <button onClick={this.props.onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
}

ModalSignup.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node
};

export default ModalSignup;
