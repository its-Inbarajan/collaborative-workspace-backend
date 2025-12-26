import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    testMatch: ['**/*.spec.ts'],
    moduleFileExtensions: ["ts", "js"],
    clearMocks: true,
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    globalTeardown: '<rootDir>/tests/teardown.ts',
    maxWorkers: 1,
};

export default config;
