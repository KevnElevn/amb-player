import React, { useState } from "react";
import SoundElement from "./sound-element";
import Row from "react-bootstrap/Row";

function SoundGroup(props){
  const [playingId, setPlayingId] = useState(Math.floor(Math.random() * props.sounds.length));
  const soundElements = props.sounds.map((element, index) => {
    return (
      <SoundElement
        key={`${props.id}+${element.id}`}
        id={`${props.id}+${element.id}`}
        name={element.name}
        url={element.url}
        volume={element.volume}
        start={element.start}
        end={element.end}
        chain={element.chain}
        isPlaying={props.isPlaying && index === playingId}
        onFinish={
          () => {
            setPlayingId(-1);
            setTimeout(()=> {
              setPlayingId(Math.floor(Math.random() * props.sounds.length));
            },
            (Math.floor(
              Math.random() * (element.interval.end - element.interval.start + 1)
              ) + element.interval.start
            )* 1000)
          }
        }
      />
    );
  });
  return (
    <Row className="border mt-2">
      {soundElements}
    </Row>
  );
}

export default SoundGroup;
