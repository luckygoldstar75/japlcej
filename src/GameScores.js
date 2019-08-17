import React from 'react';
import {japlcejAPI, routesURLs} from './config';


class GameScores extends React.Component {
	constructor(props) {
		super(props);
	this.state={gameName : this.props.gameName, userLoggedIn : this.props.userLoggedIn, progression : {level: "0", percentageDone : "0", percentageGood: "0"}};
  this.thresholdPercent= new Map([ ["gold", 99], ["red", 90], ["blue", 75], ["grey", 0]]);
  this.giveImgForLevel=this.giveImgForLevel.bind(this);
  this.giveStyleForProgressionBarAccordingToPercentageGood=this.giveStyleForProgressionBarAccordingToPercentageGood.bind(this);
}

  giveImgForLevel(level) {
      var _level=parseInt(level)
      if(isNaN(_level)) {_level=0};
      return ("pics/level" + _level +".jpg");
  }

  giveStyleForProgressionBarAccordingToPercentageGood(percentGood) {
    var _percentGood=parseInt(percentGood);

      if (isNaN(_percentGood)) {
        return ("percentageProgressionBar" + "_unknown");
      }
      else if(percentGood >= this.thresholdPercent.get("gold")) {
        return ("percentageProgressionBar" + "_gold");
      }
      else if (percentGood >= this.thresholdPercent.get("red")) {
        return ("percentageProgressionBar" + "_red");
      }
      else if (percentGood >= this.thresholdPercent.get("blue")) {
        return ("percentageProgressionBar" + "_blue");
      }
      else {
        return ("percentageProgressionBar" + "_grey");
      }
  }



	render() {
		if (!this.props.userLoggedIn) {
      return null;
    }
	  else {
				return ( //draft
					<div className="GameScores">
						<div className="level">
							 <label for="percentageProgression">{this.state.progression.level}
							 </label>
               <progress min="0" max="200" value={this.state.progression.percentageDone}
                      className={this.giveStyleForProgressionBarAccordingToPercentageGood(this.state.progression.percentageGood)}>
               </progress>
               <div className="levelPicture">
                  <img src={this.giveImgForLevel(this.state.progression.level)} />
               </div>
						</div>
					</div>
				);};
	}

 componentDidMount() {
   this.updateScores();
 }
 componentDidUpdate() {
   this.updateScores();
 }

 updateScores() {
   var _that=this;

   if (!_that.props.userLoggedIn) return;
   fetch(japlcejAPI + routesURLs.GETSCORES + "/" + _that.state.gameName, {
      method: "GET",
      headers: {
       'Content-Type': 'application/json',
       'Accept': 'application/json, text/plain, *\/*'
     },
      credentials : 'include',
      mode : 'cors',
      redirect : 'follow'
     }
   )
 .then(response => {
   var responseJson=response.json();
   if(response.status !==200) {
      console.error('GETSCORES Error: response status', response.status);
      return;
    }
   return(responseJson);
 })
 .catch(error => {console.error('GETSCORES Error:', error);
  })
 .then(data => {
   if (data != null  &&  data.error == null) {
     var newDataProgression = {percentageDone : data.percentageDone, percentageGood : data.percentageGood, level : data.level};
   	  if(_that.state.progression.level !== newDataProgression.level ||
          _that.state.progression.percentageDone !== newDataProgression.percentageDone ||
          _that.state.progression.percentageGood !== newDataProgression.percentageGood
      ) {
        _that.setState({progression : {percentageDone : data.percentageDone, percentageGood : data.percentageGood, level : data.level}});
   	  }
   }})
 .catch(error => {console.error('retrieveScores for game ' + _that.props.gameName + ' and user XXX?' + ' Error: ', error);
    })
 }
}

export default GameScores;
