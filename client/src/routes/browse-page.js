import { useState, useEffect } from 'react';
import AmbTable from '../components/amb-table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

function BrowsePage(props) {
  const [ambList, setAmbList] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    console.log("Getting Ambs list...");
    fetch(serverUrl+"/browse")
      .then(res => {
        if(res.status >= 400)
          throw new Error('Server error!');
        return res.json();
      })
      .then(result => {
        setAmbList(result);
      })
      .catch(error => {
        console.error(error);
        setAlertMessage(error.message);
        setShowAlert(true);
      })
  }, [props, serverUrl]);

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
        <h2>Browse</h2>
      </Row>
      {renderAlert()}
      <Row>
        <AmbTable ambList={ambList} />
      </Row>
    </Container>
  );
}

export default BrowsePage;
