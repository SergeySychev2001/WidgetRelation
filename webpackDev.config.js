const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackConfig = require('./webpack.config');

module.exports = {
    ...webpackConfig,
    // Точка входа для Webpack, с которой начинается сборка проекта
    entry: './src/index.ts',
    plugins: [
        //  Плагин, который генерирует HTML-файл, вставляя в него автоматически все скомпилированные скрипты
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
    ],
    //Настройка dev сервера
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9000,
        hot: true
    },
    // Режим работы webpack
    mode: 'development'
};
