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
    const plantToSave = searchedPlants.find((plant) => plant.plantId === plantId);

    const response = await fetch(
      `https://perenual.com/api/species/details/${plantId}?key=sk-XbST64bd5482645301649`
    );
    const newData = await response.json();

    plantToSave.waterFreqName = newData.watering_general_benchmark.unit;
    plantToSave.waterFreqValue = newData.watering_general_benchmark.value;
    plantToSave.description = newData.description;

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await savePlant({
        variables: { input: { ...plantToSave } },
      });

      if (!data) {
        throw new Error("Something went wrong!");
      }

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
          <Container>
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
            {searchedPlants.map((plant) => (
              <Col key={plant.plantId} md="4">
                <Card key={plant.plantId} border="dark">
                  {plant.img && (
                    <Card.Img
                      src={plant.img}
                      alt={`The cover for ${plant.commonName}`}
                      variant="top"
                    />
                  )}
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
            ))}
          </Row>
        </Container>
      </div>
    </>
  );
};

export default SearchPlants;