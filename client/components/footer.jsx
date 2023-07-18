import React from 'react';
import { Link } from 'react-router';
import { Footer } from 'react-bootstrap';

function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <span className="text-muted">Place sticky footer content here.</span>
        </div>
      </footer>
    </>
  );
}

export default Footer;