import React from 'react';
import {  withTranslation } from "react-i18next";

class _CharacterSuggestion extends React.Component {

constructor(props) {
  super(props); //this.props.level  this.props.gameName this.props.progression.percentageGood this.props.progression.percentageDone
}

render() {
 const { t } = this.props;
 var characterSuggestionStyle = "characterSuggestion";
 if(this.props.isSelected) {
     characterSuggestionStyle = "characterSuggestionSelected";
 }
 else if (this.props.isGoodAnswer){
    characterSuggestionStyle = "characterSuggestionShowGoodAnswer";
 }

 return (
   <div className="characterSuggestion">
    <div>
     <button onClick={this.props.setSelectedSuggestionIndex} className={characterSuggestionStyle}
          disabled={!this.props.isGoodAnswer&&!this.props.isActive}>{this.props.character.character}
     </button>
    </div>
    </div>
  );
 }
}

const CharacterSuggestion = withTranslation()(_CharacterSuggestion);
export default CharacterSuggestion;
