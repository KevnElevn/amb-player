import { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function SoundElementModal(props) {
  const [soundName, setSoundName] = useState("New Sound Element");
  const [soundUrl, setSoundUrl] = useState('');
  const [soundVolume, setSoundVolume] = useState(100);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(-1);
  const [chainFrom, setChainFrom] = useState(0);
  const [chainTo, setChainTo] = useState(0);

  const postNewSound = () => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: props.userId,
          soundName: soundName,
          url: soundUrl,
          volume: soundVolume,
          start: startTime,
          end: endTime,
          chain: { from: chainFrom, to: chainTo },
        })
      };
      fetch(`http://localhost:3001/amb/${props.ambId}/${props.groupId}`, requestOptions)
        .then((res) => res.json())
        .then((res) => {
          console.log("POST created sound " + res.soundId + " for group " + props.groupId);
          props.refresh();
          props.handleClose();
        })
        .catch((error) => console.error(error));
  }
  return (
    <Modal
      size="lg"
      show={props.show}
      onHide={() => props.handleClose()}
    >
      <Modal.Header closeButton>
        <Modal.Title>Create new sound element</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Row>
        <Form>
          <Form.Group controlId="formSoundName">
            <Form.Label>Sound Name</Form.Label>
            <Form.Control
              value={soundName}
              onChange={(e) => setSoundName(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Row>
      <Row className="my-2">
        <Form>
          <Form.Group controlId="formUrl">
            <Form.Label>Url</Form.Label>
            <Form.Control
              value={soundUrl}
              onChange={(e) => setSoundUrl(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Row>
      <Row className="mt-2">
        <p>Volume: {soundVolume}</p>
        <input
          id={"vol"+props.ambId+props.groupId}
          type="range"
          min="0"
          max="100"
          value={soundVolume}
          onChange={(e) => setSoundVolume(e.target.value)}
          step="1"
        />
      </Row>
      <Row className="mt-2 pb-2">
        <Col sm={2}>
          Timestamp
        </Col>
        <Col>
          <Form.Group controlId="formStartTime">
            <Form.Label>Start</Form.Label>
            <Form.Control
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="formEndTime">
            <Form.Label>End</Form.Label>
            <Form.Control
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </Form.Group>
        </Col>
        </Row>
        <Row>
          <Col sm={2}>
            Chain
          </Col>
          <Col>
            <Form.Group controlId="formChainFrom">
              <Form.Label>From</Form.Label>
              <Form.Control
                value={chainFrom}
                onChange={(e) => setChainFrom(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formChainTo">
              <Form.Label>To</Form.Label>
              <Form.Control
                value={chainTo}
                onChange={(e) => setChainTo(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => props.handleClose()}>Close</Button>
        <Button variant="primary" onClick={() => postNewSound()}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SoundElementModal;
