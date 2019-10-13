import React from 'react';

class GameCurrentResult extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (<div id="currentResult" align="center">Réussis: {this.props.nbSuccess} / Total: {this.props.nbTries} </div>);
	}
}

export default GameCurrentResult;
