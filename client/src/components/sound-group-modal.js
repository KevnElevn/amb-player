import { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

function SoundGroupModal(props) {
  const [groupName, setGroupName] = useState("New Group");
  const [intervalFrom, setIntervalFrom] = useState(0);
  const [intervalTo, setIntervalTo] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if(props.edit) {
      setGroupName(props.groupName);
      setIntervalFrom(props.interval.from);
      setIntervalTo(props.interval.to);
    }
  }, [])

  const postNewGroup = () => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: props.userId,
          groupName: groupName,
          interval: { from: intervalFrom, to: intervalTo },
        })
      };
      fetch('http://localhost:3001/amb/'+props.ambId, requestOptions)
        .then((res) => res.json())
        .then((res) => {
          console.log("Created new group " + res.group_id + "in Amb " + props.amb_id);
          props.refresh();
          props.handleClose();
        })
        .catch((error) => console.error(error));
  }

  const putEditGroup = () => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: props.userId,
          groupName: groupName,
          interval: { from: intervalFrom, to: intervalTo },
        })
      };
      fetch(`http://localhost:3001/amb/${props.ambId}/${props.groupId}`, requestOptions)
        .then((res) => res.json())
        .then((res) => {
          console.log(`Updated group ${res.group_id} from Amb ${res.amb_id}`);
          props.refresh();
          props.handleClose();
        })
        .catch((error) => console.error(error));
  }

  const deleteSoundGroup = () => {
    if(props.soundsLength > 0) {
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

  const renderDeleteButton = () => {
    if(isDeleting) {
      return (
        <Col className="text-start">
          <Button
            className="mb-2 me-2"
            variant="secondary"
            onClick={() => setIsDeleting(false)}
          >
            Cancel
          </Button>
          <Button
            className="mb-2 me-2"
            variant="danger"
            onClick={() => deleteSoundGroup()}
          >
            Delete
          </Button>
        </Col>
      );
    } else {
      return (
        <Col className="text-start">
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

  const handleSave = () => {
    if(props.edit)
      putEditGroup();
    else
      postNewGroup();
  }

  return (
    <Modal
      show={props.show}
      onHide={() => props.handleClose()}
    >
      <Modal.Header closeButton>
        <Modal.Title>{props.edit ? "Edit" : "Create new"} sound group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {renderAlert()}
      <Row>
        <Form>
          <Form.Group controlId="formGroupName">
            <Form.Label>Group Name</Form.Label>
            <Form.Control
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Row>
      <Row className="mt-2 pb-2">
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
      </Modal.Body>
      <Modal.Footer>
        {props.edit ? renderDeleteButton() : null}
        <Col className="text-end">
          <Button className="ms-2 mb-2" variant="secondary" onClick={() => props.handleClose()}>Close</Button>
          <Button className="ms-2 mb-2" variant="primary" onClick={() => handleSave()}>Save</Button>
        </Col>
      </Modal.Footer>
    </Modal>
  );
}

export default SoundGroupModal;
