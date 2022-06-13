import { useState, useEffect } from 'react';
import AmbTable from '../components/amb-table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

function MyAmbsPage(props) {
  const [myAmbsList, setMyAmbsList] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3001/browse/?user="+props.userId)
      .then(res => res.json())
      .then(result => {
        setMyAmbsList(result);
      })
      .catch(error => {
        console.error(error);
      })
  }, [props]);
  return (
    <Container>
      <Row className="text-center mt-2">
        <h2>My Ambs</h2>
      </Row>
      <Row className="text-start">
        <Col>
          <Button
            variant="primary"
          >
            Create
          </Button>
        </Col>
      </Row>
      <Row>
        <AmbTable ambList={myAmbsList} />
      </Row>
    </Container>
  );
}

export default MyAmbsPage;
