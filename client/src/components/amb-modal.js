import { useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

function AmbModal(props) {
  const [ambName, setAmbName] = useState('New Amb');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const { getAccessTokenSilently } = useAuth0();


  const postNewAmb = async () => {
    const token = await getAccessTokenSilently();
    const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: Number(props.userId),
          ambName: ambName,
        })
      };
      fetch(serverUrl+'/amb/', requestOptions)
        .then(res => {
          if(res.status >= 400)
            throw new Error('Server error!');
          return res.json();
        })
        .then((res) => {
          console.log("POST created new amb " + res.ambId);
          props.refresh();
          props.handleClose();
        })
        .catch(error => {
          console.error(error);
          setAlertMessage(error.message);
          setShowAlert(true);
        })
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

  return (
    <Modal
      show={props.show}
      onHide={() => props.handleClose()}
    >
      <Modal.Header closeButton>
        <Modal.Title>Create new Amb</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {renderAlert()}
        <Row>
          <Form>
            <Form.Group controlId="formAmbName">
              <Form.Label>Amb Name </Form.Label>
              <Form.Control
                value={ambName}
                onChange={(e) => setAmbName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => props.handleClose()}>Close</Button>
        <Button variant="primary" onClick={() => postNewAmb()}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AmbModal;
