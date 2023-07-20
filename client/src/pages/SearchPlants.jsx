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
      setSearchedBooks(plantData);
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
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Plants!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a plant'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedPlants.length
            ? `Viewing ${searchedPlants.length} results:`
            : 'Search for a plant to begin'}
        </h2>
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
    </>
  );
};

export default SearchPlants;
