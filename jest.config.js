module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleNameMapper: {
        '^@api$': '<rootDir>/src/__mocks__/api.ts',
        '^@utils-types$': '<rootDir>/src/utils/types',
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    moduleDirectories: ['node_modules', 'src']
};
