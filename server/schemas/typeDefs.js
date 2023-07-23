const { gql } = require("apollo-server-express");

// Define the typeDefs
const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    garden: [Plant]
  }

  type Plant {
    plantId: ID!
    commonName: String
    scientificName: String
    img: String
    watering: String
    sunlight: String
    waterFreqName: String
    waterFreqValue: String
    description: String
  }

  input PlantInput {
    plantId: String!
    commonName: String
    scientificName: String
    img: String
    watering: String
    sunlight: String
    waterFreqName: String
    waterFreqValue: String
    description: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    getMe: User
    getGarden: [Plant]
    getAllUsers: [User]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(username: String!, password: String!): Auth
    savePlant(input: PlantInput!): User
    removePlant(plantId: ID!): User
    removeUser(_id: ID!): Auth
  }
`;

module.exports = typeDefs;
