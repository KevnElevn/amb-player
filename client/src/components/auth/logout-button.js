import { useAuth0 } from '@auth0/auth0-react';
import Button from 'react-bootstrap/Button';

function LogoutButton() {
  const { logout } = useAuth0();

  return (
    <Button
      className="ms-2"
      onClick={() => logout({ returnTo: window.location.origin })}
    >
      Log out
    </Button>
  );
};

export default LogoutButton;
