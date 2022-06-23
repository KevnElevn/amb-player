import { useAuth0 } from '@auth0/auth0-react';
import Button from 'react-bootstrap/Button';

function LoginButton() {
  const { loginWithRedirect } = useAuth0();
  return (
    <Button
      className="ms-2"
      onClick={() => loginWithRedirect()}
    >
      Log in
    </Button>
  );
};

export default LoginButton;
