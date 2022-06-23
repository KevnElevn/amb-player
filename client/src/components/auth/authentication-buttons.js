import React from 'react';
import LoginButton from './login-button';
import SignupButton from './signup-button';
import LogoutButton from './logout-button';
import { useAuth0 } from '@auth0/auth0-react';
import Nav from 'react-bootstrap/Nav';

function AuthenticationButtons() {
  const { isAuthenticated } = useAuth0();
  console.log('Authenticated: ', isAuthenticated);
  if(isAuthenticated) {
    return (
      <Nav className="ms-auto me-3">
        <Nav.Item>
          <LogoutButton />
        </Nav.Item>
      </Nav>
    );
  } else {
    return (
      <Nav className="ms-auto me-3">
        <Nav.Item>
          <LoginButton />
        </Nav.Item>
        <Nav.Item>
          <SignupButton />
        </Nav.Item>
      </Nav>
    );
  }
};

export default AuthenticationButtons;
