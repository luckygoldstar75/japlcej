import React from 'react';
import { withTranslation  } from "react-i18next";

class _GameScores extends React.Component {
	constructor(props) {
	super(props); //this.props.level  this.props.gameName this.props.progression.percentageGood this.props.progression.percentageDone
	this.thresholdPercent= new Map([ ["gold", 99], ["red", 90], ["blue", 75], ["grey", 0]]);
  this.giveImgForLevel=this.giveImgForLevel.bind(this);
  this.giveStyleForProgressionBarAccordingToPercentageGood=this.giveStyleForProgressionBarAccordingToPercentageGood.bind(this);
 }

 static getNbTriesThresholdBeforeNextLevel() {
	return(Object.freeze(
		{"novice" : 200,
		"confirmed" : 400,
		"advanced" : 400,
		"master" : 400}));
 }

  giveImgForLevel(level) {
      var _level=Object.keys(_GameScores.getNbTriesThresholdBeforeNextLevel()).indexOf(level);
      if(isNaN(_level)||_level<0) {_level=0};
      return ("/pics/level" + _level +".jpg");
  }

  giveStyleForProgressionBarAccordingToPercentageGood(percentGood) {
    var _percentGood=parseInt(percentGood);

      if (isNaN(_percentGood)) {
        return ("percentageProgressionBar_unknown");
      }
      else if(percentGood >= this.thresholdPercent.get("gold")) {
        return ("percentageProgressionBar_gold");
      }
      else if (percentGood >= this.thresholdPercent.get("red")) {
        return ("percentageProgressionBar_red");
      }
      else if (percentGood >= this.thresholdPercent.get("blue")) {
        return ("percentageProgressionBar_blue");
      }
      else {
        return ("percentageProgressionBar_grey");
      }
  }



 render() {
	 const { t } = this.props;

 		if (!this.props.userLoggedIn) {
       return null;
     }
 	  else {
 				return ( //draft
 					<div className="GameScores">
 						<div className="progression">
							<div className="Game_Progression_Label">{t("Game_Progression_Label")}</div>
 						 	<progress min="0" max="100" value={this.props.percentageDone}
                       className={this.giveStyleForProgressionBarAccordingToPercentageGood(this.props.percentageGood)}>
                </progress>
                <div className="levelPicture">
                   <img className="responsive-image" alt="your progression!" src={this.giveImgForLevel(this.props.level)} />
                </div>
 						</div>
 					</div>
 			)};
 	}

}

const GameScores = withTranslation()(_GameScores);
GameScores.getNbTriesThresholdBeforeNextLevel  = _GameScores.getNbTriesThresholdBeforeNextLevel;
export default GameScores;
