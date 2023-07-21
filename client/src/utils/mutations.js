import { gql } from '@apollo/client';


export const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
  `;
  
export const ADD_USER = gql`
mutation AddUser($username: String!, $email: String!, $password: String!) {
  addUser(username: $username, email: $email, password: $password) {
    token
    user {
      _id
      email
      garden {
        commonName
        img
        plantId
        scientificName
        sunlight
        watering
      }
    }
  }
}`;

export const SAVE_PLANT = gql`
 mutation savePlant($input: plantInput!) {
  savePlant(input: $input) {
    _id
    plantCount
    garden {
      plantId
      commonName
      scientificName
      img
      watering
      sunlight
    }
  }
}`

export const REMOVE_PLANT = gql`
mutation removePlant($plantId: String!) {
  removePlant(plantId: $plantId) {
    plantCount
    savedPlants {
      plantId
      commonName
      scientificName
      img
      watering
      sunlight
    }
  }
}`
