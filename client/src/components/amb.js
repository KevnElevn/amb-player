import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Alert from "react-bootstrap/Alert";
import SoundGroup from "./sound-group";

class Amb extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isLoggedIn: this.props.isLoggedIn,
      isPlaying: false,
      ambName: '',
      ambOwner: '',
      ambOwnerId: -1,
      ambData: [],
      showAlert: false,
      alertMessage: ''
    }
  }

  componentDidMount() {
    console.log('Getting Amb data...');
    fetch('http://localhost:3001/amb/'+this.props.ambId)
      .then(res => {
        if(res.status >= 400)
          throw new Error('Server error!');
        return res.json();
      })
      .then((result) => {
        this.setState({ ambName: result.ambName, ambOwner: result.ambOwner, ambOwnerId: result.ambOwnerId, ambData: result.ambData });
      })
      .catch(error => {
        console.error(error);
        this.setState({ alertMessage: error.message, showAlert: true });
      })
  }

  renderSoundGroups() {
    return (
      this.state.ambData.map((element, index) => {
        return (
          <SoundGroup
            key={`${this.props.ambId}+${element.groupId}`}
            id={`${this.props.ambId}+${element.groupId}`}
            groupName={element.groupName}
            interval={element.interval}
            sounds={element.sounds}
            isPlaying={this.state.isPlaying}
          />
        )
      })
    );
  }

  renderAlert() {
    if(this.state.showAlert) {
      return (
        <Alert
          className="my-2"
          variant="danger"
        >
          <Row>
            <Col className="text-center">
            {this.state.alertMessage}
            </Col>
          </Row>
        </Alert>
      );
    } else {
      return(
        <Row>
          <Row className="text-center mt-2">
            <h6>By: {this.state.ambOwner}</h6>
          </Row>
          <Row className="mt-2">
            <Col className="text-end">
              <Button
                onClick={() => this.props.toggleEdit()}
              >
                Edit
              </Button>
            </Col>
            <Col className="text-center">
              <Button
                variant={this.state.isPlaying ? "success" : "warning"}
                onClick={()=>this.setState({ isPlaying: !this.state.isPlaying })}
              >
                Play
              </Button>
            </Col>
            <Col className="text-start">
              <Button>Favorite</Button>
            </Col>
          </Row>
          <Row>
            <Accordion>
              {this.renderSoundGroups()}
            </Accordion>
          </Row>
        </Row>
      );
    }
  }

  render() {
    return(
      <Container>
        <Row className="text-center mt-2">
          <h2>{this.state.ambName}</h2>
        </Row>
        {this.renderAlert()}

      </Container>
    );
  }
}

export default Amb;
