import { useState, useEffect } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import EditSoundGroup from "./edit-sound-group";
import SoundGroupModal from "./sound-group-modal";
import { Navigate } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

function EditAmb(props) {
  const [ambName, setAmbName] = useState('');
  const [ambOwner, setAmbOwner] = useState('');
  const [ambData, setAmbData] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [exitPage, setExitPage] = useState(false);

  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    console.log("Getting Amb data...");
    fetch(serverUrl+'/ambs/'+props.ambId)
      .then(res => {
        if(res.status >= 400)
          throw new Error('Server error!');
        return res.json();
      })
      .then((result) => {
        setAmbName(result.ambName);
        setAmbOwner(result.ambOwner);
        setAmbData(result.ambData);
      })
      .catch(error => {
        console.error(error);
        setAlertMessage(error.message);
        setShowAlert(true);
      })
  }, [props.ambId, serverUrl]);

  const getData = () => {
    console.log("Getting Amb data...");
    fetch(serverUrl+'/ambs/'+props.ambId)
      .then(res => {
        if(res.status >= 400)
          throw new Error('Server error!');
        return res.json();
      })
      .then((result) => {
        setAmbName(result.ambName);
        setAmbOwner(result.ambOwner);
        setAmbData(result.ambData);
      })
      .catch(error => {
        console.error(error);
        setAlertMessage(error.message);
        setShowAlert(true);
      })
  }

  const putEditAmb = async () => {
    const token = await getAccessTokenSilently();
    const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: Number(props.userId),
          ambName: ambName,
        })
      };
      fetch(`${serverUrl}/ambs/${props.ambId}`, requestOptions)
        .then(res => {
          if(res.status >= 400)
            throw new Error('Server error!');
          return res.json();
        })
        .then((res) => {
          console.log(`Updated Amb ${res.id}`);
          getData();
        })
        .catch(error => {
          console.error(error);
          setAlertMessage(error.message);
          setShowAlert(true);
        })
  }

  const deleteAmb = async () => {
    if(ambData.length > 0) {
      setAlertMessage('Amb must be empty to delete!');
      setShowAlert(true);
      return;
    }
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
      fetch(`${serverUrl}/ambs/${props.ambId}`, requestOptions)
        .then(res => {
          if(res.status >= 400)
            throw new Error('Server error!');
          return res.json();
        })
        .then((res) => {
          console.log('Deleted Amb ' + res.id );
          setExitPage(true);
        })
        .catch(error => {
          console.error(error);
          setAlertMessage(error.message);
          setShowAlert(true);
        })
  }

  const renderSoundGroups = () => {
    return (
      ambData.map((element, index) => {
        return (
          <EditSoundGroup
            key={`${props.ambId}+${element.groupId}`}
            userId={props.userId}
            ambId={props.ambId}
            groupId={element.groupId}
            groupName={element.groupName}
            interval={element.interval}
            sounds={element.sounds}
            refresh={() => getData()}
          />
        )
      })
    );
  }

  const renderDeleteButton = () => {
    if(isDeleting) {
      return (
        <Col>
          <Button
            className="me-2"
            variant="secondary"
            onClick={() => setIsDeleting(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteAmb()}
          >
            Delete
          </Button>
        </Col>
      );
    } else {
      return (
        <Col>
          <Button
            variant="warning"
            onClick={() => setIsDeleting(true)}
          >
            Delete Amb
          </Button>
        </Col>
      );
    }
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

  return(
    <Container>
      {renderAlert()}
      <Row className="mt-2">
        <Form>
          <Form.Group controlId="ambNameForm">
            <Form.Label>Amb Name</Form.Label>
            <Form.Control
              size="lg"
              value={ambName}
              onChange={(e) => setAmbName(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Row>
      <Row className="text-center mt-2">
        <h6>By: {ambOwner}</h6>
      </Row>
      <Row className="my-2">
        <Col className="text-end">
          <Button
            onClick={() => props.toggleEdit()}
          >
            Finish
          </Button>
        </Col>
        <Col className="text-center">
          <Button
            onClick={() => putEditAmb()}
          >
            Save
          </Button>
        </Col>
        <Col className="text-start">
          {renderDeleteButton()}
        </Col>
      </Row>
      <Row>
        <Accordion>
          {renderSoundGroups()}
        </Accordion>
      </Row>
      <Row className="mt-4">
        <Col className="text-center">
          <Button
            onClick={() => setShowCreateModal(true)}
          >
            Create New Group
          </Button>
        </Col>
        <SoundGroupModal
          edit={false}
          userId={props.userId}
          ambId={props.ambId}
          show={showCreateModal}
          handleClose={() => setShowCreateModal(false)}
          refresh={() => getData()}
        />
      </Row>
      {exitPage ? <Navigate to="/myambs" /> : null}
    </Container>
  );
}

export default EditAmb;
