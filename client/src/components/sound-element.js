import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player/lazy";
import SoundAudioNode from "./sound-audio-node";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";

function SoundElement(props){
  const [playerVolume, setPlayerVolume] = useState(props.volume);
  const [loops, setLoops] = useState(0);
  const playerRef = useRef();
  const loopsRef = useRef();
  loopsRef.current = loops;

  useEffect(() => {
    if(props.isSelected) {
      setLoops(Math.floor(Math.random() * (props.chain.to - props.chain.from + 1)) + props.chain.from);
    }
  }, [props.isSelected, props.chain.to, props.chain.from]);

  const progressLoops = () => {
    if(loopsRef.current > 0)
      setLoops(loopsRef.current-1);
    else
      props.onFinish();
  }

  const renderAudioSource = () => {
    if(props.url.includes('youtube.com') || props.url.includes('youtu.be')) {
      return (
        <ReactPlayer
          ref={playerRef}
          id={"player"+props.id}
          url={props.url}
          volume={playerVolume/100}
          playing={props.isPlaying && props.isSelected}
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
            if(loopsRef.current > 0) {
              setLoops(loopsRef.current-1);
              playerRef.current.seekTo(props.start);
            } else {
              playerRef.current.getInternalPlayer().pauseVideo();
              playerRef.current.seekTo(props.start);
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
          isPlaying={props.isPlaying && props.isSelected}
          audioContext={props.audioContext}
          start={props.start}
          end={props.end}
          chain={props.chain}
          loops={loops}
          onEnded={() => progressLoops()}
        />
      );
    }
  }

  return (
    <Row className="mt-2 py-3 border-top">
      <Row className="mb-2">
        <Col xs="auto">
          <h5>
            {props.name}
          </h5>
        </Col>
        <Col>
          {
            props.isPlaying && props.isSelected ?
              <Badge pill bg="info">Playing</Badge>
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
