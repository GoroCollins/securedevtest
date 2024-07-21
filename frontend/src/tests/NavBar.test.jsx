import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from '../components/Common/NavBar';
import logo from '../assets/logo.jpeg'; // Import the logo image

describe('NavBar', () => {
  test('renders navbar with a logo', () => {
    render(
      <Router>
        <NavBar />
      </Router>
    );

    // Check for brand name
    // const brandElement = screen.getByText('/Home/i');
    // expect(brandElement).toBeInTheDocument();

    // Check for logo image
    const logoElement = screen.getByAltText('Mobi Sandals');
    expect(logoElement).toBeInTheDocument();
    expect(logoElement).toHaveAttribute('src', logo); // Check src attribute matches imported logo
    expect(logoElement).toHaveAttribute('height', '50');
    expect(logoElement).toHaveAttribute('width', '50');
  });

  test('navigates to home page when home link is clicked', () => {
    render(
      <Router>
        <NavBar />
      </Router>
    );
    const homeLink = screen.getByText('Home');
    userEvent.click(homeLink);
    expect(window.location.pathname).toBe('/');
  });

  // Add more tests as needed for other functionalities
});
