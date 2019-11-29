import React from 'react';

const AudioSourceBitsBuilder = {

playAudio(_audioId, i) {
    var audioBitId = _audioId.concat("_", i);
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
},

 fromWordToStringAudioFilename(_word) {
  if (_word === null || _word === undefined) {return null}
  else {
    var stringAudioFileName = _word.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
    return stringAudioFileName;
  }
},

buildAudioSourceBits(_audioId, _words) {
var _that =this;

return _words.map((word, index) =>
  <audio id={_audioId.concat("_", index)} key={_audioId.concat("_", index)}
        onEnded={index < _words.length -1?
            () => AudioSourceBitsBuilder.playAudio.bind(_that, _audioId, index+1)()
          : null}>
    <source src={"/pronunciations/" + AudioSourceBitsBuilder.fromWordToStringAudioFilename(word) + ".mp3"} type="audio/mpeg" />
    <source src={"/pronunciations/" + AudioSourceBitsBuilder.fromWordToStringAudioFilename(word) + ".ogg"} type="audio/ogg" />
     {/* (this.props.index === 0)?
             this.props.messageHook({severity : "error" , message : t("Browser_too_old")})
             : "🔊" */}
  </audio>);
}

}
export default AudioSourceBitsBuilder;
