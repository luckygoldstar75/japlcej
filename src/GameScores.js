import React from 'react';
import {japlcejAPI, routesURLs} from './config';


class GameScores extends React.Component {
	constructor(props) {
		super(props);
	this.state={gameName : this.props.gameName, userLoggedIn : this.props.userLoggedIn,
		progression : {
				level: "novice",
				levelsAvailable : [] ,
				percentageDone : "0", percentageGood: "0",
				potentialNewAvailableLevel : null}};
  this.thresholdPercent= new Map([ ["gold", 99], ["red", 90], ["blue", 75], ["grey", 0]]);
  this.giveImgForLevel=this.giveImgForLevel.bind(this);
  this.giveStyleForProgressionBarAccordingToPercentageGood=this.giveStyleForProgressionBarAccordingToPercentageGood.bind(this);
}

  giveImgForLevel(level) {
      var _level=Object.keys(GameScores.getLevels()).indexOf(level);
      if(isNaN(_level)||_level<0) {_level=0};
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

static getLevels() {
	return(Object.freeze(
		{"novice" : 200,
		"confirmed" : 400,
		"advanced" : 400,
		"master" : 400}));
}

static getLevelsAvailable(percentageTries, percentageGood, currentLevel) {
		var currentLevelIndex=Math.max(0,Object.keys(this.getLevels()).indexOf(currentLevel));
		if(percentageTries >= 100 && percentageGood >= 80) { currentLevelIndex++};

		var arrayOfLevelsAvailable=Object.keys(this.getLevels()).slice(0,currentLevelIndex+1);
		return arrayOfLevelsAvailable;
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
               <progress min="0" max="100" value={this.state.progression.percentageDone}
                      className={this.giveStyleForProgressionBarAccordingToPercentageGood(this.state.progression.percentageGood)}>
               </progress>
               <div className="levelPicture">
                  <img className="responsive-image" src={this.giveImgForLevel(this.state.progression.level)} />
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
   fetch(japlcejAPI + routesURLs.GETPLAYERRESULTS + "/" + _that.state.gameName + "/" + _that.state.progression.level, {
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
	 if (response.status ===204) return null;
   var responseJson=response.json();
   if(response.status !==200) {
      console.error('GETPLAYERRESULTS Error: response status', response.status);
      return;
    }
   return(responseJson);
 })
 .catch(error => {console.error('GETPLAYERRESULTS Error:', error);
  })
 .then(data => {
   if (data != null  &&  data.error == null) {
     var newDataProgression = {percentageDone : data.percentageTries, percentageGood : data.percentageGood, level : data.level};
		 var __levelsAvailable=GameScores.getLevelsAvailable(data.percentageTries, data.percentageGood, data.level);
		 var potentialNewAvailableLevel = __levelsAvailable[__levelsAvailable.length-1];

   	  if(_that.state.progression.level !== newDataProgression.level ||
          _that.state.progression.percentageDone !== newDataProgression.percentageDone ||
          _that.state.progression.percentageGood !== newDataProgression.percentageGood ||
					_that.state.progression.potentialNewAvailableLevel !== potentialNewAvailableLevel
      ) {
        _that.setState({progression : {percentageDone : newDataProgression.percentageDone,
					percentageGood : newDataProgression.percentageGood,
					level : newDataProgression.level ,
					levelsAvailable : __levelsAvailable,
					potentialNewAvailableLevel : potentialNewAvailableLevel}});
   	  }
   }})
 .catch(error => {console.error('retrieveScores for game ' + _that.props.gameName + ' and user XXX?' + ' Error: ', error);
    })
 }
}

export default GameScores;
