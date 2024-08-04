import React from 'react';
import { prettyDOM, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from '../components/Common/Navbar';
import logo from '../assets/logo.jpeg';

describe('NavBar', () => {
  test('renders navbar with a logo', () => {
    render(
      <Router>
        <NavBar />
      </Router>
    );

    console.log(prettyDOM(document.body));

    const logoElement = screen.getByAltText("Mobi Sandals");
    expect(logoElement).toBeInTheDocument();
    expect(logoElement).toHaveAttribute('src', logo);
    expect(logoElement).toHaveAttribute('height', '50');
    expect(logoElement).toHaveAttribute('width', '50');
  });

  // test('navigates to home page when home link is clicked', () => {
  //   render(
  //     <Router>
  //       <NavBar />
  //     </Router>
  //   );
  //   const homeLink = screen.getByText("Home");
  //   userEvent.click(homeLink);
  //   expect(window.location.pathname).toBe('/');
  // });
  test('navigates to home page when home link is clicked', () => {
    render(
      <Router>
        <NavBar />
      </Router>
    );
    const homeLink = screen.getByText((content, element) => content === 'Home' && element.tagName.toLowerCase() === 'a');
    userEvent.click(homeLink);
    expect(window.location.pathname).toBe('/');
  });
});
