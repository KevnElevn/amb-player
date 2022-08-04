import React, { useState, useEffect } from "react";

function SoundAudioNode(props){
  const audio = new Audio(props.url);
  audio.crossOrigin = 'anonymous';

  const [audioNode] = useState(new MediaElementAudioSourceNode(props.audioContext, { mediaElement: audio }));
  const [gainNode] = useState(new GainNode(props.audioContext));

  let endTime = props.end;
  audio.onloadedmetadata = (event) => {
    if(endTime < 0)
      endTime = audio.duration;
  }
  audio.currentTime = props.start;
  audio.ontimeupdate = (event) => {
    if(audio.currentTime >= endTime) {
      audio.currentTime = props.start;
      props.onEnded();
    }
  }

  useEffect(() => {
    audioNode.connect(gainNode).connect(props.audioContext.destination);
    if(props.isPlaying && props.loops >= 0)
      audioNode.mediaElement.play();
    else
      audioNode.mediaElement.pause();
    gainNode.gain.value = props.volume;
    return () => {
      audioNode.disconnect();
      gainNode.disconnect();
    }
  }, [props.isPlaying, props.volume, props.loops, audioNode, gainNode, props.audioContext.destination]);

  return (
    <>
    </>
  );
}

export default SoundAudioNode;
