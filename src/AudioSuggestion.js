import React from 'react';
import {  withTranslation } from "react-i18next";

class _AudioSuggestion extends React.Component {

constructor(props) {
  super(props); //this.props.level  this.props.gameName this.props.progression.percentageGood this.props.progression.percentageDone
  this.listenToSuggestion=this.listenToSuggestion.bind(this);
  this.suggestionAudioId = "suggestionAudio_"+this.props.index;
}

listenToSuggestion() {
  this.props.setSelectedSuggestionIndex(this.props.index);
    document.getElementById(this.suggestionAudioId).pause();
    document.getElementById(this.suggestionAudioId).load();
    var promise = document.getElementById(this.suggestionAudioId).play();

    if (promise !== undefined) {
    promise.then(_ => {
        // Autoplay started!
    }).catch(error => {
        console.debug("could not play source: file missing?")// Autoplay was prevented.
        // Show a "Play" button so that user can start playback.
    });
}
}

render() {
 const { t } = this.props;
 var suggestionAudioId = "suggestionAudio_"+this.props.index;
 var audioSuggestionSpeakerStyle = "audioSuggestionSpeaker";
 if(this.props.isSelected) {
     audioSuggestionSpeakerStyle = "audioSuggestionSpeakerSelected";
 }
 else if (this.props.isGoodAnswer){
    audioSuggestionSpeakerStyle = "audioSuggestionSpeakerShowGoodAnswer";
 }

 return (
   <div className="audioSuggestion">
   <audio id={suggestionAudioId}>
      <source src={"/pronunciations/" + this.props.fileKey + ".mp3"} type="audio/mpeg" />
      <source src={"/pronunciations/" + this.props.fileKey + ".ogg"} type="audio/ogg" />
        {/* (this.props.index === 0)?
                this.props.messageHook({severity : "error" , message : t("Browser_too_old")})
                : "🔊" */}
    </audio>
    <div>
     <button onClick={this.listenToSuggestion} onMouseOver={this.listenToSuggestion}
            className={audioSuggestionSpeakerStyle} disabled={!this.props.isGoodAnswer&&!this.props.isActive}>🔊</button>
    </div>
    </div>
  );
 }
}

const AudioSuggestion = withTranslation()(_AudioSuggestion);
export default AudioSuggestion;
