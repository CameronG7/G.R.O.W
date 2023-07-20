import React, { useState, useEffect } from 'react';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';

import Auth from '../utils/auth';
import { searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';

import backgroundImage2 from '../assets/pexels-tom-swinnen-2249959.jpg';
import backgroundImage3 from '../assets/pexels-cottonbro-studio-5858235.jpg';


const SearchBooks = () => {
  
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  const [saveBook, { error }] = useMutation(SAVE_BOOK)

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
      }));

      setSearchedBooks(bookData);
      console.log(bookData)
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
    // find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      
      const {data} = await saveBook({
        variables: { input: { ...bookToSave }} 
      });
      
      if (!data) {
        throw new Error('something went wrong!');
      }

      // if book successfully saves to user's account, save book id to state
      setSavedBookIds([...savedBookIds, bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5" style={{ backgroundColor: '177A67' }}>
        <Container id='container' style={{ backgroundColor: 'gray' }}>
          <h1>Search for your Plant!</h1>
          <Form onSubmit={handleFormSubmit} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Plant Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h1 className='pt-5' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'cursive', fontWeight: 'bolder'}}>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search your Plant!'}
        </h1>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col key={book.bookId} md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? (
                    <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                        className='btn-block btn-info'
                        onClick={() => handleSaveBook(book.bookId)}>
                        {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                          ? 'This book has already been saved!'
                          : 'Save this Plant!'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
      <Container className="mt-5">
        <Row>
          <Col md={6}>
            <img src={backgroundImage2} alt="background" style={{ width: '100%', height: '100%' }} />
          </Col>
          <Col md={6}>
            <img src={backgroundImage3} alt="background" style={{ width: '100%', height: '100%' }} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;
