import SoundElement from "./sound-element";
import Row from "react-bootstrap/Row";

function SoundGroup(props){
  let playingId = Math.floor(Math.random() * props.sounds.length);
  const soundElements = props.sounds.map((elementProps, index) => {
    return (
      <SoundElement
        key={index}
        name={elementProps.name}
        url={elementProps.url}
        start={elementProps.start}
        isPlaying={props.isPlaying && index === playingId}
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
