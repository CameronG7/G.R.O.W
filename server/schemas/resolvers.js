const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    getMe: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id });
        return userData;
      }
      throw new AuthenticationError("Not logged in");
    },
    getGarden: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .populate("graden");
          return userData.garden;
      }
      throw new AuthenticationError("Not logged in");
    },
    getAllUsers: async () => {
      return User.find();
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const newUser = await User.create({ username, email, password });
      const token = signToken(newUser);
      return { token, newUser };
    },
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