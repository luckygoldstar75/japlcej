import React from 'react';
import {  withTranslation } from "react-i18next";

class _AudioSuggestion extends React.Component {

constructor(props) {
  super(props); //this.props.level  this.props.gameName this.props.progression.percentageGood this.props.progression.percentageDone
  this.playAudioSuggestion=this.playAudioSuggestion.bind(this);
  this.playAudio=this.playAudio.bind(this);
  this.suggestionAudioId = "suggestionAudio_"+ props.index;
  this.words = props.fileKey.split('_');
}

playAudioSuggestion() {
  this.props.setSelectedSuggestionIndex(this.props.index);

  if (this.words !== null && this.words !== undefined &&
    this.words instanceof Array && this.words.length >= 1) {
      this.playAudio(0);
  }
}

playAudio(i) {
    var audioBitId = this.suggestionAudioId.concat("_", i);
    var _that = this;

    document.getElementById(audioBitId).pause();
    document.getElementById(audioBitId).load();
    if(i < (this.words.length -1)) {
      document.getElementById(audioBitId).addEventListener("ended", function() {_that.playAudio.bind(_that,++i)();});
    }
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

static fromWordToStringAudioFilename(_word) {
  if (_word === null || _word === undefined) {return null}
  else {
    var stringAudioFileName = _word.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
    return stringAudioFileName;
  }
}

static buildAudioSourceBits(_audioId, _words) {
return _words.map((word, index) =>
  <audio id={_audioId.concat("_", index)} key={_audioId.concat("_", index)} >
    <source src={"/pronunciations/" + _AudioSuggestion.fromWordToStringAudioFilename(word) + ".mp3"} type="audio/mpeg" />
    <source src={"/pronunciations/" + _AudioSuggestion.fromWordToStringAudioFilename(word) + ".ogg"} type="audio/ogg" />
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
   {_AudioSuggestion.buildAudioSourceBits(suggestionAudioId, this.words)}
    <div>
     <button onClick={this.playAudioSuggestion} onMouseOver={this.playAudioSuggestion}
            className={audioSuggestionSpeakerStyle} disabled={!this.props.isGoodAnswer&&!this.props.isActive}>🔊</button>
    </div>
    </div>
  );
 }
}

const AudioSuggestion = withTranslation()(_AudioSuggestion);
export default AudioSuggestion;
