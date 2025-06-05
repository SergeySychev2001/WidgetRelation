const path = require('path');
const webpackConfig = require('./webpack.config');

module.exports = {
    ...webpackConfig,
    // Точка входа для Webpack, с которой начинается сборка проекта
    entry: './src/index.ts',
    // Как и куда будет выводиться скомпилированный код после сборки.
    output: {
        filename: 'index.min.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
};
