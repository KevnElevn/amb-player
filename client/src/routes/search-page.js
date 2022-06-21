import { useState } from 'react';
import AmbTable from '../components/amb-table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';

function SearchPage(props) {
  const [ambList, setAmbList] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const getSearchResults = () => {
    console.log("Searching for \"" + searchTerm +"\"");
    fetch("http://localhost:3001/browse/?search="+searchTerm)
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
  };

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
        <h2>Search</h2>
      </Row>
      {renderAlert()}
      <Row>
        <Col>
          <Form className="my-2">
            <Form.Group controlId="formSearchTerm">
              <Form.Control
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Col>
        <Col xs="auto">
          <Button
            className="my-2"
            onClick={() => getSearchResults()}
          >
            Search
          </Button>
        </Col>
      </Row>
      <Row>
        <AmbTable ambList={ambList} />
      </Row>
    </Container>
  );
}

export default SearchPage;
