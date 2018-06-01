'use strict';

const dynamoDB = require('./dynamoDB');

const dynamoDb = dynamoDB.docClient();

function mapResourceItems(offset, count, integrationResponseItems) {
    let ret = [];
    for (var i = offset; i < offset + count; ++i) {
        if (i in integrationResponseItems) {
            let integrationResponseItem = integrationResponseItems[i];
            ret.push({
                "title": integrationResponseItem.title,
                "url": integrationResponseItem.url,
                "resourceId": integrationResponseItem.resourceId,
                "tags": integrationResponseItem.tags ? integrationResponseItem.tags.values : [],
                "authors": integrationResponseItem.authors ? integrationResponseItem.authors.values : [],
                "thumbnailHREF": integrationResponseItem.hasThumbnail ? `/books/${integrationResponseItem.resourceId}/thumbnail` : null
            });
        }
    }
    // if (integrationResponseItem.image) {
    //     resourceItem["thumbnail"] = {
    //         "width": integrationResponseItem.image.M.width.N,
    //         "height": integrationResponseItem.image.M.height.N,
    //         "url": integrationResponseItem.image.M.url.S
    //     };
    // }
    return ret;
}

function buildResponse(endpoint, requestEvent, integrationResponse) {
    var offsetParam = requestEvent.queryStringParameters ? requestEvent.queryStringParameters['offset'] : null;
    var countParam = requestEvent.queryStringParameters ? requestEvent.queryStringParameters['count'] : null;
    var count = countParam ? parseInt(countParam) : 9999;
    var offset = offsetParam ? parseInt(offsetParam) : 0;
    var prevOffset;
    if (offset - count >= 0) {
        prevOffset = offset - count;
    }
    var nextOffset;
    if (integrationResponse.Count > offset + count) {
        nextOffset = offset + count;
    }
    var i = 0;

    var response = {
        "resources": mapResourceItems(offset, count, integrationResponse.Items),
        "totalCount": integrationResponse.ScannedCount,
        "filteredCount": integrationResponse.Count,
        "count": count
    };
    if (nextOffset !== undefined) {
        response["next"] = `${endpoint}?offset=${nextOffset}&count=${countParam}`
    }
    if (prevOffset !== undefined) {
        response["prev"] = `${endpoint}?offset=${prevOffset}&count=${countParam}`
    }
    return response;
};

module.exports.listHandler = (resourceType, endpoint) => (event, context, callback) => {
    const tagParam = event.queryStringParameters ? event.queryStringParameters['tag'] : null;
    let queryParams = {
        "TableName": `fellowseb-lab-${process.env.STAGE}-resources`,
        "IndexName": "resourceType-index",
        "KeyConditionExpression": "#resourceType = :vresourceType",
        "ScanIndexForward": false,
        "ExpressionAttributeNames": {
            "#resourceType": "resourceType"
        },
        "ExpressionAttributeValues": {
            ":vresourceType": resourceType
        }
    };

    if (tagParam) {
        queryParams["ExpressionAttributeValues"][":vtag"] = tagParam;
        queryParams["FilterExpression"] = "contains(tags, :vtag)";
    }
    dynamoDb.query(queryParams, (error, integrationResponse) => {
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true
                },
                body: 'Couldn\'t fetch the resources.'
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
            body: JSON.stringify(buildResponse(endpoint, event, integrationResponse))
        };
        callback(null, response);
    });
};
