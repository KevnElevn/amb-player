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
import SearchPage from "./routes/search-page";
import BrowsePage from "./routes/browse-page";
import MyAmbsPage from "./routes/my-ambs-page";
import AmbPage from "./routes/amb-page";

function App() {
  const { isAuthenticated } = useAuth0();
  const [userId, setUserId] = useState(-1);

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand className="ms-3" as={Link} to="/">AmbienceGen</Navbar.Brand>
        <Nav>
          <Nav.Item>
            <Nav.Link disabled={!isAuthenticated} as={NavLink} to="/myambs">My Ambs</Nav.Link>
          </Nav.Item>
          <Nav.Item>
              <Nav.Link as={NavLink} to="/browse">Browse</Nav.Link>
          </Nav.Item>
          <Nav.Item>
              <Nav.Link as={NavLink} to="/search">Search</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={NavLink} to="/amb/1">Test Amb</Nav.Link>
          </Nav.Item>
        </Nav>
        <AuthenticationButtons />
      </Navbar>
      <Outlet />
      <Routes>
        <Route path="myambs" element={<MyAmbsPage userId={userId} />} />
        <Route path="search" element={<SearchPage userId={userId} />} />
        <Route path="browse" element={<BrowsePage userId={userId} />} />
        <Route path="amb/:ambId" element={<AmbPage userId={userId} />} />
        <Route path="*" element={<main style={{ padding:"1rem"}}><p>There's nothing here!</p></main>} />
      </Routes>
    </>
  );
}

export default App;
