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

  const plantCount = () => {
    let count = "";

    for (let i =0; i < userData.garden.length; i++) {
      count += "🪴";
    }

    return count;
  }

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
    return (
      <div>
        <h2
          style={{
            textAlign: "center",
            margin: "50px",
          }}
        >
          Growing your garden...
        </h2>
        <div class="d-flex justify-content-center">
          <div class="spinner-border" role="status"></div>
        </div>
      </div>
    );
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
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.garden.length ? `` : "Your garden is empty 🙁"}
        </h2>

        <h3 className="text-light">{userData.garden.length ? `Your garden is growing! Let's check out your plant count: ` : ""}</h3>
        <h3 style={{ marginBottom: "50px" }}>{plantCount()}</h3>
      </Container>

      {/* New Style Card */}
      {userData.garden.map((plant) => {
        return (
          <Row key={plant.plantId} md="4">
            <div className="card" id="plantCard">
              <div className="card-img-top align-items-center bg-light savedPlantCard">
                <div className="col-4">
                  <img
                    className="img"
                    src={plant.img}
                    alt={`Image for ${plant.commonName}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      padding: "20px",
                      borderRadius: "25px",
                    }}
                  ></img>
                </div>
                <div className="col-8">
                  <h1 id="savedText">{plant.commonName}</h1>
                  <h4
                    id="savedText"
                    style={{ fontFamily: "Times New Roman" }}
                  >
                    <i>{plant.scientificName}</i>
                  </h4>
                  <h6 id="savedMain">
                    <strong>Descirption: </strong>
                    {`${plant.description}`}
                  </h6>
                  <h6  id="savedMain">
                    <strong>Maintenance: </strong>
                    {`It is recommended to place this plant in ${plant.sunlight.toLowerCase()} light.`}
                  </h6>
                  <h6 id="savedMain">
                    <strong>Watering: </strong>
                  </h6>
                  <h6 id="savedMain">
                    {plant.waterFreqName !== null &&
                    plant.waterFreqValue !== null
                      ? `Water your ${plant.commonName} every ${
                          plant.waterFreqValue
                        } ${plant.waterFreqName.toLowerCase()}`
                      : `No incremental data`}
                  </h6>
                  <Button
                    className="btn btn-danger"
                    id="removePlantBtn"
                    onClick={() => handleDeletePlant(plant.plantId)}
                  >
                    Remove from Garden
                  </Button>
                </div>
              </div>
            </div>
          </Row>
        );
      })}
      <Button
        id="removeUserBtns"
        onClick={() => handleDeleteUser(userData._id)}
      >
        Delete Profile
      </Button>
    </>
  );
};

export default SavedPlants;
