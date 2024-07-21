import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import RoutesConfig from '../components/Common/RoutesConfig';
import HomePage from '../components/HomePage';
import Shoes from '../components/Shoes/Shoes';

describe('RoutesConfig', () => {
  test('renders HomePage component for index and / path', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <RoutesConfig />
      </MemoryRouter>
    );
    const homepagetext = screen.getByRole('heading', { name: /Welcome to Mobi Sandals/i });
    expect(homepagetext).toBeInTheDocument();
  });

//   test('renders Shoes component for /shoes path', () => {
//     render(
//       <MemoryRouter initialEntries={['/shoes']}>
//         <RoutesConfig />
//       </MemoryRouter>
//     );
//     const shoepagetext = screen.getByText(/List of Shoes/i);
//     expect(shoepagetext).toBeInTheDocument();
//   });
  it("should render properly", () => {
    render(<Shoes/>);
  });
});
