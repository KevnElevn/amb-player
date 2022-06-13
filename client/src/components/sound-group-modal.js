import { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function SoundGroupModal(props) {
  const [groupName, setGroupName] = useState("New Group");
  const [intervalFrom, setIntervalFrom] = useState(0);
  const [intervalTo, setIntervalTo] = useState(0);

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
          console.log("POST created new group " + res.groupId + "for Amb " + props.ambId);
          props.refresh();
          props.handleClose();
        })
        .catch((error) => console.error(error));
  }
  return (
    <Modal
      show={props.show}
      onHide={() => props.handleClose()}
    >
      <Modal.Header closeButton>
        <Modal.Title>Create new sound group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
        <Button variant="secondary" onClick={() => props.handleClose()}>Close</Button>
        <Button variant="primary" onClick={() => postNewGroup()}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SoundGroupModal;
