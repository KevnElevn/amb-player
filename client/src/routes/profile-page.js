import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import AmbTable from '../components/amb-table';

function ProfilePage(props) {
  const [userName, setUserName] = useState('');
  const [userAmbs, setUserAmbs] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  let params = useParams();

  useEffect(() => {
    console.log("Getting user data...");
    fetch(serverUrl+"/users/"+params.userId)
      .then(res => {
        if(res.ok) {
          res.json()
            .then(res => {
              setUserName(res.name);
              setUserAmbs(res.ambs);
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
  }, [props, serverUrl, params]);

  return (
    <Container>
      <Row className="text-center mt-2">
        <h2>{userName}'s Page</h2>
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
        <AmbTable ambList={userAmbs} />
      </Row>
    </Container>
  );
}

export default ProfilePage;
