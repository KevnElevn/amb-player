import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Alert from "react-bootstrap/Alert";
import SoundGroup from "./sound-group";

function Amb(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(props.isLoggedIn);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ambName, setAmbName] = useState('');
  const [ambOwner, setAmbOwner] = useState('');
  const [ambOwnerId, setAmbOwnerId] = useState(-1);
  const [ambData, setAmbData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    console.log('Getting Amb data...');
    fetch('http://localhost:3001/amb/'+props.ambId)
      .then(res => {
        if(res.status >= 400)
          throw new Error('Server error!');
        return res.json();
      })
      .then((result) => {
        setAmbName(result.ambName);
        setAmbOwner(result.ambOwner);
        setAmbOwnerId(result.ambOwnerId);
        setAmbData(result.ambData);
      })
      .catch(error => {
        console.error(error);
        setAlertMessage(error.message);
        setShowAlert(true);
      })
  }, []);

  const renderSoundGroups = () => {
    return (
      ambData.map((element, index) => {
        return (
          <SoundGroup
            key={`${props.ambId}+${element.groupId}`}
            id={`${props.ambId}+${element.groupId}`}
            groupName={element.groupName}
            interval={element.interval}
            sounds={element.sounds}
            isPlaying={isPlaying}
          />
        )
      })
    );
  }

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
      return(
        <Row>
          <Row className="text-center mt-2">
            <h6>By: {ambOwner}</h6>
          </Row>
          <Row className="mt-2">
            <Col className="text-end">
              <Button
                onClick={() => props.toggleEdit()}
              >
                Edit
              </Button>
            </Col>
            <Col className="text-center">
              <Button
                variant={isPlaying ? "success" : "warning"}
                onClick={()=> setIsPlaying(!isPlaying)}
              >
                Play
              </Button>
            </Col>
            <Col className="text-start">
              <Button variant="secondary" disabled>Favorite</Button>
            </Col>
          </Row>
          <Row>
            <Accordion>
              {renderSoundGroups()}
            </Accordion>
          </Row>
        </Row>
      );
    }
  }

  return(
    <Container>
      <Row className="text-center mt-2">
        <h2>{ambName}</h2>
      </Row>
      {renderAlert()}

    </Container>
  );
}

export default Amb;
