
const ModalSignupCommons = {
  minimumPasswordSize : 8,

  isValidPassword(pwd) {
      return (pwd !== null && pwd !== undefined &&  pwd.length >= this.minimumPasswordSize
       &&  pwd.match(/^(?=.*[a-z])^(?=.*[A-Z])^(?=.*\d)^(?=.*[^A-Za-z0-9])/) !== false);
  },

 passwordChanged(e) {
   var _message = {text : null, severity : null};
   var _password = e.target.value;

   if(!ModalSignupCommons.isValidPassword(_password)) {
     e.target.style.backgroundColor = 'red';
   }
   else {
     e.target.style.backgroundColor ='white';
   };

  this.setState({
      password: e.target.value,
      message : _message
    })
  },

  emailChanged(e) {
    this.setState({
      email: e.target.value,
      message :	{text : null, severity : null},
    })
  },

  addMessage(message) {
	  if (message == null) {
		  this.setState({message : {severity: null, text : null}});
	  }
	  else {
		  this.setState({message : {severity: message.severity, text : message.text}});
	  }
  },

  hideMessage() {
	  this.setState({message : {severity: null, text : null}});
  },

  // The gray background
  backdropStyle : {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 50
  },

  // The modal "window"
   modalStyle : {
    backgroundColor: '#fff',
    borderRadius: 5,
    maxWidth: 500,
    minHeight: 300,
    margin: '0 auto',
    padding: 30
  }
}

export default ModalSignupCommons;
