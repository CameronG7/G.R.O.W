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
    sunlight: String
  }

  input plantInput {
    plantId: Int!
    commonName: String
    scientificName: String
    img: String
    watering: String
    sunlight: String
    createdAt: String
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
    savePlant(input: plantInput): User
    removePlant(plantId: Int!): User
  }
`;

module.exports = typeDefs;
