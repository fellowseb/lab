const path = require('path');

const config = {
    entry: ['babel-polyfill', path.resolve(__dirname, 'src/index.js')],
    output: {
        path: path.resolve(__dirname, 'dist/scripts'),
        filename: 'bundle.js',
        sourceMapFilename: 'bundle.map'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader'
            }
        ]
    }
};

module.exports = config;
