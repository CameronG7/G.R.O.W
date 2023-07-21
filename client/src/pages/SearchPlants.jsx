import React, { useState, useEffect } from 'react';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';

import Auth from '../utils/auth';

import { savePlantIds, getSavedPlantIds } from '../utils/localStorage';

import { useMutation } from '@apollo/client';
import { SAVE_PLANT } from '../utils/mutations'; //

import backgroundImage2 from '../assets/pexels-tom-swinnen-2249959.jpg';
import backgroundImage3 from '../assets/pexels-cottonbro-studio-5858235.jpg';
import backgroundImage4 from '../assets/pexels-teona-swift-6912806.jpg';



const SearchPlants = () => {
  
  // create state for holding returned google api data
  const [searchedPlants, setSearchedPlants] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved bookId values
  const [savedPlantIds, setSavedPlantIds] = useState(getSavedPlantIds());

  const [savePlant, { error }] = useMutation(SAVE_PLANT)

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => savePlantIds(savedPlantIds);
  });

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = fetch(`https://perenual.com/api/species-list?key=sk-MjnD64b5f8c806d741583&q=${searchInput}`)
      .then((response) => response.json())
      .then((data) => console.log(data));
      // if (!response.ok) {
      //   throw new Error('something went wrong!');
      // }
      console.log(response);
      const { items } = await response.json();
      console.log(items);
      const plantData = '';
      // const plantData = items.map((book) => ({
      //   bookId: book.id,
      //   authors: book.volumeInfo.authors || ['No author to display'],
      //   title: book.volumeInfo.title,
      //   description: book.volumeInfo.description,
      //   image: book.volumeInfo.imageLinks?.thumbnail || '',
      // }));
      setSearchedPlants(plantData);
      console.log(plantData)
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a book to our database
  const handleSavePlant = async (plantId) => {
    // find the book in `searchedBooks` state by the matching id
    const plantToSave = searchedPlants.find((plant) => plant.plantId === plantId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      
      const {data} = await savePlant({
        variables: { input: { ...plantToSave }} 
      });
      
      if (!data) {
        throw new Error('something went wrong!');
      }

      // if book successfully saves to user's account, save book id to state
      setSavedPlantIds([...savedPlantIds, plantId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div>
        <Container id='container' style={{ backgroundColor: '#ad6044', display: 'flex', justifyContent: 'center', alignItems: 'bottom', marginTop: '100px' }}>
          <h1>Search for your Plant!</h1>
          <Form onSubmit={handleFormSubmit} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search your Plant here!'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Plant Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <Row>
          {searchedPlants.map((plant) => {
            return (
              <Col key={plant.plantId} md="4">
                <Card key={plant.plantId} border='dark'>
                  {plant.image ? (
                    <Card.Img src={plant.image} alt={`The cover for ${plant.title}`} variant='top' />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{plant.title}</Card.Title>
                    <p className='small'>Authors: {plant.authors}</p>
                    <Card.Text>{plant.description}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedPlantIds?.some((savedPlantId) => savedPlantId === plant.plantId)}
                        className='btn-block btn-info'
                        onClick={() => handleSavePlant(plant.plantId)}>
                        {savedPlantIds?.some((savedPlantId) => savedPlantId === plant.plantId)
                          ? 'This plant has already been saved!'
                          : 'Save this shit!'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
      <Container className="main-content" style={{ 
        overflowY: 'auto', 
        maxHeight: '150vh',
        marginTop: '100px', 
        }}>
        <Row>
          <Col md={6}>
            <img src={backgroundImage2} alt="background" 
            style={{ 
              width: '100%', 
            height: '100%', 
            border: '6px solid black' }} />
          </Col>
          <Col md={6}>
            <img src={backgroundImage3} alt="background" 
            style={{ 
              width: '100%', 
            height: '100%', 
            border: '6px solid black' }} />
          </Col>
        </Row>
        <Row>
        <Col md={12} className="text-center mt-3">
  <img
    src={backgroundImage4}
    alt="Another background"
    style={{
      width: '100%',
      height: '50vh', // Set the height to 50% of the viewport height
      border: '6px solid black',
      objectFit: 'cover', // Maintain aspect ratio and crop as needed
    }}
  />
</Col>
  </Row>
      </Container>
    </>
  );
};

export default SearchPlants;
