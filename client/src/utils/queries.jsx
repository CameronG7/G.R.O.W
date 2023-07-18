import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query currentUser {
  me {
    username
    _id
    email
    bookCount
    savedBooks {
      authors
      bookId
      description
      title
      image
      link
    }
   
  }
}
`;
