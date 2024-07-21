import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from "react-router-bootstrap";
import { useAuthService } from '../Common/Auth.Service';
import logo from "../../assets/logo.jpeg";
import placeholderProfileImage from "../../assets/placeholder.png";
import { NavDropdown } from 'react-bootstrap';

export default function NavBar() {
  const { isAuthenticated, user } = useAuthService();
  const profileImage = user?.profile_image || placeholderProfileImage;

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
            {isAuthenticated && (<LinkContainer className="link-primary" to="/categories">
              <Nav.Link>Categories</Nav.Link>
            </LinkContainer>)}  
            <LinkContainer className="link-primary" to="/login">
              <Nav.Link>Login</Nav.Link>
            </LinkContainer>
          </Nav>
          {isAuthenticated && (
            <Nav className="ms-auto">
              <NavDropdown title={<img src={profileImage} alt="Profile" height={30} width={30} style={{ borderRadius: '50%' }} />} id="basic-nav-dropdown" align="end">
                <LinkContainer className="link-primary" to="/changepassword">
                  <NavDropdown.Item>Change Password</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer className='link-primary' to="/logout">
                  <NavDropdown.Item>Logout</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
