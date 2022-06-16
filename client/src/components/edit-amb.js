import React from "react";
import EditSoundGroup from "./edit-sound-group";
import SoundGroupModal from "./sound-group-modal";
import { Navigate } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

class EditAmb extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isLoggedIn: this.props.isLoggedIn,
      isDeleting: false,
      showAlert: false,
      alertMessage: '',
      exitPage: false,
      ambName: '',
      ambOwner: '',
      ambOwnerId: -1,
      ambData: [],
      showCreateModal: false,
    }
  }

  getData() {
    console.log("Getting Amb data...");
    fetch('http://localhost:3001/amb/'+this.props.ambId)
      .then(res => res.json())
      .then((result) => {
        this.setState({ ambName: result.ambName, ambOwner: result.ambOwner, ambOwnerId: result.ambOwnerId, ambData: result.ambData });
      })
      .catch(error => {
        console.error(error);
      })
  }

  putEditAmb() {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.props.userId,
          ambName: this.state.ambName,
        })
      };
      fetch(`http://localhost:3001/amb/${this.props.ambId}`, requestOptions)
        .then((res) => res.json())
        .then((res) => {
          console.log(`Updated Amb ${res.id}`);
          this.getData();
        })
        .catch((error) => console.error(error));
  }

  componentDidMount() {
    this.getData();
  }

  deleteAmb() {
    if(this.state.ambData.length > 0) {
      this.setState({ showAlert: true, alertMessage: 'Amb must be empty to delete!' });
      return;
    }
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.props.userId,
        })
      };
      fetch(`http://localhost:3001/amb/${this.props.ambId}`, requestOptions)
        .then((res) => res.json())
        .then((res) => {
          console.log('Deleted Amb ' + res.id );
          this.setState({ exitPage: true });
        })
        .catch((error) => console.error(error));
  }

  renderSoundGroups() {
    return (
      this.state.ambData.map((element, index) => {
        return (
          <EditSoundGroup
            key={`${this.props.ambId}+${element.groupId}`}
            userId={this.props.userId}
            ambId={this.props.ambId}
            groupId={element.groupId}
            groupName={element.groupName}
            interval={element.interval}
            sounds={element.sounds}
            refresh={() => this.getData()}
          />
        )
      })
    );
  }

  renderDeleteButton() {
    if(this.state.isDeleting) {
      return (
        <Col>
          <Button
            className="me-2"
            variant="secondary"
            onClick={() => this.setState({ isDeleting: false })}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => this.deleteAmb()}
          >
            Delete
          </Button>
        </Col>
      );
    } else {
      return (
        <Col>
          <Button
            variant="warning"
            onClick={() => this.setState({ isDeleting: true })}
          >
            Delete Amb
          </Button>
        </Col>
      );
    }
  }

  renderAlert() {
    if(this.state.showAlert) {
      return (
        <Alert
          className="my-2"
          variant="danger"
          onClose={() => this.setState({ showAlert: false })}
          dismissible
        >
          {this.state.alertMessage}
        </Alert>
      );
    } else {
      return null;
    }
  }

  handleChange(stateName, e) {
    this.setState({ [stateName]: e.target.value });
  }

  render() {
    return(
      <Container>
        {this.renderAlert()}
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
        <Row className="my-2">
          <Col className="text-end">
            <Button
              onClick={() => this.props.toggleEdit()}
            >
              Finish
            </Button>
          </Col>
          <Col className="text-center">
            <Button
              onClick={() => this.putEditAmb()}
            >
              Save
            </Button>
          </Col>
          <Col className="text-start">
            {this.renderDeleteButton()}
          </Col>
        </Row>
        <Row>
          <Accordion>
            {this.renderSoundGroups()}
          </Accordion>
        </Row>
        <Row className="mt-4">
          <Col className="text-center">
            <Button
              onClick={() => this.setState({ showCreateModal: true })}
            >
              Create New Group
            </Button>
          </Col>
          <SoundGroupModal
            edit={false}
            userId={this.props.userId}
            ambId={this.props.ambId}
            show={this.state.showCreateModal}
            handleClose={() => this.setState({ showCreateModal: false })}
            refresh={() => this.getData()}
          />
        </Row>
        {this.state.exitPage ? <Navigate to="/myambs" /> : null}
      </Container>
    );
  }
}

export default EditAmb;
