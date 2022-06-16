import React, { useState } from "react";
import SoundGroupModal from "./sound-group-modal";
import EditSoundElement from "./edit-sound-element";
import SoundElementModal from "./sound-element-modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";

function EditSoundGroup(props){
  const [showCreateSoundModal, setShowCreateSoundModal] = useState(false);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);

  const renderSoundElements = () => {
    return props.sounds.map((element) => {
      return (
        <EditSoundElement
          key={`${props.groupId}+${element.id}`}
          ambId={props.ambId}
          groupId={props.groupId}
          soundId={element.id}
          userId={props.userId}
          name={element.name}
          url={element.url}
          volume={element.volume}
          start={element.start}
          end={element.end}
          chain={element.chain}
          refresh={() => props.refresh()}
        />
      );
    });
  };

  return (
    <Row className="border mt-2">
      <Accordion.Item eventKey={props.ambId+props.groupId}>
        <Accordion.Header>
          <Col className="overflow-auto">{props.groupName}</Col>
          <Col className="text-end me-3">{props.interval.from} ~ {props.interval.to}</Col>
        </Accordion.Header>
        <Accordion.Body>
          <Row className="">
            <Row>
              <Col className="text-start">
                <Button
                  className="mb-2"
                  variant="primary"
                  onClick={() => setShowEditGroupModal(true)}
                >
                  Edit Group
                </Button>
              </Col>
              <Col className="text-end">
                <Button
                  className="mb-2"
                  variant="primary"
                  onClick={() => setShowCreateSoundModal(true)}
                >
                  Add sound
                </Button>
              </Col>
            </Row>
          </Row>
          {renderSoundElements()}
          <SoundGroupModal
            edit={true}
            userId={props.userId}
            ambId={props.ambId}
            groupId={props.groupId}
            groupName={props.groupName}
            interval={props.interval}
            soundsLength={props.sounds.length}
            show={showEditGroupModal}
            handleClose={() => setShowEditGroupModal(false)}
            refresh={() => props.refresh()}
          />
          <SoundElementModal
            edit={false}
            userId={props.userId}
            ambId={props.ambId}
            groupId={props.groupId}
            show={showCreateSoundModal}
            handleClose={() => setShowCreateSoundModal(false)}
            refresh={() => props.refresh()}
          />
        </Accordion.Body>
      </Accordion.Item>
    </Row>
  );
}

export default EditSoundGroup;
