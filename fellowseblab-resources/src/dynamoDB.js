'use strict';

var AWS = require('aws-sdk'),
    offlineOptions = {
        region: "localhost",
        endpoint: "http://localhost:8000"
    };

var isOffline = () => process.env.IS_OFFLINE

module.exports = {
    docClient(options) {
        return isOffline()
            ? new AWS.DynamoDB.DocumentClient(Object.assign({}, options, offlineOptions))
            : new AWS.DynamoDB.DocumentClient(options)
    },
    rawClient(options) {
        return isOffline()
            ? new AWS.DynamoDB(Object.assign({}, options, offlineOptions))
            : new AWS.DynamoDB(options)
    }
};
