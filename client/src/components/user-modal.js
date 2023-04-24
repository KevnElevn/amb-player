import { useState, useEffect } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

function UserModal(props) {
  const [username, setUsername] = useState(props.username);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    setUsername(props.username);
  }, [props.username]);

  const putUpdateUsername = async () => {
    const token = await getAccessTokenSilently();
    const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: Number(props.userId),
          newUsername: username
        })
      };
      fetch(serverUrl+'/userlist/'+props.userId, requestOptions)
        .then(res => {
          if(res.ok) {
            res.json()
              .then((res) => {
                console.log("PUT updated username to " + res.username);
                props.refresh(res.username);
                props.handleClose();
              })
              .catch(error => {
                console.error(error);
              })
          } else {
            res.json()
              .then((res) => {
                console.log(res.message);
                setAlertMessage(res.message);
                setShowAlert(true);
              })
              .catch(error => {
                console.error(error);
              })
          }
        })
        .catch(error => {
          console.error(error);
          setAlertMessage('Failed to fetch');
          setShowAlert(true);
        });
  }

  return (
    <Modal
      show={props.show}
      onHide={() => props.handleClose()}
    >
      <Modal.Header closeButton>
        <Modal.Title>Change username</Modal.Title>
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
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              putUpdateUsername();
            }}
          >
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => props.handleClose()}>Close</Button>
        <Button variant="primary" onClick={() => putUpdateUsername()}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UserModal;
