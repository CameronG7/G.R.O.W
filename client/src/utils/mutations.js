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
 mutation savePlant($input: plantInput) {
  savePlant(input: $input) {
    _id
    email
    username
    garden {
      commonName
      img
      plantId
    }
  }
}`
// export const SAVE_PLANT = gql`
// mutation savePlant($plantId: Int, $commonName: String, $img: String) {
//  savePlant(plantId: $plantId, commonName: $commonName, img: $img) {
//    username
//  }

// }`

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
