import './App.css';
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Routes,
  Route,
  Outlet,
  Link,
  NavLink
} from "react-router-dom";
import AuthenticationButtons from './components/auth/authentication-buttons';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import FrontPage from "./routes/front-page";
import SearchPage from "./routes/search-page";
import BrowsePage from "./routes/browse-page";
import UsersPage from "./routes/users-page";
import MyPage from "./routes/my-page";
import AmbPage from "./routes/amb-page";
import ProfilePage from "./routes/profile-page";

function App() {
  const [userId, setUserId] = useState(-1);
  const [username, setUsername] = useState('');

  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const getUserId = async () => {
      const token = await getAccessTokenSilently();
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      fetch(`${serverUrl}/auth`, requestOptions)
        .then(res => {
          if(res.ok) {
            res.json()
              .then(res => {
                setUserId(res.id);
                setUsername(res.username);
                console.log(`Logged in as user: ${res.username} with id: ${res.id}`);
              })
              .catch(error => {
                console.error(error);
              });
          } else {
            res.json()
              .then(res => {
                setUserId(-1);
                setUsername('');
                console.error(res.message);
              })
              .catch(error => {
                console.error(error);
              });
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
    if(isAuthenticated) {
      getUserId();
    } else {
      setUserId(-1);
      setUsername('');
      console.log('Not logged in');
    }
  }, [isAuthenticated, getAccessTokenSilently, serverUrl]);

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand className="ms-3" as={Link} to="/">AmbPlayer</Navbar.Brand>
        <Nav>
          <Nav.Item>
            <Nav.Link disabled={!isAuthenticated} as={NavLink} to="/mypage">My Page</Nav.Link>
          </Nav.Item>
          <Nav.Item>
              <Nav.Link as={NavLink} to="/browse">Browse</Nav.Link>
          </Nav.Item>
          <Nav.Item>
              <Nav.Link as={NavLink} to="/users">Users</Nav.Link>
          </Nav.Item>
        </Nav>
        <AuthenticationButtons />
      </Navbar>
      <Outlet />
      <Routes>
        <Route path="mypage" element={<MyPage userId={userId} username={username} updateUsername={(name) => setUsername(name)}/>} />
        <Route path="search" element={<SearchPage userId={userId} />} />
        <Route path="browse" element={<BrowsePage userId={userId} />} />
        <Route path="users" element={<UsersPage userId={userId} />} />
        <Route path="amb/:ambId" element={<AmbPage userId={userId} />} />
        <Route path="users/:userId" element={<ProfilePage userId={userId} />} />
        <Route path="*" element={<FrontPage />} />
      </Routes>
    </>
  );
}

export default App;
