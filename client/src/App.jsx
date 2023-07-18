import React, { useState } from 'react';
import './App.css';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Navbar from './components/Navbar';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

function App() {
  const [count, setCount] = useState(0);

  return (
    
      <div>
        <div>
          <Navbar />
        </div>
      </div>
    
  );
}

export default App;
