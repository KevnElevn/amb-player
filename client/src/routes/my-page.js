import { useState, useEffect } from 'react';
import AmbTable from '../components/amb-table';
import AmbModal from '../components/amb-modal';
import UserModal from '../components/user-modal';
import HoverTip from '../components/hover-tip';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Alert from 'react-bootstrap/Alert';

function MyPage(props) {
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
        if(res.ok) {
          res.json()
            .then(res => {
              setMyAmbsList(res);
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
  };

  useEffect(() => {
    console.log("Getting Ambs list...");
    fetch(serverUrl+"/directory/?user="+props.userId)
      .then(res => {
        if(res.ok) {
          res.json()
            .then(res => {
              setMyAmbsList(res);
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
  }, [props.userId, serverUrl]);

  return (
    <Container>
      <Row className="text-center mt-2">
        <h2>My Page</h2>
      </Row>
      <Row className="text-center">
        <h6>{props.username}</h6>
      </Row>
      <Row className="text-center">
      {props.userId > -1 ?
        <Col>
          <Badge
            as="button"
            pill
            variant="primary"
            onClick={() => setShowUserModal(true)}
          >
            Change name
          </Badge>
          <HoverTip
            id="passwordTip"
            message="To change password: Log out, then select 'Forgot Password?' on the login page"
          />
        </Col>
        : null
      }

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
      <Row>
        <h3>My Ambs</h3>
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
      </Row>
      <Row>
        <Col>
        <AmbTable ambList={myAmbsList} />
        </Col>
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

export default MyPage;
