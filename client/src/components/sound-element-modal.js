import { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

function SoundElementModal(props) {
  const [soundName, setSoundName] = useState("New Sound Element");
  const [soundUrl, setSoundUrl] = useState('');
  const [soundVolume, setSoundVolume] = useState(100);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(-1);
  const [chainFrom, setChainFrom] = useState(0);
  const [chainTo, setChainTo] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if(props.edit) {
      setSoundName(props.name);
      setSoundUrl(props.url);
      setSoundVolume(props.volume);
      setStartTime(props.start);
      setEndTime(props.end);
      setChainFrom(props.chain.from);
      setChainTo(props.chain.to);
    }
  }, [props]);

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
        .then(res => {
          if(res.status >= 400)
            throw new Error('Server error!');
          return res.json();
        })
        .then((res) => {
          console.log("Created sound " + res.soundId + " for group " + props.groupId);
          props.refresh();
          props.handleClose();
        })
        .catch(error => {
          console.error(error);
          setAlertMessage(error.message);
          setShowAlert(true);
        })
  }

  const putEditSound = () => {
    const requestOptions = {
        method: 'PUT',
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
      fetch(`http://localhost:3001/amb/${props.ambId}/${props.groupId}/${props.soundId}`, requestOptions)
        .then(res => {
          if(res.status >= 400)
            throw new Error('Server error!');
          return res.json();
        })
        .then((res) => {
          console.log(`Updated Sound ${res.sound_id} of group ${res.group_id} in Amb ${res.amb_id}`);
          props.refresh();
          props.handleClose();
        })
        .catch(error => {
          console.error(error);
          setAlertMessage(error.message);
          setShowAlert(true);
        })
  }

  const deleteSoundElement = () => {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: props.userId,
        })
      };
      fetch(`http://localhost:3001/amb/${props.ambId}/${props.groupId}/${props.soundId}`, requestOptions)
        .then(res => {
          if(res.status >= 400)
            throw new Error('Server error!');
          return res.json();
        })
        .then((res) => {
          console.log(`Deleted sound ${res.sound_id} from group ${res.group_id} in Amb ${res.amb_id}`);
          props.refresh();
        })
        .catch(error => {
          console.error(error);
          setAlertMessage(error.message);
          setShowAlert(true);
        })
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
            className="me-2 mb-2"
            variant="secondary"
            onClick={() => setIsDeleting(false)}
          >
            Cancel
          </Button>
          <Button
            className="me-2 mb-2"
            variant="danger"
            onClick={() => deleteSoundElement()}
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
            Delete
          </Button>
        </Col>
      );
    }
  }

  const handleSave = () => {
    if(props.edit)
      putEditSound();
    else
      postNewSound();
  }

  return (
    <Modal
      size="lg"
      show={props.show}
      onHide={() => props.handleClose()}
    >
      <Modal.Header closeButton>
        <Modal.Title>{props.edit ? "Edit" : "Create new" } sound element</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {renderAlert()}
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
        <Col sm={3}>
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
          <Col sm={3}>
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
        {props.edit ? renderDeleteButton() : null}
        <Col className="text-end">
          <Button className="ms-2 mb-2" variant="secondary" onClick={() => props.handleClose()}>Close</Button>
          <Button className="ms-2 mb-2" variant="primary" onClick={() => handleSave()}>Save</Button>
        </Col>
      </Modal.Footer>
    </Modal>
  );
}

export default SoundElementModal;
