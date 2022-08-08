import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Alert from "react-bootstrap/Alert";
import SoundGroup from "./sound-group";

function Amb(props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [ambName, setAmbName] = useState('');
  const [ambOwner, setAmbOwner] = useState('');
  const [ambOwnerId, setAmbOwnerId] = useState(-1);
  const [ambData, setAmbData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const serverUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    setIsPlaying(props.audioContext.state === 'running');
    console.log('Getting Amb data...');
    fetch(serverUrl+'/ambs/'+props.ambId)
      .then(res => {
        if(res.ok) {
          res.json()
            .then((result) => {
              setAmbName(result.ambName);
              setAmbOwner(result.ambOwner);
              setAmbOwnerId(result.ambOwnerId);
              setAmbData(result.ambData);
            })
            .catch(error => {
              console.error(error);
            })
        } else {
          res.json()
            .then(res => {
              console.log(res.message);
              setAlertMessage(res.message);
              setShowAlert(true);
            })
            .catch(error => {
              console.error(error);
            })
        }
      })
      .catch(error => {
        console.error(error);
        setAlertMessage('Failed to fetch');
        setShowAlert(true);
      });
  }, [props.ambId, serverUrl, props.audioContext.state]);

  const renderSoundGroups = () => {
    return (
      ambData.map((element, index) => {
        return (
          <SoundGroup
            key={`${props.ambId}+${element.groupId}`}
            id={`${props.ambId}+${element.groupId}`}
            audioContext={props.audioContext}
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
                disabled={props.userId === ambOwnerId ? false : true}
                variant={props.userId === ambOwnerId ? "primary" : "secondary"}
                onClick={() => props.toggleEdit()}
              >
                Edit
              </Button>
            </Col>
            <Col className="text-center">
              <Button
                variant={isPlaying ? "success" : "warning"}
                onClick={()=> {
                  if(props.audioContext.state === 'suspended')
                    props.audioContext.resume().then(() =>
                      setIsPlaying(props.audioContext.state === 'running')
                    );
                  else if(props.audioContext.state === 'running')
                    props.audioContext.suspend().then(() =>
                      setIsPlaying(props.audioContext.state === 'running')
                    );
                }}
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
