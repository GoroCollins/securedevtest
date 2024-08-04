// vitestsetup.js
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import { JSDOM } from 'jsdom';

// Set up JSDOM
const dom = new JSDOM();
global.window = dom.window;
global.document = dom.window.document;
global.navigator = {
  userAgent: 'node.js',
};


// mocking Auth service
vi.mock('../frontend/src/components/Common/Auth.Service.jsx', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAuthService: vi.fn(() => ({
      isAuthenticated: true,
      user: { profile_image: 'test_image_url' },
    })),
  };
});
// Mock global variables if needed
vi.stubGlobal('document', global.document);
vi.stubGlobal('window', global.window);

afterEach(() => {
  cleanup()
});

