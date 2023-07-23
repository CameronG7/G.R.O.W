import React, { useState, useEffect } from "react";
import { Container, Col, Form, Button, Card, Row } from "react-bootstrap";

import Auth from "../utils/auth";
import { savePlantIds, getSavedPlantIds } from "../utils/localStorage";
import { useMutation } from "@apollo/client";
import { SAVE_PLANT } from "../utils/mutations"; //

const SearchPlants = () => {
  // create state for holding returned perenual api data
  const [searchedPlants, setSearchedPlants] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");
  // create state to hold saved plantId values
  const [savedPlantIds, setSavedPlantIds] = useState(getSavedPlantIds());

  const [savePlant, { error }] = useMutation(SAVE_PLANT);

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
      //grab api from perenual
      const response = await fetch(
        `https://perenual.com/api/species-list?key=sk-MjnD64b5f8c806d741583&q=${searchInput}`
      );

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { data } = await response.json();
      console.log(data, "Nice");
      console.log(data[0].id);

      const plantData = data.map((plant) => ({
        plantId: plant.id.toString(),
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

  // create function to handle saving a book to our database
  const handleSavePlant = async (plantId) => {
    // find the book in `searchedBooks` state by the matching id
    const plantToSave = searchedPlants.find(
      (plant) => plant.plantId === plantId
    );
    console.log(plantToSave, "Save!");

    // Obtain extra data when plant is to be saved
    const response = await fetch(
      `https://perenual.com/api/species/details/${plantId}?key=sk-MjnD64b5f8c806d741583`
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

      // if book successfully saves to user's account, save book id to state
      setSavedPlantIds([...savedPlantIds, plantId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div>
        <Container
          id="container"
          style={{
            backgroundColor: "#ad6044",
            display: "flex",
            justifyContent: "center",
            alignItems: "bottom",
            marginTop: "100px",
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
                  Submit Search
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
                <Card key={plant.plantId} border="dark">
                  {plant.img ? (
                    <Card.Img
                      src={plant.img}
                      alt={`The cover for ${plant.commonName}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{plant.commonName}</Card.Title>
                    <p className="small">Authors: {plant.authors}</p>
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
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchPlants;
