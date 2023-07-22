import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

import { useQuery } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';
import { useMutation } from '@apollo/client';

import { REMOVE_PLANT } from '../utils/mutations';
import Auth from '../utils/auth';
import { removePlantId } from '../utils/localStorage';

const SavedPlants = () => {
	const [userData, setUserData] = useState({});
	const { loading, error, data, refetch } = useQuery(QUERY_USER);
	const [removePlant, { errorRemove }] = useMutation(REMOVE_PLANT);
	// use this to determine if `useEffect()` hook needs to run again
	const userDataLength = Object.keys(userData)?.length;

	useEffect(() => {
		const getUserData = async () => {
			try {
         
				const token = Auth.loggedIn() ? Auth.getToken() : null;

				if (!token) {
          console.log("logged out")
					return false;
				}
        if (data) {
          console.log(data)
				console.log(data.getMe?.garden);
        }

				if (!loading && data.getMe) {
					 setUserData(data.getMe);
				 console.log(userData);
				}
			} catch (err) {
				console.error(error);
				console.error(err);
			}
		};

		getUserData();
	}, [loading, userDataLength]);

	// create function that accepts the book's mongo _id value as param and deletes the book from the database
	const handleDeletePlant = async (plantId) => {
		const token = Auth.loggedIn() ? Auth.getToken() : null;

		if (!token) {
			return false;
		}

		try {
			const { data } = await removePlant({
				variables: { plantId: plantId },
			});
			if (errorRemove) {
				throw new Error('something went wrong!');
			}
			if (!data) {
				throw new Error('something went wrong!');
			}
			console.log(data.removePlant);
			// const updatedUser = await response.json();
			setUserData(data.removePlant);
			// upon success, remove Plant's id from localStorage
			removePlantId(plantId);
		} catch (err) {
			console.error(err);
		}
	};

	// if data isn't here yet, say so
	if (!data) {
		return <h2>LOADING...</h2>;
	}
	if (error) {
		return <h2>ERROR</h2>;
	}
setTimeout(() => {
  if (!loading){
    return (
      <>
        <div
          fluid
          className="text-light bg-dark p-5"
        >
          <Container>
            <h1>Viewing saved plants!</h1>
          </Container>
        </div>
        <Container>
          <h2 className="pt-5">
            {userData.garden.length
              ? `Viewing ${userData.garden.length} saved ${
                  userData.garden.length === 1 ? 'plant' : 'plants'
                }:`
              : 'You have no saved plants!'}
          </h2>
          <Row>
            {userData.garden.map((plant) => {
              return (
                <Col
                  key={plant.plantId}
                  md="4"
                >
                  <Card
                    key={plant.plantId}
                    border="dark"
                  >
                    {plant.img ? (
                      <Card.Img
                        src={plant.img}
                        alt={`The cover for ${plant.commonName}`}
                        variant="top"
                      />
                    ) : null}
                    <Card.Body>
                      <Card.Title>{plant.commonName}</Card.Title>
                      <p className="small">
                        Scientific Name: {plant?.scientificName}
                      </p>
                      <Card.Text>{plant?.watering}</Card.Text>
                      <Button
                        className="btn-block btn-danger"
                        onClick={() => handleDeletePlant(plant.plantId)}
                      >
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
}, 2000);
  
  }
	

export default SavedPlants;
