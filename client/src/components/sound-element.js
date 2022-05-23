import React from "react";
import ReactPlayer from "react-player/lazy";
import Row from "react-bootstrap/Row";

function SoundElement(props){
  const ref = React.createRef();
  return (
    <Row>
      <h5>{props.name}</h5>
      <ReactPlayer
        ref={ref}
        url={props.url}
        playing={props.isPlaying}
        controls={true}
        onStart={() => ref.current.seekTo(props.start, 'seconds')}
        width="100%"
        height="100px"
       />
     </Row>
  );
}

export default SoundElement;
