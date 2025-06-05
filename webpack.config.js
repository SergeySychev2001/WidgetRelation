const path = require('path');

module.exports = {
    resolve: {
        // Список расширений файлов, которые Webpack будет учитывать при разрешении импортов.
        extensions: ['.ts', '.js'],
        // Псевдонимы путей в проекте
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    optimization: {
        // Включает минимизацию (сжатие) кода в процессе сборки
        minimize: true,
    },
    module: {
        // Способы обработки файлов на основании расширения
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
};
