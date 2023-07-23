import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { QUERY_USER } from "../utils/queries";
import { useMutation } from "@apollo/client";
import { REMOVE_PLANT, REMOVE_USER } from "../utils/mutations";
import Auth from "../utils/auth";
import { removePlantId } from "../utils/localStorage";

const SavedPlants = () => {
  const [userData, setUserData] = useState({});
  const { loading, error, data } = useQuery(QUERY_USER);
  const [removePlant, { errorPlantRemove }] = useMutation(REMOVE_PLANT, {
    // The update method allows us to access and update the local cache
    update(cache, { data: { removePlant } }) {
      try {
        // First we retrieve existing profile data that is stored in the cache under the `QUERY_PROFILES` query
        // Could potentially not exist yet, so wrap in a try/catch
        const { getMe } = cache.readQuery({ query: QUERY_USER });
        console.log(getMe, "GET ME");

        // Then we update the cache by combining existing profile data with the newly created data returned from the mutation
        cache.writeQuery({
          query: QUERY_USER,
          // If we want new data to show up before or after existing data, adjust the order of this array
          data: { getMe: removePlant },
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  const [removeUser, { errorUserRemove }] = useMutation(REMOVE_USER);

  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData)?.length;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
          console.log("logged out");
          return false;
        }

        console.log(data, "First Data");

        if (!loading) {
          setUserData(data.getMe);
        }

        console.log(userData, "User Data 111111");
      } catch (err) {
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
      const { data } = await removePlant({
        variables: { plantId },
      });
      console.log(data, "DATA");
      if (!data) {
        throw new Error("something went wrong!");
      }

      // remove plant's id from localStorage
      removePlantId(plantId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    console.log(userId, "USER ID");

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeUser({
        variables: { userId },
      });

      if (!data) {
        throw new Error("something went wrong!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, set screen to loading
  if (!userDataLength) {
    return <h2>Growing your garden...</h2>;
  }
  if (error) {
    return <h2>Error</h2>;
  }

  console.log(userData.garden);

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h2>{`Welcome back ${userData.username}!`}</h2>
          <h4 style={{ marginTop: "20px" }}>Let's check out your garden</h4>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.garden.length ? `` : "Your garden is empty 🙁"}
        </h2>

        <h3 style={{ marginBottom: "50px" }}>
          {userData.garden.length > 0
            ? userData.garden.length === 1
              ? `Amazing, you have ${userData.garden.length} plant in your garden!`
              : `Amazing, you have ${userData.garden.length} plants in your garden!`
            : ``}
        </h3>
      </Container>

      {/* New Style Card */}
      <Container>
        <Row xs={1} md={2} lg={3} className="g-4">
          {userData.garden.map((plant) => (
            <Col key={plant.plantId}>
              <Card className="h-100">
                {plant.img && (
                  <Card.Img
                    variant="top"
                    src={plant.img}
                    alt={`Image for ${plant.commonName}`}
                    style={{ width: "300px", height: "300px", borderRadius: "25px" }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{plant.commonName}</Card.Title>
                  <Card.Text>
                    <i>{plant.scientificName}</i>
                  </Card.Text>
                  <Card.Text>{`Recommended watering: ${plant.watering}`}</Card.Text>
                  <Card.Text>{`Recommended sunlight: ${plant.sunlight}`}</Card.Text>
                  <Card.Text>{`${plant.description}`}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeletePlant(plant.plantId)}
                  >
                    Remove from Garden
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <Button
        className="btn-block btn-danger"
        style={{ margin: "20px", width: "300px" }}
        onClick={() => handleDeleteUser(userData._id)}
      >
        Delete Profile
      </Button>
    </>
  );
};

export default SavedPlants;