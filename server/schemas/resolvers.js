const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

// Defining resolvers for User and Plant
const resolvers = {
  Query: {
    // Get the user that is signed in
    getMe: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id });
        return userData;
      }
      throw new AuthenticationError("Not logged in");
    },

    // Get the garden of the user that is signed in
    getGarden: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .populate("graden");
          return userData.garden;
      }
      throw new AuthenticationError("Not logged in");
    },

    // Get all users (for testing)
    getAllUsers: async () => {
      return User.find();
    },
  },
  Mutation: {
    // Add a new user
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    // Login a user
    login: async (parent, { username, password }) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw new AuthenticationError(
          "No profile with this username has been found"
        );
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect password!");
      }

      const token = signToken(user);
      return { token, user };
    },

    // Save a plant to the user's garden
    savePlant: async (parent, { input }, context) => {
      if (context.user) {
        const updatedPlant = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { garden: input } },
          { new: true, runValidators: true }
        );

        return updatedPlant;
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    // Remove a plant from the user's garden
    removePlant: async (parent, { plantId }, context) => {
      if (context.user) {
        const updatedPlant = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { garden: { plantId } } },
          { new: true }
        );

        return updatedPlant;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;