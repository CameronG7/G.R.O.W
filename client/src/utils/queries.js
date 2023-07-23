import { gql } from "@apollo/client";

export const QUERY_USER = gql`
  query getMe {
    getMe {
      username
      _id
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
`;
