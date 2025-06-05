module.exports = {
    preset: 'ts-jest',
    // Указывает, в какой среде должны выполняться тесты
    testEnvironment: 'jsdom',
    // Указывает шаблоны файлов, которые Jest будет считать тестами
    testMatch: ['**/?(*.)+(spec|test).ts'],
    // Настройка псевдонимов путей
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
};
