import { gql } from '@apollo/client';

export const QUERY_USER = gql`
query GetMe {
  getMe {
    _id
    email
    username
    garden {
      commonName
    }
  }
}
`;
