'use strict';

const dynamoDb = require('./dynamoDB.js');

function buildResponse(integrationResponse) {
    var response = {
        "tags": Object.keys(integrationResponse.Items).map(key => integrationResponse.Items[key]),
        "totalCount": integrationResponse.ScannedCount,
        "filteredCount": integrationResponse.Count
    };
    return response;
};

module.exports.listResourceTags = (event, context, callback) => {
    let scanParams = {
        "TableName": `fellowseb-lab-${process.env.STAGE}-resourceTags`
    };
    dynamoDb.docClient().scan(scanParams, (error, integrationResponse) => {
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true
                },
                body: JSON.stringify(`Couldn't fetch the resource tags.`)
            });
            return;
        }

        const response = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify(buildResponse(integrationResponse))
        };
        callback(null, response);
    });
};
