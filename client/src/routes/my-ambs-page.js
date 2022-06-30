import { useState, useEffect } from 'react';
import AmbTable from '../components/amb-table';
import AmbModal from '../components/amb-modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

function MyAmbsPage(props) {
  const [myAmbsList, setMyAmbsList] = useState([]);
  const [showAmbModal, setShowAmbModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const getData = () => {
    console.log("Getting Ambs list...");
    fetch(serverUrl+"/browse/?user="+props.userId)
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
    fetch(serverUrl+"/browse/?user="+props.userId)
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
  }, [props.userId]);

  const renderAlert = () => {
    if(showAlert) {
      return (
        <Alert
          className="my-2"
          variant="danger"
        >
          <Row>
            <Col className="text-center">
              {alertMessage}
            </Col>
          </Row>
        </Alert>
      );
    } else {
      return null;
    }
  }

  return (
    <Container>
      <Row className="text-center mt-2">
        <h2>My Ambs</h2>
      </Row>
      {renderAlert()}
      <Row className="text-start">
        <Col>
          <Button
            variant="primary"
            onClick={() => setShowAmbModal(true)}
          >
            Create
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
    </Container>
  );
}

export default MyAmbsPage;
