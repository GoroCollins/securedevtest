// Import necessary modules for testing
import { getCsrfToken } from './Auth.Service';

describe('getCsrfToken', () => {
  it('should return the CSRF token value if it exists in the document cookie', () => {
    // Mock document.cookie to contain the CSRF token
    Object.defineProperty(document, 'cookie', {
      value: 'csrftoken=mockCsrfToken; otherCookie=otherValue',
      writable: true
    });

    // Call the function and expect it to return the CSRF token value
    expect(getCsrfToken()).toBe('mockCsrfToken');
  });

  it('should return null if the CSRF token does not exist in the document cookie', () => {
    // Mock document.cookie to not contain the CSRF token
    Object.defineProperty(document, 'cookie', {
      value: 'otherCookie=otherValue',
      writable: true
    });

    // Call the function and expect it to return null
    expect(getCsrfToken()).toBeNull();
  });
});