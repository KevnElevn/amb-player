import './App.css';
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Link,
  NavLink
} from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import SearchPage from "./routes/search-page";
import BrowsePage from "./routes/browse-page";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: true,
    };
  }

  renderMyAmb() {
    if(this.state.loggedIn) {
      return(
        <Nav.Item>
            <Nav.Link as={NavLink} to="/myambs">My Ambs</Nav.Link>
        </Nav.Item>
      );
    } else {
      return (
        <Nav.Item>
            <Nav.Link as={NavLink} to="/login">Log in</Nav.Link>
        </Nav.Item>
      );
    }
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand as={Link} to="/">AmbienceGen</Navbar.Brand>
            <Nav>
              {this.renderMyAmb()}
              <Nav.Item>
                  <Nav.Link as={NavLink} to="/browse">Browse</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                  <Nav.Link as={NavLink} to="/search">Search</Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar>
          <Outlet />
        </div>
        <Routes>
          <Route path="search" element={<SearchPage loggedIn={this.state.loggedIn} />} />
          <Route path="browse" element={<BrowsePage loggedIn={this.state.loggedIn} />} />
          <Route path="*" element={<main style={{ padding:"1rem"}}><p>There's nothing here!</p></main>} />
        </Routes>

      </BrowserRouter>
    );
  }
}

export default App;
