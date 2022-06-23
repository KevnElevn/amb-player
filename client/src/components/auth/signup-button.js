import { useAuth0 } from '@auth0/auth0-react';
import Button from 'react-bootstrap/Button';

function SignupButton() {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      className="ms-2"
      onClick={() => loginWithRedirect({ screen_hint: 'signup' })}
    >
      Sign up
    </Button>
  );
};
export default SignupButton;
