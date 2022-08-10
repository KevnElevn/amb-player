import { useState, useEffect } from 'react';
import AmbTable from '../components/amb-table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';

function BrowsePage(props) {
  const [ambList, setAmbList] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    console.log("Getting Ambs list...");
    fetch(serverUrl+"/directory")
      .then(res => {
        if(res.ok) {
          res.json()
            .then(res => {
              setAmbList(res);
            })
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
  }, [props, serverUrl]);

  return (
    <Container>
      <Row className="text-center mt-2">
        <h2>Browse</h2>
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
        <AmbTable ambList={ambList} />
      </Row>
    </Container>
  );
}

export default BrowsePage;
