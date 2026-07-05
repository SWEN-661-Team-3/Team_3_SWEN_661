module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  collectCoverageFrom: [
    'main.js',
    'preload.js',
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/styles/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html', 'lcov', 'json', 'clover'],
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 80,
      functions: 60,
      lines: 85,
    },
  },
};
