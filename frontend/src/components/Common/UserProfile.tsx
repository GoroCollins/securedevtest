import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const UserProfile: React.FC = () => {
  return (
    <>
      <h1>User Details</h1>
      <Link to="/changepassword"><Button>Change Password</Button></Link>
      <Link to="/logout"><Button>Logout</Button></Link>
    </>
  );
};

export default UserProfile;
