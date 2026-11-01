const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './index.js', // Главный JS-файл в корне проекта
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true, // Очищает папку dist перед каждой новой сборкой
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'], // Обработка стилей
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html', // HTML-шаблон в корне проекта
        }),
        // Если нужно копировать статические файлы (например, картинки):
        // new CopyWebpackPlugin({
        //   patterns: [{ from: 'public', to: '' }],
        // }),
    ],
    devServer: {
        static: './dist',
        open: true, // Автоматически открывать браузер при запуске
        port: 8080,
        hot: true,
    },
    mode: 'development',
};