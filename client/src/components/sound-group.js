import React, { useState } from "react";
import SoundElement from "./sound-element";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";

function SoundGroup(props){
  const [playingId, setPlayingId] = useState(Math.floor(Math.random() * props.sounds.length));
  const [isGroupOn, setGroupOn] = useState(true);
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
        isPlaying={isGroupOn && props.isPlaying && index === playingId}
        onFinish={
          () => {
            setPlayingId(-1);
            setTimeout(()=> {
              setPlayingId(Math.floor(Math.random() * props.sounds.length));
              },
              (Math.floor(
                Math.random() * (props.interval.to - props.interval.from + 1)
              ) + props.interval.to)* 1000
            )
          }
        }
      />
    );
  });
  return (
    <Row className="border mt-2">
      <Accordion.Item eventKey={props.id}>
        <Accordion.Header>
          <Col className="overflow-auto">{props.groupName}</Col>
        </Accordion.Header>
        <Accordion.Body>
          <Button
            className="mb-1"
            variant={isGroupOn ? "success" : "danger"}
            onClick={() => setGroupOn(!isGroupOn)}
          >
            {isGroupOn ? "On" : "Off"}
          </Button>
          {soundElements}
        </Accordion.Body>
      </Accordion.Item>
    </Row>
  );
}

export default SoundGroup;
