import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from "react-router-bootstrap";
import { useAuthService } from '../Common/Auth.Service';
import logo from "../../assets/logo.jpeg";
import placeholderProfileImage from "../../assets/placeholder.png";
import { Button, NavDropdown } from 'react-bootstrap';

const NavBar: React.FC = () => {
  const { isAuthenticated, user } = useAuthService();
  const profileImage = user?.profile_image || placeholderProfileImage;

  // State to control NavDropdown visibility
  const [showDropdown, setShowDropdown] = useState(false);

  // Toggle the dropdown visibility on click
  const toggleDropdown = () => {
    setShowDropdown(prevState => !prevState);
  };

  // Close the dropdown when clicked outside or a link is clicked
  const closeDropdown = () => {
    setShowDropdown(false);
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
      <Container>
        <LinkContainer className="link-primary" to="/">
          <Navbar.Brand><img src={logo} alt="Mobi Sandals" height={50} width={50}/></Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer className="link-primary" to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            {isAuthenticated && (
              <LinkContainer className="link-primary" to="/categories">
                <Nav.Link>Categories</Nav.Link>
              </LinkContainer>
            )}  
            {!isAuthenticated && (
              <LinkContainer className="link-primary" to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
          {isAuthenticated && (
            <Nav className="ms-auto">
              <NavDropdown 
                title={<img src={profileImage} alt="Profile" height={30} width={30} style={{ borderRadius: '50%' }} />} 
                id="basic-nav-dropdown" 
                align="end"
                show={showDropdown}  // Controlled dropdown visibility
                onClick={toggleDropdown}  // Toggle on image click
                onMouseLeave={closeDropdown}  // Optionally close on mouse leave
              >
                <LinkContainer className="link-primary" to="/changepassword" onClick={closeDropdown}>
                  <NavDropdown.Item>Change Password</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer className="link-primary" to="/profile" onClick={closeDropdown}>
                  <NavDropdown.Item>Manage Profile</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer className="link-primary" to="/logout" onClick={closeDropdown}>
                  <NavDropdown.Item><Button variant="danger">Logout</Button></NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
