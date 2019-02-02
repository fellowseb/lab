'use strict';

const AWS = require('aws-sdk');

const batchWriteAddRequestItemsEntry = (batchWriteInput, tableName) => {
    let newBatchWriteInput = { ...batchWriteInput };
    if ('RequestItems' in newBatchWriteInput === false) {
        newBatchWriteInput.RequestItems = {};
    }
    if (tableName in newBatchWriteInput.RequestItems === false) {
        newBatchWriteInput.RequestItems[tableName] = [];
    }
    return newBatchWriteInput;
};

const batchWriteAddPutItems = (batchWriteInput, tableName, dataArr) => {
    if (dataArr && dataArr.length) {
        let newBatchWriteInput = batchWriteAddRequestItemsEntry(batchWriteInput, tableName);
        newBatchWriteInput.RequestItems[tableName] = [
            ...newBatchWriteInput.RequestItems[tableName],
            ...dataArr.map(dataObj => ({
                PutRequest: {
                    Item: dataObj.toJSON()
                }
            }))
        ];
        return newBatchWriteInput;
    } else {
        return batchWriteInput;
    }
};

const extractFirst25Requests = (originaryBatchWriteInput) => {
    const MAX_REQUEST_PER_BATCH = 25;
    let currentBatch = {};
    let remaining = {};
    let rqtsCnt = 0;
    for (let tableName in originaryBatchWriteInput.RequestItems) {
        let requests = originaryBatchWriteInput.RequestItems[tableName];
        for (let request of requests) {
            let obj = rqtsCnt < MAX_REQUEST_PER_BATCH ? currentBatch : remaining;
            obj = batchWriteAddRequestItemsEntry(obj, tableName);
            if (rqtsCnt < MAX_REQUEST_PER_BATCH) {
                currentBatch = obj;
            } else {
                remaining = obj;
            }
            obj.RequestItems[tableName].push(request);
            rqtsCnt++;
        }
    }
    return {
        currentBatch,
        remaining
    }
};

const batchWrite = async (dynamoDB, batchWriteInput) => {
    let remaining = { ...batchWriteInput };
    while (remaining && remaining.RequestItems && Object.getOwnPropertyNames(remaining.RequestItems).length) {
        let r = extractFirst25Requests(remaining);
        remaining = r.remaining;
        let currentBatch = r.currentBatch;
        let responseData = await dynamoDB.batchWrite(currentBatch).promise();
        if (responseData &&
            responseData.UnprocessedItems &&
            responseData.UnprocessedItems.length) {
            remaining = mergeWriteInput(remaining, responseData.UnprocessedItems);
        }
    }
};

class FellowsebLabDB {
    constructor({ isOffline, stage, resourcesTable, resourceTagsTable }) {
        isOffline = isOffline || false;
        stage = stage|| 'dev';
        const region = isOffline ? 'localhost' : 'eu-west-1';

        let options = {
          apiVersion: 'latest',
          region,
          convertReponseTypes: true
        }
        if (isOffline) {
          options.endpoint = 'http://localhost:8000';
        }

        this.dynamoDB = new AWS.DynamoDB.DocumentClient(options);
        this.resourcesTable = resourcesTable || `fellowseb-lab-${stage}-resources`;
        this.resourceTagsTable = resourceTagsTable || `fellowseb-lab-${stage}-resourceTags`;
    }
    async queryResources({ resourceType = 'article', tag = null }) {
        let queryInput = {
            "TableName": this.resourcesTable,
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

        if (tag) {
            queryInput.ExpressionAttributeValues[":vtag"] = tag;
            queryInput.FilterExpression = "contains(tags, :vtag)";
        }
        return this.dynamoDB.query(queryInput).promise();
    }
    async scanResourceTags() {
        const scanInput = {
            'TableName': this.resourceTagsTable
        };
        return this.dynamoDB.scan(scanInput).promise();
    }
    async scanResources() {
        const scanInput = {
            'TableName': this.resourcesTable
        };
        return this.dynamoDB.scan(scanInput).promise();
    }
    async batchWriteResources(resourcesToPut = []) {
        let batchWriteInput = batchWriteAddPutItems({}, this.resourcesTable, resourcesToPut);
        return batchWrite(this.dynamoDB, batchWriteInput);
    }
    async putResourceTags(resourceTags = []) {
        let resultArr = await Promise.all(resourceTags.map(async resourceTag => {
            return this.dynamoDB.put({
                'TableName': this.resourceTagsTable,
                'Item': resourceTag.toJSON(),
                'ConditionExpression': 'attribute_not_exists(tag)'
            }).promise().then(() => true).catch(err => {
                if (err.code = 'ConditionalCheckFailedException') {
                    return false;
                }
                throw err;
            });
        }));
        return resultArr.reduce((cnt, b) => b ? ++cnt : cnt, 0);
    }
};

module.exports = FellowsebLabDB;
