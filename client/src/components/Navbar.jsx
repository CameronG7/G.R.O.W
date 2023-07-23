import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab, Button, NavDropdown } from 'react-bootstrap';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';

import Auth from '../utils/auth';

// Import your background image
import backgroundImage from '../assets/pexels-jonathan-borba-3263716.jpg';

const AppNavbar = () => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);

  // State for mobile dropdown menu
  const [showMenu, setShowMenu] = useState(false);

  // Function to handle toggle of mobile dropdown menu
  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      <Navbar
        bg='dark'
        variant='dark'
        expand='lg'
        style={{
          backgroundImage: `url(${backgroundImage})`, // Set the background image
          backgroundSize: 'cover',
          backgroundPosition: 'center', // Adjust the image size to cover the Navbar
        }}
      >
        <Container fluid>
          <Navbar.Brand as={Link} to='/' className="d-flex align-items-center">
            <span id='title' style={{ fontFamily: 'Indie Flower, cursive', fontSize: '80px', fontWeight: 'bolder', margin: '0' }}>
              GROW
            </span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbar' onClick={handleToggleMenu} />
          <Navbar.Collapse id='navbar' className={showMenu ? 'show' : ''}>
            <Nav className='ml-auto d-flex'>
              {/* Navbar links */}
              <Nav.Link as={Link} to='/' style={{ fontSize: '25px', color: 'black', fontWeight: 'bolder' }} className='ml-auto'>
                <Button>Home</Button>
              </Nav.Link>
              <Nav.Link as={Link} to='/search' style={{ fontSize: '25px', color: '#4WC7AF', fontWeight: 'bolder' }} className='ml-auto'>
                <Button>Search</Button>
              </Nav.Link>
              {/* if user is logged in show saved books and logout */}
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link as={Link} to='/saved' className='ml-auto'>
                    <Button>See Your Plants</Button>
                  </Nav.Link>
                  <Nav.Link onClick={Auth.logout} className='ml-auto'>
                    <Button>Logout</Button>
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link onClick={() => setShowModal(true)} className='ml-auto'>
                  <Button>Login</Button>
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* set modal data up */}
      <Modal
        size='lg'
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby='signup-modal'>
        {/* tab container to do either signup or login component */}
        <Tab.Container defaultActiveKey='login'>
          <Modal.Header closeButton>
            <Modal.Title id='signup-modal'>
              <Nav variant='pills'>
                <Nav.Item>
                  <Nav.Link eventKey='login'>Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey='signup'>Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey='login'>
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey='signup'>
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar;