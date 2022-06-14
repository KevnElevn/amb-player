import React, { useState } from "react";
import EditSoundElement from "./edit-sound-element";
import SoundElementModal from "./sound-element-modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

function EditSoundGroup(props){
  const [groupName, setGroupName] = useState(props.groupName);
  const [intervalFrom, setIntervalFrom] = useState(props.interval.from);
  const [intervalTo, setIntervalTo] = useState(props.interval.to);
  const [soundsArray, setSoundsArray] = useState(props.sounds);
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const saveChanges = () => {
    console.log("saved");
  }

  const deleteSoundGroup = () => {
    if(props.sounds.length > 0) {
      setAlertMessage('Sound group must be empty to delete!');
      setShowAlert(true);
      return;
    }
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: props.userId,
        })
      };
      fetch(`http://localhost:3001/amb/${props.ambId}/${props.groupId}`, requestOptions)
        .then((res) => res.json())
        .then((res) => {
          console.log(`Deleted group ${res.group_id} from Amb ${res.amb_id}`);
          props.refresh();
        })
        .catch((error) => console.error(error));
  }
  const renderSaveButton = () => {
    if(
      groupName !== props.groupName ||
      intervalFrom !== props.interval.from ||
      intervalTo !== props.interval.to
    ) {
      return (
        <Button
          variant="primary"
          onClick={() => saveChanges()}
        >
          Save
        </Button>
      );
    } else {
      return null;
    }
  }
  const renderDeleteButton = () => {
    if(isDeleting) {
      return (
        <Col className="text-end">
          <Button
            className="mb-2"
            variant="secondary"
            onClick={() => setIsDeleting(false)}
          >
            Cancel
          </Button>
          <Button
            className="ms-2 mb-2"
            variant="danger"
            onClick={() => deleteSoundGroup()}
          >
            Delete
          </Button>
        </Col>
      );
    } else {
      return (
        <Col className="text-end">
          <Button
            className="mb-2"
            variant="warning"
            onClick={() => setIsDeleting(true)}
          >
            Delete Group
          </Button>
        </Col>
      );
    }
  }
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

  const renderAlert = () => {
    if(showAlert) {
      return (
        <Alert
          className="my-2"
          variant="danger"
          onClose={() => setShowAlert(false)}
          dismissible
        >
          {alertMessage}
        </Alert>
      );
    } else {
      return null;
    }
  }

  return (
    <Row className="border mt-2">
      <Accordion.Item eventKey={props.ambId+props.groupId}>
        <Accordion.Header>
          <Col className="overflow-auto">{groupName}</Col>
        </Accordion.Header>
        {renderAlert()}
        <Accordion.Body>
          <Row>
            <Col xs={8}>
              <Form>
                <Form.Group controlId="formGroupName">
                  <Form.Label>Group Name</Form.Label>
                  <Form.Control
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Col>
            {renderDeleteButton()}
          </Row>
          <Row className="border-bottom mt-2 pb-2">
            <Col sm={2}>
              Interval
            </Col>
            <Col>
              <Form.Group controlId="formIntervalFrom">
                <Form.Label>From</Form.Label>
                <Form.Control
                  value={intervalFrom}
                  onChange={(e) => setIntervalFrom(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formIntervalTo">
                <Form.Label>To</Form.Label>
                <Form.Control
                  value={intervalTo}
                  onChange={(e) => setIntervalTo(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            {renderSaveButton()}
          </Row>
          {renderSoundElements()}
          <Row>
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
            >
              +
            </Button>
          </Row>
          <SoundElementModal
            edit={false}
            userId={props.userId}
            ambId={props.ambId}
            groupId={props.groupId}
            show={showModal}
            handleClose={() => setShowModal(false)}
            refresh={() => props.refresh()}
          />
        </Accordion.Body>
      </Accordion.Item>
    </Row>
  );
}

export default EditSoundGroup;
