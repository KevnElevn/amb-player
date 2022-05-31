import { useParams } from "react-router-dom";
import Amb from "../components/amb";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

function AmbPage(props){
  let params = useParams();
  return (
    <Container>
      <Row className="text-center mt-2">
        <h6>Amb #{params.ambId}</h6>
      </Row>
      <Amb
        isLoggedIn={props.isLoggedIn}
        ambId={params.ambId}
      />
    </Container>
  );
}

export default AmbPage;
