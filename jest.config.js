module.exports = {
    roots: ['<rootDir>/test'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { /* Configurações do ts-jest aqui */ }],
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            diagnostics: false
        }
    },
    testTimeout: 30000, // Aumenta o timeout para 30 segundos
};
