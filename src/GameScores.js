import React from 'react';
import {japlcejAPI, routesURLs} from './config';


class GameScores extends React.Component {
	constructor(props) {
		super(props);
	this.state={gameSelected : this.props.gameSelected, userLoggedIn : this.props.userLoggedIn};
}



	render() {
		if (!this.state.userLoggedIn) {
      return null;
    }
	  else {
				return ( //draft
					<div className="GameScores">
						<div className="level">
							 <label for="percentageProgression">{this.props.currentLevelLabel}
							 </label>
               <progress id="percentageProgression" max="100" value={this.props.currentPercentage} className="percentageProgressionBar"></progress>
               <div className="levelPicture">
                  <img src={this.props.picture} />
               </div>
						</div>
					</div>
				);
	}
 }

 componentDidMount() { //!!!!! DRAFT !!!!!!!!!!!!
   if (!this.props.userLoggedIn) return;
fetch(japlcejAPI + routesURLs.GETSCORES,{
      method: "POST",
      headers: {
       'Content-Type': 'application/json',
       'Accept': 'application/json, text/plain, *\/*'
      },
      body : JSON.stringify({gameName : this.props.gameName})
      ,
      credentials : 'include',
      mode : 'cors',
      redirect : 'follow'
     }
 )
 .then(data => { if (data != null) {this.setState({percentageDone : data.percentageDone,
      percentageGood:data.percentageGood, level: data.level})}})
 .catch(error => {console.error('retrieveScores for game ' + this.props.gameName + ' and user XXX?' + ' Error: ', error);
    })
 }

}

export default GameScores;
