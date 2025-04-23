// jest.config.js
export default {
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      // mocks all image imports (png, jpg, svg, etc.)
      '\\.(jpg|jpeg|png|svg)$': '<rootDir>/__mocks__/fileMock.js',
    },
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  };
  