'use strict';

import FellowsebLabDB from '../../src/classes/FellowsebLabDB';

const buildResponse = integrationResponse => {
    var response = {
        'tags': Object.keys(integrationResponse.Items).map(key => integrationResponse.Items[key]),
        'totalCount': integrationResponse.ScannedCount,
        'filteredCount': integrationResponse.Count
    };
    return response;
};

export async function handler() {
    const isOffline = process.env.IS_OFFLINE;
    const stage = process.env.STAGE;
    let response = {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        }
    };
    try {
        let db = new FellowsebLabDB({isOffline, stage});
        let integrationResponse = await db.scanResourceTags();
        response.statusCode = 200;
        response.body = buildResponse(integrationResponse);
    } catch (err) {
        response.statusCode = err.statusCode || 501;
        response.body = {
            error: `Couldn't fetch the resource tags. Err: ${err.toString()}`
        };
    }
    response.body = JSON.stringify(response.body);
    return response;
}
