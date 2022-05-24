import { useParams } from "react-router-dom";
import Amb from "../components/amb";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";

function AmbPage(props){
  let params = useParams();
  const dummyData = {
    ambId: 1,
    ambData: [
      {
        groupName: "Background",
        groupId: 1,
        sounds: [
          {
            name: "bgMusic",
            id: 1,
            url: "https://www.youtube.com/watch?v=y_ezfsJ4-Lw",
            volume: 100,
            start: 30,
            end: 50,
            interval: { start: 10, end: 10 },
            chain: { from: 0, to: 0 },
          },
          {
            name: "bgMusic2",
            id: 2,
            url: "https://www.youtube.com/watch?v=Zr-PHm_qLgg",
            volume: 100,
            start: 4,
            end: 50,
            interval: { start: 10, end: 10},
            chain: { from: 0, to: 0 },
          },
          {
            name: "bgMusic3",
            id: 3,
            url: "https://www.youtube.com/watch?v=AiX1dBfmftA",
            volume: 100,
            start: 0,
            end: 50,
            interval: { start: 10, end: 10},
            chain: { from: 0, to: 0 },
          },
        ]
      },
      {
        groupName: "Bloops",
        groupId: 2,
        sounds: [
          {
            name: "bloops",
            id: 1,
            url: "https://www.youtube.com/watch?v=sQ-KRNc9SaE",
            volume: 100,
            start: 40,
            end: 44,
            interval: { start: 5, end: 5},
            chain: { from: 0, to: 3},
          }
        ]
      },
      {
        groupName: "Fish",
        groupId: 3,
        sounds: [
          {
            name: "fishBite",
            id: 1,
            url: "https://www.youtube.com/watch?v=sKd1mwB1I3g",
            volume: 100,
            start: 0,
            end: -1,
            interval: { start: 10, end: 10},
            chain: { from: 2, to: 5 },
          }
        ]
      }
    ]
  }
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
