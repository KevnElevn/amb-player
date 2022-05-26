import { useParams } from "react-router-dom";
import Amb from "../components/amb";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
import { Beach as dummyData } from "./dummy-data.js";

function AmbPage(props){
  let params = useParams();
  return (
    <Container>
      <Row className="text-center mt-2">
        <h3>Amb #{params.ambId}</h3>
      </Row>
      <Amb
        isLoggedIn={props.isLoggedIn}
        ambId={params.ambId}
        soundGroups={dummyData.ambData}
      />
    </Container>
  );
}

export default AmbPage;
