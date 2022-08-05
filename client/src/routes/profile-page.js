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
        if(res.status >= 400)
          throw new Error('Server error!');
        return res.json();
      })
      .then(result => {
        setUserName(result.name);
        setUserAmbs(result.ambs);
      })
      .catch(error => {
        console.error(error);
        setAlertMessage(error.message);
        setShowAlert(true);
      })
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
