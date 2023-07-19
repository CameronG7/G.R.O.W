import { gql } from '@apollo/client';


export const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        _id
      }
    }
  }
  `;
  
  export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        username
      }
    }
  }`

export const SAVE_BOOK = gql`
 mutation saveBook($input: bookInput!) {
  saveBook(input: $input) {
    _id
    bookCount
    savedBooks {
      title
    }
  }
}`

export const REMOVE_BOOK = gql`
mutation removeBook($bookId: String!) {
  removeBook(bookId: $bookId) {
    username
    email
    bookCount
    savedBooks {
      title
    }
  }
}`