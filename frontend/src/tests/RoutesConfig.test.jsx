import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, test, expect } from 'vitest';
// import '@testing-library/jest-dom';
import RoutesConfig from '../components/Common/RoutesConfig';
import HomePage from '../components/HomePage';
import Shoes from '../components/Shoes/Shoes';
import ShoeDetail from '../components/Shoes/ShoeDetail';
import AddShoe from '../components/Shoes/AddShoe';
import EditShoe from '../components/Shoes/EditShoe';
import AddCategory from '../components/Categories/AddCategory';
import EditCategory from '../components/Categories/EditCategory';
import Categories from '../components/Categories/Categories';
import CategoryDetails from '../components/Categories/CategoryDetails';
import Contact from '../components/Contact';
import Login from '../components/Common/Login';
import ChangePassword from '../components/Common/ChangePassword';
import Logout from '../components/Common/Logout';
import { ProtectedRoute } from '../components/Common/ProtectedRoutes';
import { AuthProvider } from '../components/Common/Auth.Service';
import UserProfile from '../components/Common/UserProfile';

// Mock the components
vi.mock('../components/HomePage', () => ({ default: () => <div>HomePage</div> }));
vi.mock('../components/Shoes/Shoes', () => ({ default: () => <div>Shoes</div> }));
vi.mock('../components/Shoes/ShoeDetail', () => ({ default: () => <div>ShoeDetail</div> }));
vi.mock('../components/Shoes/AddShoe', () => ({ default: () => <div>AddShoe</div> }));
vi.mock('../components/Shoes/EditShoe', () => ({ default: () => <div>EditShoe</div> }));
vi.mock('../components/Categories/AddCategory', () => ({ default: () => <div>AddCategory</div> }));
vi.mock('../components/Categories/EditCategory', () => ({ default: () => <div>EditCategory</div> }));
vi.mock('../components/Categories/Categories', () => ({ default: () => <div>Categories</div> }));
vi.mock('../components/Categories/CategoryDetails', () => ({ default: () => <div>CategoryDetails</div> }));
vi.mock('../components/Contact', () => ({ default: () => <div>Contact</div> }));
vi.mock('../components/Common/Login', () => ({ default: () => <div>Login</div> }));
vi.mock('../components/Common/ChangePassword', () => ({ default: () => <div>ChangePassword</div> }));
vi.mock('../components/Common/Logout', () => ({ default: () => <div>Logout</div> }));
vi.mock('../components/Common/UserProfile', () => ({ default: () => <div>UserProfile</div> }));

// Mock the ProtectedRoute to always render the children
vi.mock('../components/Common/ProtectedRoutes', () => ({
  ProtectedRoute: ({ children }) => <>{children}</>,
}));

describe('RoutesConfig', () => {
  const renderWithRouter = (route) => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <AuthProvider>
          <RoutesConfig />
        </AuthProvider>
      </MemoryRouter>
    );
  };

  test('renders HomePage on default route', () => {
    renderWithRouter('/');
    expect(screen.getByText('HomePage')).toBeInTheDocument();
  });

  test('renders Shoes on /shoes route', () => {
    renderWithRouter('/shoes');
    expect(screen.getByText('Shoes')).toBeInTheDocument();
  });

  test('renders ShoeDetail on /shoe/:id route', () => {
    renderWithRouter('/shoe/1');
    expect(screen.getByText('ShoeDetail')).toBeInTheDocument();
  });

  test('renders Contact on /contact route', () => {
    renderWithRouter('/contact');
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('renders Login on /login route', () => {
    renderWithRouter('/login');
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('renders ChangePassword on /changepassword route', () => {
    renderWithRouter('/changepassword');
    expect(screen.getByText('ChangePassword')).toBeInTheDocument();
  });

  test('renders Logout on /logout route', () => {
    renderWithRouter('/logout');
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('renders AddShoe on /add-shoe route', () => {
    renderWithRouter('/add-shoe');
    expect(screen.getByText('AddShoe')).toBeInTheDocument();
  });

  test('renders EditShoe on /edit-shoe/:id route', () => {
    renderWithRouter('/edit-shoe/1');
    expect(screen.getByText('EditShoe')).toBeInTheDocument();
  });

  test('renders AddCategory on /add-category route', () => {
    renderWithRouter('/add-category');
    expect(screen.getByText('AddCategory')).toBeInTheDocument();
  });

  test('renders EditCategory on /edit-category/:id route', () => {
    renderWithRouter('/edit-category/1');
    expect(screen.getByText('EditCategory')).toBeInTheDocument();
  });

  test('renders Categories on /categories route', () => {
    renderWithRouter('/categories');
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });

  test('renders CategoryDetails on /category/:id route', () => {
    renderWithRouter('/category/1');
    expect(screen.getByText('CategoryDetails')).toBeInTheDocument();
  });

  test('renders UserProfile on /profile route', () => {
    renderWithRouter('/profile');
    expect(screen.getByText('UserProfile')).toBeInTheDocument();
  });
});
