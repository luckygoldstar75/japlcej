import React from 'react';
import {  withTranslation } from "react-i18next";

class _AudioSuggestion extends React.Component {

constructor(props) {
  super(props); //this.props.level  this.props.gameName this.props.progression.percentageGood this.props.progression.percentageDone
  this.listenToSuggestion=this.listenToSuggestion.bind(this);
  this.suggestionAudioId = "suggestionAudio_"+ props.index;
  this.words = props.fileKey.split('_');
}

listenToSuggestion() {
  this.props.setSelectedSuggestionIndex(this.props.index);

  for (var i =0; i< this.words.length; i++) {
    var audioBitId = this.suggestionAudioId.concat("_", i);
    document.getElementById(audioBitId).pause();
    document.getElementById(audioBitId).load();
    var promise = document.getElementById(audioBitId).play();

    if (promise !== undefined) {
    promise.then(_ => {
        // Autoplay started!
    }).catch(error => {
        console.debug("could not play source: file missing?")// Autoplay was prevented.
        // Show a "Play" button so that user can start playback.
    });
  }
}
}

fromWordToStringAudioFilename(_word) {
  if (_word === null || _word === undefined) {return null}
  else {
    var stringAudioFileName = _word.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
    return stringAudioFileName;
  }
}

buildAudioSourceBits(_suggestionAudioId) {
return this.words.map((word, index) =>
  <audio id={_suggestionAudioId.concat("_", index)} key={_suggestionAudioId.concat("_", index)} >
    <source src={"/pronunciations/" + this.fromWordToStringAudioFilename(word) + ".mp3"} type="audio/mpeg" />
    <source src={"/pronunciations/" + this.fromWordToStringAudioFilename(word) + ".ogg"} type="audio/ogg" />
     {/* (this.props.index === 0)?
             this.props.messageHook({severity : "error" , message : t("Browser_too_old")})
             : "🔊" */}
  </audio>);
}

render() {
 const { t } = this.props;
 var suggestionAudioId = "suggestionAudio_" + this.props.index;
 var audioSuggestionSpeakerStyle = "audioSuggestionSpeaker";
 if(this.props.isSelected) {
     audioSuggestionSpeakerStyle = "audioSuggestionSpeakerSelected";
 }
 else if (this.props.isGoodAnswer){
    audioSuggestionSpeakerStyle = "audioSuggestionSpeakerShowGoodAnswer";
 }

 return (
   <div className="audioSuggestion">
   {this.buildAudioSourceBits(suggestionAudioId)}
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
