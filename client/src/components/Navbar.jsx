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
  const [showDrop, setShowDrop] = useState(false);

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
        collapseOnSelect
      >
        {/* Add 'border' style to create a black border around the navbar and set the background color */}
        <Container>
          <Navbar.Brand as={Link} to='/' className="d-flex align-items-center">
            <span id='title' style={{ fontFamily: 'Indie Flower, cursive', fontSize: '80px', fontWeight: 'bolder', margin: '0' }}>
              GROW
            </span>
          </Navbar.Brand>
          <Navbar.Toggle id='navDrop' as={Button} aria-controls='basic-navbar-nav' >
          <svg height="32px" id="Layer_1" fill='#F3E9D2' version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"/></svg>
          </Navbar.Toggle>
          <Navbar.Collapse id='basic-navbar-nav' className='flex flex-row-reverse'>
            <Nav className='ml-auto d-flex'>
              <Nav.Link as={Link} eventKey='0' to='/'  >
                <Button >Home</Button>
              </Nav.Link>
              <Nav.Link as={Link} eventKey='1' to='/search'  >
                <Button>Search</Button>
              </Nav.Link>
              {/* if user is logged in show saved books and logout */}
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link as={Link} eventKey='2' to='/saved' >
                    <Button>See Your Plants</Button>
                  </Nav.Link>
                  <Nav.Link eventKey='3' onClick={Auth.logout} > <Button>Logout</Button></Nav.Link>
                </>
              ) : (
                <Nav.Link eventKey='4' onClick={() => setShowModal(true)}  ><Button>Login</Button></Nav.Link>
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
