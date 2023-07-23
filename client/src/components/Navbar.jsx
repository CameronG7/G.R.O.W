import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab, Button } from 'react-bootstrap';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';

import Auth from '../utils/auth';

// Import your background image
import backgroundImage from '../assets/pexels-jonathan-borba-3263716.jpg';

const AppNavbar = () => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Navbar
        bg='dark'
        variant='dark'
        expand='lg'
        style={{
          // border: '6px solid rgb(198,110,78)',
          backgroundImage: `url(${backgroundImage})`, // Set the background image
          backgroundSize: 'cover',
          backgroundPosition: 'center', // Adjust the image size to cover the Navbar
        }}
      >
        {/* Add 'border' style to create a black border around the navbar and set the background color */}
        <Container fluid>
          <Navbar.Brand as={Link} to='/' className="d-flex align-items-center">
            <span id='title' style={{ fontFamily: 'Indie Flower, cursive', fontSize: '80px', fontWeight: 'bolder', margin: '0' }}>
              GROW
            </span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbar' />
          <Navbar.Collapse id='navbar' className='d-flex flex-row-reverse'>
            <Nav className='ml-auto d-flex'>
              <Nav.Link as={Link} to='/' style={{ fontSize: '25px', color: 'black', fontWeight: 'bolder'}} className='' >
                <Button >Home</Button>
              </Nav.Link>
              <Nav.Link as={Link} to='/search' style={{ fontSize: '25px', color: '#4WC7AF', fontWeight: 'bolder'}} >
                <Button>Search</Button>
              </Nav.Link>
              {/* if user is logged in show saved books and logout */}
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link as={Link} to='/saved' >
                    <Button>See Your Plants</Button>
                  </Nav.Link>
                  <Nav.Link onClick={Auth.logout} > <Button>Logout</Button></Nav.Link>
                </>
              ) : (
                <Nav.Link onClick={() => setShowModal(true)}  ><Button>Login</Button></Nav.Link>
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
