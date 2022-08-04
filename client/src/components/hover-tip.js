import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Badge from 'react-bootstrap/Badge';

function HoverTip(props) {
  return (
    <>
      <OverlayTrigger
        placement="top"
        delay={{ show: 250, hide: 400 }}
        overlay={
          <Tooltip id={props.id}>
            {props.message}
          </Tooltip>
        }
      >
        <Badge pill bg="secondary" className="ms-2">i</Badge>
      </OverlayTrigger>
    </>
  );
}

export default HoverTip;
