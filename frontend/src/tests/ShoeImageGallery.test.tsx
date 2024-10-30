import { render, screen, fireEvent } from '@testing-library/react';
import ShoeImagesGallery from '../components/Shoes/ShoeImageGallery';

const mockImages = [
  { image: 'shoe1.jpg' },
  { image: 'shoe2.jpg' },
  { image: 'shoe3.jpg' },
];

describe('ShoeImagesGallery', () => {
  it('renders the first image initially', () => {
    render(<ShoeImagesGallery images={mockImages} />);
    
    // Check that the first image is displayed
    const displayedImage = screen.getByAltText('Shoe 0');
    expect(displayedImage).toHaveAttribute('src', 'shoe1.jpg');
  });

  it('navigates to the next image when the "Next" button is clicked', () => {
    render(<ShoeImagesGallery images={mockImages} />);

    // Click the next button
    fireEvent.click(screen.getByText('→'));

    // Check that the second image is displayed
    const displayedImage = screen.getByAltText('Shoe 1');
    expect(displayedImage).toHaveAttribute('src', 'shoe2.jpg');
  });

  it('navigates to the previous image when the "Previous" button is clicked', () => {
    render(<ShoeImagesGallery images={mockImages} />);

    // Move forward and then back to test navigation
    fireEvent.click(screen.getByText('→'));
    fireEvent.click(screen.getByText('←'));

    // Check that the first image is displayed again
    const displayedImage = screen.getByAltText('Shoe 0');
    expect(displayedImage).toHaveAttribute('src', 'shoe1.jpg');
  });

  it('wraps around to the last image when "Previous" is clicked on the first image', () => {
    render(<ShoeImagesGallery images={mockImages} />);

    // Click the previous button while on the first image
    fireEvent.click(screen.getByText('←'));

    // Check that the last image is displayed
    const displayedImage = screen.getByAltText('Shoe 2');
    expect(displayedImage).toHaveAttribute('src', 'shoe3.jpg');
  });

  it('wraps around to the first image when "Next" is clicked on the last image', () => {
    render(<ShoeImagesGallery images={mockImages} />);

    // Move to the last image
    fireEvent.click(screen.getByText('→'));
    fireEvent.click(screen.getByText('→'));

    // Click next on the last image
    fireEvent.click(screen.getByText('→'));

    // Check that the first image is displayed again
    const displayedImage = screen.getByAltText('Shoe 0');
    expect(displayedImage).toHaveAttribute('src', 'shoe1.jpg');
  });
});
