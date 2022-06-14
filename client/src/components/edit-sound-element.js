import React, { useState } from "react";
import SoundElementModal from "./sound-element-modal.js";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function EditSoundElement(props){
  const [showModal, setShowModal] = useState(false);

  return (
    <Row className="mt-2 py-2 border-bottom">
      <Row>
        <Col xs={8}>
          <Row>
            <h6>Sound Name</h6>
          </Row>
          <Row className="mx-3">
            <h3>{props.name}</h3>
          </Row>
        </Col>
        <Col className="text-end">
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
          >
            Edit
          </Button>
        </Col>
        <Row>
          <h6>URL</h6>
        </Row>
        <Row className="mx-3">
          <p>{props.url}</p>
        </Row>
      </Row>
      <SoundElementModal
        edit={true}
        userId={props.userId}
        ambId={props.ambId}
        groupId={props.groupId}
        soundId={props.soundId}
        name={props.name}
        url={props.url}
        volume={props.volume}
        start={props.start}
        end={props.end}
        chain={props.chain}
        show={showModal}
        handleClose={() => setShowModal(false)}
        refresh={() => props.refresh()}
      />
     </Row>
  );
}

export default EditSoundElement;
