module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
    },
  },
  preset: 'react-native',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      { isolatedModules: true, useESM: true, tsconfig: 'tsconfig.json' },
    ],
  },
  modulePathIgnorePatterns: [
    '<rootDir>/example/node_modules',
    '<rootDir>/lib/',
  ],
};
