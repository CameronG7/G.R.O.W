import { gql } from '@apollo/client';

export const GET_ME = gql`
    query me {
        _id 
        username
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
`;