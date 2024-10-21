import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock FontAwesomeIcon to avoid rendering issues during the test
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span>Icon</span>,
}));

describe('Footer Component', () => {
  test('renders contact information', () => {
    render(<Footer />);

    // Check if the email and phone number are rendered
    expect(screen.getByText('test@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('+254713396454')).toBeInTheDocument();
  });

  test('renders social media links', () => {
    render(<Footer />);

    // Check if social media icons are rendered with correct labels
    const facebookLink = screen.getByLabelText('Facebook');
    const instagramLink = screen.getByLabelText('Instagram');
    const tiktokLink = screen.getByLabelText('TikTok');

    expect(facebookLink).toBeInTheDocument();
    expect(facebookLink).toHaveAttribute('href', 'https://www.facebook.com/share/C71Rpxx6wMNoAFWP/?mibextid=qi2Omg');

    expect(instagramLink).toBeInTheDocument();
    expect(instagramLink).toHaveAttribute('href', 'https://www.instagram.com/mobi_sandals/?igsh=bXF6ZmF4c25jcTJw');

    expect(tiktokLink).toBeInTheDocument();
    expect(tiktokLink).toHaveAttribute('href', 'https://www.tiktok.com/@mobi_handmade_sandals?_t=8nAaOLWe73F&_r=1');
  });
});
