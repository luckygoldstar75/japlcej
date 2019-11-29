import React from 'react';
import {  withTranslation } from "react-i18next";

class _CharacterSuggestion extends React.Component {

constructor(props) {
  super(props); //this.props.level  this.props.gameName this.props.progression.percentageGood this.props.progression.percentageDone
  this.selectSuggestion=this.selectSuggestion.bind(this);
  this.suggestionId = "suggestion_"+ props.index;
}

selectSuggestion() {
  this.props.setSelectedSuggestionIndex(this.props.index);
}

render() {
 const { t } = this.props;
 var suggestionCharacterId = "suggestionCharacter_" + this.props.index;
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
     <button onClick={this.selectSuggestion} className={characterSuggestionStyle}
          disabled={!this.props.isGoodAnswer&&!this.props.isActive}>{this.props.character.character}
     </button>
    </div>
    </div>
  );
 }
}

const CharacterSuggestion = withTranslation()(_CharacterSuggestion);
export default CharacterSuggestion;
