import React, { useState } from "react";
import ReactPlayer from "react-player/lazy";
import Row from "react-bootstrap/Row";

function SoundElement(props){
  const [playerVolume, setPlayerVolume] = useState(props.volume);
  const ref = React.createRef();
  let loops = Math.floor(Math.random() * (props.chain.to - props.chain.from + 1)) + props.chain.from;
  return (
    <Row>
      <h5>{props.name}</h5>
      <p>Volume: {playerVolume}</p>
      <input
        id={"vol"+props.id}
        type="range"
        min="0"
        max="100"
        value={playerVolume}
        onChange={(e) => setPlayerVolume(e.target.value)}
        step="1"
      />
      <ReactPlayer
        ref={ref}
        id={"player"+props.id}
        url={props.url}
        volume={playerVolume/100}
        playing={props.isPlaying}
        controls={true}
        config={{
          youtube: {
            playerVars: {
              start: props.start,
              end: props.end
            }
          }
        }}
        onEnded={() => {
          if(loops > 0) {
            loops--;
            ref.current.seekTo(props.start);
          } else {
            ref.current.getInternalPlayer().pauseVideo();
            ref.current.seekTo(props.start);
            loops = Math.floor(Math.random() * (props.chain.to - props.chain.from + 1)) + props.chain.from;
            props.onFinish();
          }
        }}
        width="100%"
        height="100px"
       />
     </Row>
  );
}

export default SoundElement;
