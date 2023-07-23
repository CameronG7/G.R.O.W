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
    plantId: Int
    commonName: String
    scientificName: String
    img: String
    watering: String
    description: String
    sunlight: String
    waterFreqName: String
    waterFreqValue: String
  }

  input PlantInput {
    plantId: Int!
    commonName: String
    scientificName: String
    img: String
    watering: String
    description: String
    sunlight: String
    waterFreqName: String
    waterFreqValue: String
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
    removeUser(_id: ID!): User
  }
`;

module.exports = typeDefs;
