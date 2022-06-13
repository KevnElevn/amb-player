import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function AmbModal(props) {
  const [ambName, setAmbName] = useState('New Amb');
  const postNewAmb = () => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: props.userId,
          ambName: ambName,
        })
      };
      fetch('http://localhost:3001/amb/', requestOptions)
        .then((res) => res.json())
        .then((res) => {
          console.log("POST created new amb " + res.ambId);
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
        <Modal.Title>Create new Amb</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Form>
            <Form.Group controlId="formAmbName">
              <Form.Label>Amb Name </Form.Label>
              <Form.Control
                value={ambName}
                onChange={(e) => setAmbName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => props.handleClose()}>Close</Button>
        <Button variant="primary" onClick={() => postNewAmb()}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AmbModal;
