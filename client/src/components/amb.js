import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import SoundGroup from "./sound-group"

class AmbPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isLoggedIn: this.props.isLoggedIn,
      isPlaying: false,
    }
  }

  renderSoundGroups() {
    return (
      this.props.soundGroups.map((element, index) => {
        return (
          <Accordion>
            <SoundGroup
              key={`${this.props.ambId}+${element.groupId}`}
              id={`${this.props.ambId}+${element.groupId}`}
              groupName={element.groupName}
              interval={element.interval}
              sounds={element.sounds}
              isPlaying={this.state.isPlaying}
            />
          </Accordion>
        )
      })
    );
  }

  render() {
    return(
      <Container>
        <Row className="text-center mt-2">
          <h3>Amb #{this.props.ambId}</h3>
        </Row>
        <Row className="mt-2">
          <Col className="text-end">
            <Button>Edit</Button>
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
        <Row className="mt-2">
          <Button>+</Button>
        </Row>
        {this.renderSoundGroups()}
      </Container>
    );
  }
}

export default AmbPage;
