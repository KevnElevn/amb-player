import { useState, useEffect } from 'react';
import AmbTable from '../components/amb-table';
import AmbModal from '../components/amb-modal';
import UserModal from '../components/user-modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

function MyAmbsPage(props) {
  const [myAmbsList, setMyAmbsList] = useState([]);
  const [showAmbModal, setShowAmbModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const getData = () => {
    console.log("Getting Ambs list...");
    fetch(serverUrl+"/directory/?user="+props.userId)
      .then(res => {
        if(res.status >= 400)
          throw new Error('Server error!');
        return res.json();
      })
      .then(result => {
        setMyAmbsList(result);
      })
      .catch(error => {
        console.error(error);
        setAlertMessage(error.message);
        setShowAlert(true);
      })
  };

  useEffect(() => {
    console.log("Getting Ambs list...");
    fetch(serverUrl+"/directory/?user="+props.userId)
      .then(res => {
        if(res.status >= 400)
          throw new Error('Server error!');
        return res.json();
      })
      .then(result => {
        setMyAmbsList(result);
      })
      .catch(error => {
        console.error(error);
        setAlertMessage(error.message);
        setShowAlert(true);
      })
  }, [props.userId, serverUrl]);

  return (
    <Container>
      <Row className="text-center mt-2">
        <h2>My Ambs</h2>
      </Row>
      <Row className="text-center">
        <h6>{props.username}</h6>
      </Row>
      <Row>
        <Alert
          className="my-2 text-center"
          variant="danger"
          show={showAlert}
        >
          {alertMessage}
        </Alert>
      </Row>
      <Row className="text-start">
        <Col>
          <Button
            variant="primary"
            onClick={() => setShowAmbModal(true)}
          >
            Create
          </Button>
        </Col>
        <Col className="text-end">
          <Button
            variant="primary"
            onClick={() => setShowUserModal(true)}
          >
            Change name
          </Button>
        </Col>
      </Row>
      <Row>
        <AmbTable ambList={myAmbsList} />
      </Row>
      <AmbModal
        userId={props.userId}
        show={showAmbModal}
        handleClose={() => setShowAmbModal(false)}
        refresh={() => getData()}
      />
      <UserModal
        userId={props.userId}
        username={props.username}
        show={showUserModal}
        handleClose={() => setShowUserModal(false)}
        refresh={(name) => props.updateUsername(name)}
      />
    </Container>
  );
}

export default MyAmbsPage;
