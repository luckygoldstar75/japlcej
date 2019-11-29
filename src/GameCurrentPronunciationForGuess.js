import React from 'react';
import AudioSourceBitsBuilder from './AudioSourceBitsBuilder.js';

class GameCurrentPronunciationForGuess extends React.Component {
	constructor(props) {
		super(props);

		if (typeof GameCurrentPronunciationForGuess.counter == 'undefined') {
			GameCurrentPronunciationForGuess.counter  = 0;
		}
		this.pronunciationElementId = "pronunciation_" + GameCurrentPronunciationForGuess.counter++;
	}

	render() {
		var _that =this;
		const characterTobeGuessedStyle ={
		display: 'flex',
		flexDirection:'row',
		flexFlow : 'flex-wrap',
		justifyContent: 'center',
		color : 'SteelBlue',
		fontSize:'300%',
		}
	  return (
	    <div className="pronunciationTobeGuessed" id={this.pronunciationElementId}>
				{AudioSourceBitsBuilder.buildAudioSourceBits(this.pronunciationElementId, _that.props.words.split('_'))}
	     <div>
	      <button onClick={AudioSourceBitsBuilder.playAudio.bind(this, this.pronunciationElementId,  0)}
								onMouseOver={AudioSourceBitsBuilder.playAudio.bind(this, this.pronunciationElementId, 0)}
	          style={characterTobeGuessedStyle}>🔊</button>
	     </div>
	     </div>
	   );
	}
}

export default GameCurrentPronunciationForGuess;
