import React from 'react';

class GameCard extends React.Component {
	constructor(props) {
		super(props);
		this.state={isAvailable : this.props.isAvailable, decorationCharacter : this.props.decorationCharacter,
       gameName : this.props.gameName, gameTextAbstract: this.props.gameTextAbstract, onClick:this.props.onClick};
	}



	render() {
		if (this.state.isAvailable) {
    return (
			<div className="cardGame" id={this.state.gameName} onClick={this.state.onClick}>
          <div className="cardGameDecorationCharacterTop">{this.state.decorationCharacter}<br/></div>
          <div className="cardGameAbstractText">{this.state.gameTextAbstract}</div><br/>
          <div className="cardGameGoButton">Go!</div><br/>
          <div className="cardGameDecorationCharacterBottom">{this.state.decorationCharacter}</div>
			</div>
		);
  }
	else {
				return (
          <div className="cardGameComingSoon" id={this.state.gameName} onClick="">
            <div className="cardGameDecorationCharacterTop">{this.state.decorationCharacter}<br/></div>
            <div className="cardGameAbstractText">{this.state.gameTextAbstract}</div><br/>
            <div className="cardGameGoButton">Vote!</div><br/>
            <div className="cardGameDecorationCharacterBottom">{this.state.decorationCharacter}</div>
    			</div>
				);
	}
 }
}

export default GameCard;
