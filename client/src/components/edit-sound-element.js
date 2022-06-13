import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function EditSoundElement(props){
  const [soundName, setSoundName] = useState(props.name);
  const [soundUrl, setSoundUrl] = useState(props.url);
  const [soundVolume, setSoundVolume] = useState(props.volume);
  const [startTime, setStartTime] = useState(props.start);
  const [endTime, setEndTime] = useState(props.end);
  const [chainFrom, setChainFrom] = useState(props.chain.from);
  const [chainTo, setChainTo] = useState(props.chain.to);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteSoundElement = () => {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: props.userId,
        })
      };
      fetch(`http://localhost:3001/amb/${props.ambId}/${props.groupId}/${props.soundId}`, requestOptions)
        .then((res) => res.json())
        .then((res) => {
          console.log(res.message);
          props.refresh();
        })
        .catch((error) => console.error(error));
  }
  const renderDeleteButton = () => {
    if(isDeleting) {
      return (
        <Col className="text-center">
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
        <Col className="text-center">
          <Button
            className="mb-2"
            variant="warning"
            onClick={() => setIsDeleting(true)}
          >
            Delete Sound
          </Button>
        </Col>
      );
    }
  }

  return (
    <Row className="mt-2 py-2 border-bottom">
      <Row>
        <Col xs={8}>
        <Form>
          <Form.Group controlId="formSoundName">
            <Form.Label>Sound Name</Form.Label>
            <Form.Control
              value={soundName}
              onChange={(e) => setSoundName(e.target.value)}
            />
          </Form.Group>
        </Form>
        <Form className="mt-2">
          <Form.Group controlId="formSoundUrl">
            <Form.Label>Url</Form.Label>
            <Form.Control
              value={soundUrl}
              onChange={(e) => setSoundUrl(e.target.value)}
            />
          </Form.Group>
        </Form>
        </Col>
        {renderDeleteButton()}
      </Row>
      <Row className="my-2">
        <p>Volume: {soundVolume}</p>
        <input
          id={"vol"+props.id}
          type="range"
          min="0"
          max="100"
          value={soundVolume}
          onChange={(e) => setSoundVolume(e.target.value)}
          step="1"
        />
      </Row>
      <Row>
        <Col sm={2}>
          Times
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
     </Row>
  );
}

export default EditSoundElement;
