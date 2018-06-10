'use strict';

const FellowsebLabDB = require('../../src/classes/FellowsebLabDB');

function mapResourceItems(offset, count, integrationResponseItems) {
    let ret = [];
    for (var i = offset; i < offset + count; ++i) {
        if (i in integrationResponseItems) {
            let integrationResponseItem = integrationResponseItems[i];
            ret.push({
                "title": integrationResponseItem.title,
                "url": integrationResponseItem.url,
                "resourceId": integrationResponseItem.resourceId,
                "tags": integrationResponseItem.tags ? integrationResponseItem.tags : [],
                "authors": integrationResponseItem.authors ? integrationResponseItem.authors : [],
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

function buildResponseBody(endpoint, requestEvent, integrationResponse) {
    var offsetParam = requestEvent.queryStringParameters
        ? requestEvent.queryStringParameters['offset']
        : null;
    var countParam = requestEvent.queryStringParameters
        ? requestEvent.queryStringParameters['count']
        : null;
    var count = countParam
        ? parseInt(countParam, 10)
        : 9999;
    var offset = offsetParam
        ? parseInt(offsetParam, 10)
        : 0;
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

module.exports = {
    getListHandler: (resourceType, endpoint) => async (event) => {
        const tag = event.queryStringParameters
            ? event.queryStringParameters['tag']
            : null;
        let response = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            }
        };
        try {
            let db = new FellowsebLabDB();
            var integrationResponse = await db.queryResources({ resourceType, tag });
            response.statusCode = 200;
            response.body = buildResponseBody(endpoint, event, integrationResponse);
        } catch (err) {
            response.statusCode = err.statusCode || 501;
            response.body = {
                error: `Couldn't fetch the resources. \
                    (${err.toString()})`
            }
        }
        response.body = JSON.stringify(response.body);
        return response;
    }
};
