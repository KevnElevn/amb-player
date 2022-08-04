import { useState, useEffect } from 'react';
import UserTable from '../components/user-table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

function UsersPage(props) {
  const [userList, setUserList] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    console.log("Getting Ambs list...");
    fetch(serverUrl+"/users")
      .then(res => {
        if(res.status >= 400)
          throw new Error('Server error!');
        return res.json();
      })
      .then(result => {
        setUserList(result);
      })
      .catch(error => {
        console.error(error);
        setAlertMessage(error.message);
        setShowAlert(true);
      })
  }, [props, serverUrl]);

  return (
    <Container>
      <Row className="text-center mt-2">
        <h2>Users</h2>
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
        <UserTable userList={userList} />
      </Row>
    </Container>
  );
}

export default UsersPage;
