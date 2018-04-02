const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'FELLOWSEBLAB_API_URL': JSON.stringify('https://szkg4s33n0.execute-api.eu-west-1.amazonaws.com/prod')
        })
    ],
    devtool: 'source-map',
    mode: 'production',
    optimization: {
        minimize: true
    }
});
