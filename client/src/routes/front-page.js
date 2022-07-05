import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function FrontPage(props) {
  return (
    <Container>
      <Row className="text-center my-2">
        <h2>Amb Player</h2>
      </Row>
      <Row className="my-2">
        <Col className="my-2">
        <h3>What is this?</h3>
          AmbPlayer is a web application where users can combine the audio components of media to create dynamic soundscapes. Users can create experiences unlike prerecorded audio, which are the same every playback, by organizing sounds into groups that play at fixed or variable intervals.
        </Col>
        <Col className="my-2">
          <h2>Amb</h2>
          An Amb is a collection of data that defines and configures the soundscape. They contain the following:
          <ul>
            <li>Sound Groups</li>
            <ul>
            <li>Title</li>
            <li>Interval between plays (in seconds)</li>
            <li>Sound Elements</li>
              <ul>
            <li>Name</li>
            <li>URL</li>
            <li>Volume</li>
            <li>Start and end timestamps (in seconds)</li>
            <li>Number of additional times played before interval</li>
              </ul>
            </ul>
          </ul>
        </Col>
      </Row>
      <Row className="text-center">
        <h2>Try it out!</h2>
      </Row>
      <Row className="my-2">
        <Col className="text-left">
          <h3>Listen</h3>
          Check out Ambs by clicking "Browse" on the navigation bar above. Then, select an Amb and click play.
        </Col>
        <Col className="text-left">
          <h3>Make your own</h3>
          Register and log in to unlock navigation to My Ambs to begin creating your own Amb.
        </Col>
      </Row>
    </Container>
  );
}

export default FrontPage;
