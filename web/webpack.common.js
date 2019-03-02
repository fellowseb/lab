const path = require('path');
const Visualizer = require('webpack-visualizer-plugin');

const config = {
    entry: [path.resolve(__dirname, 'src/index.js')],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        sourceMapFilename: '[name].map'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new Visualizer({
            filename: '../build/statistics.html'
        })
    ],
};

module.exports = config;
