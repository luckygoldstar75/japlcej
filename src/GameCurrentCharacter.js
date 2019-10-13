import React from 'react';

class GameCurrentCharacter extends React.Component {
	constructor(props) {
		super(props);
	}


	render() {
		const characterTobeGuessedStyle ={
		display: 'flex',
		flexDirection:'row',
		flexFlow : 'flex-wrap',
		justifyContent: 'center',
		fontSize:'300%',
		}

		var myCharacter = (this.props.currentCharacter == null)? "😀" : this.props.currentCharacter.character;

		return (<div id="caractereADeviner" align="center" style={characterTobeGuessedStyle}>{myCharacter}</div>);
	}
}

export default GameCurrentCharacter;
