import React, { useState } from "react";
import ReactPlayer from "react-player/lazy";
import SoundAudioNode from "./sound-audio-node";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

function SoundElement(props){
  const [playerVolume, setPlayerVolume] = useState(props.volume);
  const ref = React.createRef();
  let loops = Math.floor(Math.random() * (props.chain.to - props.chain.from + 1)) + props.chain.from;
  const renderAudioSource = () => {
    if(props.url.includes('youtube.com') || props.url.includes('youtu.be')) {
      return (
        <ReactPlayer
          ref={ref}
          id={"player"+props.id}
          url={props.url}
          volume={playerVolume/100}
          playing={props.isPlaying}
          controls={false}
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
              props.onFinish();
            }
          }}
          width="0px"
          height="0px"
         />
       );
    } else {
      return (
        <SoundAudioNode
          id={"player"+props.id}
          url={props.url}
          volume={playerVolume/100}
          isPlaying={props.isPlaying && loops >= 0}
          audioContext={props.audioContext}
          start={props.start}
          end={props.end}
          chain={props.chain}
          onEnded={() => {
            if(loops > 0)
              loops--;
            else {
              props.onFinish();
            }
          }}
        />
      );
    }
  }

  return (
    <Row className="mt-2 py-3 border-top">
      <Row>
        <Col><h5>{props.name}</h5></Col>
        <Col xs={2} className="center-text">
          {props.isPlaying ?
            <Button variant="secondary" onClick={() => ref.current.seekTo(props.end > 0 ? props.end : ref.current.getDuration())}>
              Skip to end
            </Button>
            : null
          }
        </Col>
      </Row>
      <Row className="mb-2">
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
      </Row>
      <Row className="my-3">
        {renderAudioSource()}
      </Row>
     </Row>
  );
}

export default SoundElement;
