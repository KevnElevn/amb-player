import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Amb from "../components/amb";
import EditAmb from "../components/edit-amb";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

function AmbPage(props){
  const [editing, setEditing] = useState(false);
  const [audioCtx] = useState(new AudioContext());
  audioCtx.suspend();
  console.log(audioCtx.state);
  let params = useParams();

  useEffect(() => {
    return () => {
      console.log('cleanup');
      audioCtx.close();
    }
  },[audioCtx]);

  const renderAmb = () => {
    if(editing) {
      return (
        <EditAmb
          userId={props.userId}
          ambId={params.ambId}
          toggleEdit={() => setEditing(!editing)}
        />
      );
    } else {
      return (
        <Amb
          userId={props.userId}
          ambId={params.ambId}
          toggleEdit={() => setEditing(!editing)}
          audioContext={audioCtx}
        />
      );
    }
  }
  return (
    <Container>
      <Row className="text-center mt-2">
        <h6>Amb #{params.ambId}</h6>
      </Row>
      <Row className="mb-3">
      {renderAmb()}
      </Row>
    </Container>
  );
}

export default AmbPage;
