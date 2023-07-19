import React from 'react';
import {
  MDBFooter,
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn
} from 'mdb-react-ui-kit';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Add a wrapper div to ensure the content is pushed down */}
      <MDBContainer>
        {/* Your main content here */}
      </MDBContainer>

      <MDBFooter className='text-center text-white' style={{ backgroundColor: '#177A67', position: 'absolute', bottom: 0, width: '100%' }}>
        <MDBContainer className='p-4 pb-0'>
          <section className=''>
            <p className='d-flex justify-content-center align-items-center'>
              <span className='me-3'>Register for free</span>
              <MDBBtn type='button' outline color="light" rounded>
                Sign up!
              </MDBBtn>
            </p>
          </section>
        </MDBContainer>

        <div className='text-center p-3' style={{ backgroundColor: '#177A67' }}>
          © 2023 Copyright:
          <a className='text-white' href='https://mdbootstrap.com/'>
            Grow.com
          </a>
        </div>
      </MDBFooter>
    </div>
  );
}
