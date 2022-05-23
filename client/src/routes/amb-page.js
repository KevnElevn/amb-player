import { useParams } from "react-router-dom";
import Amb from "../components/amb";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function AmbPage(props){
  let params = useParams();
  const dummyData = [
    {
      groupName: "Background",
      sounds: [
        { name: "bgMusic", url: "https://www.youtube.com/watch?v=y_ezfsJ4-Lw", start: 30 },
        { name: "bgMusic2", url: "https://www.youtube.com/watch?v=Zr-PHm_qLgg", start: 4 },
        { name: "bgMusic3", url: "https://www.youtube.com/watch?v=AiX1dBfmftA", start: 0 },
      ]
    },
    {
      groupName: "Bloops",
      sounds: [
        { name: "bloops", url: "https://www.youtube.com/watch?v=sQ-KRNc9SaE", start: 4 }
      ]
    },
    {
      groupName: "Fish",
      sounds: [
        { name: "fishBite", url: "https://www.youtube.com/watch?v=sKd1mwB1I3g", start: 0 }
      ]
    }
  ]
  return (
    <Container>
      <Row className="text-center mt-2">
        <h3>Amb #{params.ambId}</h3>
      </Row>
      <Amb
        isLoggedIn={props.isLoggedIn}
        ambId={params.ambId}
        soundGroups={dummyData}
      />
    </Container>
  );
}

export default AmbPage;
