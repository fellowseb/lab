const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = (apiUrl) => merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    },
    mode: 'development',
    optimization: {
        minimize: false
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            'FELLOWSEBLAB_API_URL': apiUrl
                ? apiUrl
                : JSON.stringify('https://api-dev.lab.fellowseb.me')
        })
    ]
});
