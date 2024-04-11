const isCI = process.env.CI && (typeof process.env.CI !== 'string' || process.env.CI.toLowerCase() === 'true');

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    noStackTrace: true,
    coverageReporters: isCI ? ['clover', 'json', 'lcovonly', 'cobertura'] : ['html', 'text'],
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.[jt]s',
    ],
    setupFilesAfterEnv: [
        '<rootDir>/test/jest.setup.ts',
    ],
};