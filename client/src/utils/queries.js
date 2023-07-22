import { gql } from '@apollo/client';

export const QUERY_USER = gql`
query getMe {
  getMe {
    _id
    email
    username
    garden {
      commonName
      img
      plantId
    }
  }
}
`;
