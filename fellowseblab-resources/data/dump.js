'use strict';

const AWS = require('aws-sdk');
var Readable = require('stream').Readable;

const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'eu-west-1'
});

let scanParams = {
    "TableName": "fellowseb-lab-resourceTags"
};
// dynamoDb.scan(scanParams, (error, response) => {
//     if (error) {
//         console.error(error);
//         return;
//     }
//     AWS.DynamoDB.Converter.unmarshall(response);
// });
let rawData = await dynamoDb.scan(scanParams).promise()
var s = new Readable();
s.push(JSON.stringify(rawData.Items));
s.push(null);
s.pipe(process.stdout)