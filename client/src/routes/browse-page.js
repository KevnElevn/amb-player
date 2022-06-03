import { useState, useEffect } from 'react';
import AmbTable from '../components/amb-table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

function BrowsePage(props) {
  const [ambList, setAmbList] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3001/browse")
      .then(res => res.json())
      .then(result => {
        setAmbList(result);
      })
      .catch(error => {
        console.error(error);
      })
  }, [props]);
  return (
    <Container>
      <Row className="text-center mt-2">
        <h2>Browse</h2>
      </Row>
      <Row>
        <AmbTable ambList={ambList} />
      </Row>
    </Container>
  );
}

export default BrowsePage;
