import React from 'react';
import PropTypes from 'prop-types';
import {japlcejAPI, IS_LOGGEDIN_URL, LOGIN_URL} from './config.js';
import AppMessage from './AppMessage.js';

class ModalLogin extends React.Component {
   constructor(props) {
		super(props);
		this.state = { 
			message : {text : null, severity : null}
			};
		this.passwordChange = this.passwordChange.bind(this);
		this.emailChange = this.emailChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.addMessage = this.addMessage.bind(this);
		this.hideMessage = this.hideMessage.bind(this);
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
	  event.preventDefault();
	  
	  //console.log("Submit login form bien reçu!");
	  fetch(japlcejAPI + LOGIN_URL, 
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
				this.setState.message = {severity: 'error', text : error}})
		.then( respjson => {
					// Examine the text in the response
					console.log(respjson);
					if(respjson != null && respjson.error != null) {
						this.setState({message : {severity: 'error', text : respjson.errMessage}});
					}
					else //NO error
					{
						console.log(this.props);
						this.props.onLoginSuccess(respjson);
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
			Merci de saisir vos identifiants pour vous connecter<br/>
			<label>Email
			<input type="email" name="email" placeholder="youremail@here" required  size="35" onChange={this.emailChange}/>
			</label>
			<label>Password
			<input type="password" name="password" placeholder="your password"required  size="15" maxLength="40" onChange={this.passwordChange}/>
			</label>
			<input type="submit" value="Submit" />
		</form>

		 <a href="/forgottenPassword">Forgotten Password ?</a>
		 
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

ModalLogin.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node
};

export default ModalLogin;
