import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import { useQuery } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';
import { useMutation } from '@apollo/client';

import { REMOVE_PLANT } from '../utils/mutations';
import Auth from '../utils/auth';
import { removePlantId } from '../utils/localStorage';

const SavedPlants = () => {
  const [userData, setUserData] = useState({});
  const {loading, error, data} = useQuery(QUERY_USER);
  const [removePlant, { errorRemove }] = useMutation(REMOVE_PLANT)
  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData)?.length;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
          return false;
        }
        console.log(data)
        
        
        if (!loading) {
          setUserData(data.me);
        }
       
      } catch (err) {
        console.error(error);
        console.error(err);
      }
    };

    getUserData();
  }, [loading, data]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeletePlant = async (plantId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const{data} = await removePlant({
        variables: {plantId: plantId}
      })
      if (errorRemove){
        throw new Error('something went wrong!');
      }
      if (!data) {
        throw new Error('something went wrong!');
      }
      console.log(data.removeBook)
      // const updatedUser = await response.json();
      setUserData(data.removeBook);
      // upon success, remove book's id from localStorage
      removePlantId(plantId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }
  if (error) {
    return <h2>ERROR</h2>
  }
  
  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved plants!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.garden.length
            ? `Viewing ${<userData className="garden"></userData>.length} saved ${userData.savedPlants.length === 1 ? 'plant' : 'plants'}:`
            : 'You have no saved plants!'}
        </h2>
        <Row>
          {userData.garden.map((plant) => {
            return (
              <Col key={plant.plantId} md="4">
                <Card key={plant.plantId} border='dark'>
                  {plant.image ? <Card.Img src={plant.image} alt={`The cover for ${plant.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{plant.commonName}</Card.Title>
                    <p className='small'>Scientific Name: {plant.scientificName}</p>
                    <Card.Text>{plant.watering}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeletePlant(plant.planId)}>
                      Delete this Plant!
                    </Button>
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

export default SavedPlants;
