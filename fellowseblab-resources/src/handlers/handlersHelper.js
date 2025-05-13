'use strict';

import FellowsebLabDB from '../../src/classes/FellowsebLabDB';

// Temporary bandage
// Handles both response types of DynamoDB, that are different
// in dev and in prod
const unwrapLists = listValue => {
    return listValue instanceof Array ? listValue : listValue.values;
};

function mapResourceItems(offset, count, integrationResponseItems) {
    let ret = [];
    for (var i = offset; i < offset + count; ++i) {
        if (i in integrationResponseItems) {
            let integrationResponseItem = integrationResponseItems[i];
            ret.push({
                'title': integrationResponseItem.title,
                'url': integrationResponseItem.url,
                'resourceId': integrationResponseItem.resourceId,
                'tags': unwrapLists(integrationResponseItem.tags || []),
                'authors': unwrapLists(integrationResponseItem.authors || []),
                'thumbnailHREF': integrationResponseItem.hasThumbnail ? `/books/${integrationResponseItem.resourceId}/thumbnail` : null
            });
        }
    }
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

    var response = {
        'resources': mapResourceItems(offset, count, integrationResponse.Items),
        'totalCount': integrationResponse.ScannedCount,
        'filteredCount': integrationResponse.Count,
        'count': count
    };
    if (nextOffset !== undefined) {
        response['next'] = `${endpoint}?offset=${nextOffset}&count=${countParam}`;
    }
    if (prevOffset !== undefined) {
        response['prev'] = `${endpoint}?offset=${prevOffset}&count=${countParam}`;
    }
    return response;
}

export function getListHandler(resourceType, endpoint) {
    return async(event) => {
        const isOffline = process.env.IS_OFFLINE || false;
        const stage = process.env.STAGE || 'dev';
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
            let db = new FellowsebLabDB({isOffline, stage});
            let integrationResponse = await db.queryResources({resourceType, tag});
            response.statusCode = 200;
            response.body = buildResponseBody(endpoint, event, integrationResponse);
        } catch (err) {
            response.statusCode = err.statusCode || 501;
            response.body = {
                error: `Couldn't fetch the resources.                     (${err.toString()})`
            };
        }
        response.body = JSON.stringify(response.body);
        return response;
    };
}
