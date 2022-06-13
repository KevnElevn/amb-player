import { useState, useEffect } from 'react';
import AmbTable from '../components/amb-table';
import AmbModal from '../components/amb-modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

function MyAmbsPage(props) {
  const [myAmbsList, setMyAmbsList] = useState([]);
  const [showAmbModal, setShowAmbModal] = useState(false);
  const fetchData = () => {
    fetch("http://localhost:3001/browse/?user="+props.userId)
      .then(res => res.json())
      .then(result => {
        setMyAmbsList(result);
      })
      .catch(error => {
        console.error(error);
      })
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Container>
      <Row className="text-center mt-2">
        <h2>My Ambs</h2>
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
        <AmbTable ambList={myAmbsList} />
      </Row>
      <AmbModal
        userId={props.userId}
        show={showAmbModal}
        handleClose={() => setShowAmbModal(false)}
        refresh={() => fetchData()}
      />
    </Container>
  );
}

export default MyAmbsPage;
