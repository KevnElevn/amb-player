import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import EditSoundGroup from "./edit-sound-group";
import SoundGroupModal from "./sound-group-modal";

class EditAmb extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isLoggedIn: this.props.isLoggedIn,
      ambName: '',
      ambOwner: '',
      ambOwnerId: -1,
      ambData: [],
      showCreateModal: false,
    }
  }

  fetchData() { console.log("fetching");
    fetch('http://localhost:3001/amb/'+this.props.ambId)
      .then(res => res.json())
      .then((result) => {
        this.setState({ ambName: result.ambName, ambOwner: result.ambOwner, ambOwnerId: result.ambOwnerId, ambData: result.ambData });
      })
      .catch(error => {
        console.error(error);
      })
  }

  componentDidMount() {
    this.fetchData();
  }

  renderSoundGroups() {
    return (
      this.state.ambData.map((element, index) => {
        return (
          <EditSoundGroup
            userId={this.props.userId}
            key={`${this.props.ambId}+${element.groupId}`}
            ambId={this.props.ambId}
            groupId={element.groupId}
            groupName={element.groupName}
            interval={element.interval}
            sounds={element.sounds}
            refresh={() => this.fetchData()}
          />
        )
      })
    );
  }

  handleChange(stateName, e) {
    this.setState({ [stateName]: e.target.value });
  }

  render() {
    return(
      <Container>
        <Row className="mt-2">
          <Form>
            <Form.Group controlId="ambNameForm">
              <Form.Label>Amb Name</Form.Label>
              <Form.Control
                size="lg"
                value={this.state.ambName}
                onChange={(e) => this.handleChange("ambName", e)}
              />
            </Form.Group>
          </Form>
        </Row>
        <Row className="text-center mt-2">
          <h6>By: {this.state.ambOwner}</h6>
        </Row>
        <Row className="mt-2">
          <Col className="text-end">
            <Button
              onClick={() => this.props.toggleEdit()}
            >
              Finish
            </Button>
          </Col>
          <Col className="text-start">
            <Button>Save</Button>
          </Col>
        </Row>
        <Row>
          <Accordion>
            {this.renderSoundGroups()}
          </Accordion>
        </Row>
        <Row className="mt-2">
          <Button
            onClick={() => this.setState({ showCreateModal: true })}
          >
            +
          </Button>
          <SoundGroupModal
            userId={this.props.userId}
            ambId={this.props.ambId}
            show={this.state.showCreateModal}
            handleClose={() => this.setState({ showCreateModal: false })}
            refresh={() => this.fetchData()}
          />
        </Row>
      </Container>
    );
  }
}

export default EditAmb;
