import { gql } from "@apollo/client";

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
          waterFreqName
          waterFreqValue
          description
        }
      }
    }
  }
`;

export const SAVE_PLANT = gql`
  mutation savePlant($input: PlantInput!) {
    savePlant(input: $input) {
      _id
      username
      garden {
        commonName
        img
        description
        plantId
        scientificName
        sunlight
        watering
        waterFreqName
        waterFreqValue
       
      }
    }
  }
`;

export const REMOVE_PLANT = gql`
mutation removePlant($plantId: ID!) {
  removePlant(plantId: $plantId) {
    _id
    username
    garden {
      commonName
      img
      description
      plantId
      scientificName
      sunlight
      watering
      waterFreqName
      waterFreqValue
  }
  }
}
`;

export const REMOVE_USER = gql`
mutation removeUser($id: ID!) {
  removeUser(_id: $id) {
    username
  }
}
`;
