const { Schema } = require('mongoose');

// Defining the Plant schema
const plantSchema = new Schema({
  plantId: {
    type: String, 
    required: true,
  }, 
  commonName: {
    type: String, 
  }, 
  scientificName: {
    type: String,
  }, 
  img: {
    type: String,
  }, 
  watering: {
    type: String,
  }, 
  sunlight: {
    type: String,
  },
});

module.exports = plantSchema;
