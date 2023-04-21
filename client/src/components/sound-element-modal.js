import { useState, useEffect } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import HoverTip from "./hover-tip";

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

  const serverUrl = process.env.SERVER_URL;
  const { getAccessTokenSilently } = useAuth0();


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

  const postNewSound = async () => {
    const token = await getAccessTokenSilently();
    const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: Number(props.userId),
          soundName: soundName,
          url: soundUrl,
          volume: Number(soundVolume),
          start: Number(startTime),
          end: Math.max(Number(endTime), -1),
          chain: { from: Number(chainFrom), to: Number(chainTo) },
        })
      };
      fetch(`${serverUrl}/ambs/${props.ambId}/${props.groupId}`, requestOptions)
        .then(res => {
          if(res.ok) {
            res.json()
              .then(res => {
                console.log(`Created sound ${res.sound_id} for group ${res.group_id} in Amb #${res.amb_id}`);
                setSoundName('New Sound Element');
                setSoundUrl('');
                setSoundVolume(100);
                setStartTime(0);
                setEndTime(-1);
                setChainFrom(0);
                setChainTo(0);
                props.refresh();
                props.handleClose();
              })
              .catch(error => {
                console.error(error);
              });
          } else {
            res.json()
              .then(res => {
                console.error(res.message);
                setAlertMessage(res.message);
                setShowAlert(true);
              })
              .catch(error => {
                console.error(error);
              });
          }
        })
        .catch(error => {
          console.error(error);
          setAlertMessage('Failed to fetch');
          setShowAlert(true);
        });
  }

  const putEditSound = async () => {
    const token = await getAccessTokenSilently();
    const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: Number(props.userId),
          soundName: soundName,
          url: soundUrl,
          volume: Number(soundVolume),
          start: Number(startTime),
          end: Math.max(Number(endTime), -1),
          chain: { from: Number(chainFrom), to: Number(chainTo) },
        })
      };
      fetch(`${serverUrl}/ambs/${props.ambId}/${props.groupId}/${props.soundId}`, requestOptions)
        .then(res => {
          if(res.ok) {
            res.json()
              .then(res => {
                console.log(`Updated Sound ${res.sound_id} of group ${res.group_id} in Amb ${res.amb_id}`);
                props.refresh();
                props.handleClose();
              })
              .catch(error => {
                console.error(error);
              });
          } else {
            res.json()
              .then(res => {
                console.error(res.message);
                setAlertMessage(res.message);
                setShowAlert(true);
              })
              .catch(error => {
                console.log(error);
              });
          }
        })
        .catch(error => {
          console.error(error);
          setAlertMessage('Failed to fetch');
          setShowAlert(true);
        });
  }

  const deleteSoundElement = async () => {
    const token = await getAccessTokenSilently();
    const requestOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: Number(props.userId),
        })
      };
      fetch(`${serverUrl}/ambs/${props.ambId}/${props.groupId}/${props.soundId}`, requestOptions)
        .then(res => {
          if(res.ok) {
            res.json()
              .then(res => {
                console.log(`Deleted sound ${res.sound_id} from group ${res.group_id} in Amb ${res.amb_id}`);
                props.refresh();
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            res.json()
              .then(res => {
                console.error(res.message);
                setAlertMessage(res.message);
                setShowAlert(true);
              })
              .catch(error => {
                console.log(error);
              });
          }
        })
        .catch(error => {
          console.error(error);
          setAlertMessage('Failed to fetch');
          setShowAlert(true);
        });
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
        <Row>
          <Alert
            className="my-2 text-center"
            variant="danger"
            show={showAlert}
            onClose={() => setShowAlert(false)}
            dismissible
          >
            {alertMessage}
          </Alert>
        </Row>
        <Row>
          <Form.Group controlId="formSoundName">
            <Form.Label>Sound Name</Form.Label>
            <Form.Control
              value={soundName}
              onChange={(e) => setSoundName(e.target.value)}
            />
          </Form.Group>
        </Row>
        <Row className="my-2">
          <Form.Group controlId="formUrl">
            <Form.Label>
              Url
              <HoverTip
                id="urlTip"
                message="Supports YouTube links and direct audio file links"
              />
            </Form.Label>
            <Form.Control
              value={soundUrl}
              onChange={(e) => setSoundUrl(e.target.value)}
            />
          </Form.Group>
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
            <HoverTip
              id="timestampTip"
              message="in seconds"
            />
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
              <Form.Label>
                End
                <HoverTip
                  id="endTimeTip"
                  message="-1 means play to end"
                />
              </Form.Label>
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
            <HoverTip
              id="chainTip"
              message="Additional times to play"
            />
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
