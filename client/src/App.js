import './App.css';
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Link,
  NavLink
} from "react-router-dom";
import Auth0ProviderWithHistory from './components/auth/auth0-provider-with-history';
import AuthenticationButtons from './components/auth/authentication-buttons';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import SearchPage from "./routes/search-page";
import BrowsePage from "./routes/browse-page";
import MyAmbsPage from "./routes/my-ambs-page";
import AmbPage from "./routes/amb-page";

function App(props) {
  const [userId, setUserId] = useState(-1);

  const renderMyAmb = () => {
    return (
      <Nav.Item>
        <Nav.Link as={NavLink} to="/myambs">My Ambs</Nav.Link>
      </Nav.Item>
    );
  }

  return (
    <BrowserRouter>
      <Auth0ProviderWithHistory>
        <div className="App">
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand as={Link} to="/">AmbienceGen</Navbar.Brand>
            <Nav>
              {userId > 0 ? renderMyAmb() : null}
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
        </div>
        <Routes>
          <Route path="myambs" element={<MyAmbsPage userId={userId} />} />
          <Route path="search" element={<SearchPage userId={userId} />} />
          <Route path="browse" element={<BrowsePage userId={userId} />} />
          <Route path="amb/:ambId" element={<AmbPage userId={userId} />} />
          <Route path="*" element={<main style={{ padding:"1rem"}}><p>There's nothing here!</p></main>} />
        </Routes>
      </Auth0ProviderWithHistory>
    </BrowserRouter>
  );
}

export default App;
