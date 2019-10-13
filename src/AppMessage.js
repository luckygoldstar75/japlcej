import React from 'react';

class AppMessage extends React.Component {
   constructor(props) {
		super(props);
		console.debug("this.props.severity " + this.props.severity + " this.props.message " + this.props.message);
	}

    render() {
		console.debug ("In AppMessage : state message " + this.props.message + " "  + this.props.severity);

		 if(this.props.message == null && this.props.severity == null) {
			return null;
		 }

    // The gray background
    const backdropStyle  = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      padding: 50
    };

    const commonMessageStyle = {
      borderRadius: 5,
      maxWidth: 500,
      minHeight: 50,
      margin: '0 auto',
      padding: 30
    };


    const errorMessageStyle = Object.assign({}, commonMessageStyle);
    errorMessageStyle.backgroundColor = '#ff0000';
    errorMessageStyle.color = '#000000';

    const warnMessageStyle = Object.assign({}, commonMessageStyle);
    warnMessageStyle.backgroundColor = '#ff0000';
    warnMessageStyle.color = '#ffffff';

    const infoMessageStyle = Object.assign({}, commonMessageStyle);
    infoMessageStyle.backgroundColor = '#00ff00';
    infoMessageStyle.color = '#ffffff';

    var myStyle = errorMessageStyle;

    switch(this.props.severity) {
				case 'info' : myStyle =  infoMessageStyle; break;
				case 'warn' : myStyle =  warnMessageStyle; break;
				case 'error': myStyle = errorMessageStyle; break;
				default : myStyle = errorMessageStyle; break;
	}

    console.log(myStyle);

     return (
      <div id="backdrop" style={backdropStyle}>
        <div id="AppMessage" style={myStyle}>
            <div className="header">
             <button onClick={this.props.onClose}>
              X
             </button>
             {this.props.message}
           </div>
        </div>
      </div>
    );
  }
}

export default AppMessage;
