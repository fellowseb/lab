const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = (apiUrl) => merge(common, {
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'FELLOWSEBLAB_API_URL': apiUrl
                ? apiUrl
                : JSON.stringify('https://api.lab.fellowseb.me')
        })
    ],
    devtool: 'source-map',
    mode: 'production',
    optimization: {
        minimize: true
    }
});
