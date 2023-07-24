import React, { useState, useEffect } from "react";
import { Container, Col, Form, Button, Card, Row } from "react-bootstrap";

import Auth from "../utils/auth";
import { savePlantIds, getSavedPlantIds } from "../utils/localStorage";
import { useMutation } from "@apollo/client";
import { SAVE_PLANT } from "../utils/mutations";

const SearchPlants = () => {
  const [searchedPlants, setSearchedPlants] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [savedPlantIds, setSavedPlantIds] = useState(getSavedPlantIds());

  const [savePlant, { error }] = useMutation(SAVE_PLANT);

  useEffect(() => {
    return () => savePlantIds(savedPlantIds);
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await fetch(
        `https://perenual.com/api/species-list?key=sk-XbST64bd5482645301649&q=${searchInput}`
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const { data } = await response.json();

      const plantData = data.map((plant) => ({
        plantId: plant.id,
        commonName: plant.common_name,
        scientificName: plant.scientific_name[0],
        watering: plant.watering,
        sunlight: plant.sunlight[0],
        img: plant.default_image?.small_url || "",
        waterFreqName: "",
        waterFreqValue: "",
        description: "",
      }));

      setSearchedPlants(plantData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSavePlant = async (plantId) => {
    // find the book in `searchedBooks` state by the matching id
    const plantToSave = searchedPlants.find(
      (plant) => plant.plantId === plantId
    );
    console.log(plantToSave, "Save!");

    // Obtain extra data when plant is to be saved
    const response = await fetch(
      `https://perenual.com/api/species/details/${plantId}?key=sk-6j2P64bd54b27794e1650`
    );
    const newData = await response.json();

	// Adding new data to the plant object
	plantToSave.waterFreqName = newData.watering_general_benchmark.unit;
	plantToSave.waterFreqValue = newData.watering_general_benchmark.value;
	plantToSave.description = newData.description;

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

	console.log(plantToSave, "Plant to Save 2")
    try {
      const { data } = await savePlant({
        variables: { input: { ...plantToSave } },
      });

      if (!data) {
        throw new Error("something went wrong!");
      }
	  console.log(data, "DATA");

      setSavedPlantIds([...savedPlantIds, plantId]);
    } catch (err) {
      console.error(err);
    }
  };

  

  return (
    <>
      <div
        style={{
          minHeight: "100vh", // Set the minimum height to fill the whole viewport
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            backgroundColor: "#ad6044",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <h1>Search for your Plant!</h1>
          <Form
            onSubmit={handleFormSubmit}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a plant"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <Row>
{/*         
          {searchedPlants.sunlight ===  ? (
          <div class="alert alert-info" role="alert" style={{padding:'2px'}}>
            working on it! Please checkback later!
          </div> */}
          {/* ) : ( */}

          {/* CAMMMERRRRROOOONNNNNN this is what I got working that i think is fine. */}
          {searchedPlants.map((plant) => {
            if (
              plant.watering ===
              "Upgrade Plans To Premium/Supreme - https://perenual.com/subscription-api-pricing. I'm sorry"
            ) {
              return (
                <div className="alert alert-info" role="alert" key={plant.plantId}>
                  Sorry, not available at this time!
                </div>
              );
            } else {
              return (
                <Col key={plant.plantId} md="4">
                  <Card key={plant.plantId} border="dark">
                    {plant.img ? (
                      <Card.Img
                        src={plant.img}
                        alt={`The cover for ${plant.commonName}`}
                        variant="top"
                      />
                    ) : null}
                    <Card.Body>
                      <Card.Title>{plant.scientificName}</Card.Title>
                      <p className="small">Common Name: {plant.commonName}</p>
                      <p className="small">Description: {plant.description}</p>
                      <p className="small">Sunlight: {plant.sunlight}</p>
                      <p className="small">Watering: {plant.watering}</p>
                      {Auth.loggedIn() && (
                        <Button
                          disabled={savedPlantIds?.some(
                            (savedPlantId) => savedPlantId === plant.plantId
                          )}
                          className="btn-block btn-info"
                          onClick={() => handleSavePlant(plant.plantId)}
                        >
                          {savedPlantIds?.some(
                            (savedPlantId) => savedPlantId === plant.plantId
                          )
                            ? "This plant is in your Garden!"
                            : "Add to Garden"}
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              );
            }
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchPlants;
