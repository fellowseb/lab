'use strict';

const https = require('https');
const querystring = require('querystring');
var dynamoDB = require('../src/dynamoDB');

const fetchPocketArticles = (execParams, callback) => {
    const POCKET_API_RETRIEVE_HOST = 'getpocket.com';
    const POCKET_API_RETRIEVE_PATH = '/v3/get';

    const twentyFourHoursAgo = Date.now() - (24 * 3600 * 1000);

    var payloadJSON = {
        'consumer_key': execParams.consumer_key,
        'access_token': execParams.access_token,
        'detailType': 'complete',
        'sort': 'oldest',
        'state': 'all',
        'since': twentyFourHoursAgo,
        'favorite': 1
    };
    const postData = querystring.stringify(payloadJSON);

    var options = {
        hostname: POCKET_API_RETRIEVE_HOST,
        port: 443,
        path: POCKET_API_RETRIEVE_PATH,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': '*',
            'X-Accept': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    var req = https.request(options, (res) => {
        res.setEncoding('utf8');
        var responseBody = '';
        res.on('data', (chunk) => {
            responseBody += chunk;
        });
        res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                if (callback) {
                    callback(null, JSON.parse(responseBody).list);
                }
            } else {
                if (callback) {
                    callback(responseBody, null);
                }
            }
        });
    });

    req.on('error', (e) => {
        if (callback) {
            callback(e, null);
        }
    });
    req.write(postData);
    req.end();
};

function getNextBatchRequests(requestItems) {
    return Object.keys(requestItems).reduce((previousValue, tableName) => {
        requestItems[tableName].forEach((request) => {
            var dest;
            if (previousValue.countNextRequests < 25) {
                dest = previousValue.nextBatchRequests;
                ++previousValue.countNextRequests;
            } else {
                dest = previousValue.remainingRequests;
            }
            if (!dest[tableName]) {
                dest[tableName] = [];
            }
            dest[tableName].push(request);
        });
        return previousValue;
    }, {
        remainingRequests: {},
        nextBatchRequests: {},
        countNextRequests: 0
    });
}

function sendBatchWriteRequests(ddb, requestItems, callback) {
    var r = getNextBatchRequests(requestItems);
    var remainingRequests = r.remainingRequests;
    var nextBatchRequests = r.nextBatchRequests;
    if (Object.keys(nextBatchRequests).length) {
        sendBatchWriteRequestsRec(ddb, remainingRequests, nextBatchRequests, callback);
    } else {
        callback(null, null);
    }
}

function mergeWriteRequests(lhsRequests, rhsRequests, callback) {
    callback(new Error('mergeWriteRequests not implemented'), null);
}

function sendBatchWriteRequestsRec(ddb, remainingRequests, nextBatchRequests, callback) {
    sendWriteRequestBatch(ddb, nextBatchRequests, (error, responseData) => {
        if (error && callback) {
            callback(error, null);
            return;
        }
        var newRequestItems = remainingRequests;
        if (responseData &&
            responseData.UnprocessedItems &&
            Object.keys(responseData.UnprocessedItems).length) {
            newRequestItems = mergeWriteRequests(responseData.UnprocessedItems, newRequestItems, callback);
        }
        if (Object.keys(newRequestItems).length) {
            sendBatchWriteRequests(ddb, newRequestItems, callback);
        } else if (callback) {
            callback(null, responseData);
        }
    });
}

function sendWriteRequestBatch(ddb, requestItems, callback) {
    var params = {
        RequestItems: requestItems
    };
    ddb.batchWriteItem(params, function(err, data) {
        if (callback) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, data);
            }
        }
    });
}

function createBatchWriteRequests(execParams, articles) {
    const articleToPutRequest = (articleID, articleData) => {
        var resourceType = articleData.resolved_url.indexOf('youtube.com') >= 0
            ? 'talk'
            : 'article';
        var item = {
            'resourceId': {
                'S': articleID
            },
            'resourceType': {
                'S': resourceType
            }
        };
        if (articleData.time_added) {
            item['added_time'] = {
                'N': '' + articleData.time_added
            };
        }
        if (articleData.time_updated) {
            item['updated_time'] = {
                'N': '' + articleData.time_updated
            };
        }
        if (articleData.time_read) {
            item['read_time'] = {
                'N': '' + articleData.time_read
            };
        }
        if (articleData.status) {
            item['status'] = {
                'N': '' + articleData.status
            };
        }
        if (articleData.favorite) {
            item['favorite'] = {
                'N': '' + articleData.favorite
            };
        }
        if (articleData.resolved_title) {
            item['title'] = {
                'S': articleData.resolved_title
            };
        }
        if (articleData.resolved_url) {
            item['url'] = {
                'S': articleData.resolved_url
            };
        }
        if (articleData.image) {
            item['image'] = {
                'M': {
                    'url': {
                        'S': articleData.image.src
                    },
                    'width': {
                        'N': articleData.image.width
                    },
                    'height': {
                        'N': articleData.image.height
                    }
                }
            };
        }
        if (articleData.tags) {
            item['tags'] = {
                'SS': Object.keys(articleData.tags)
            };
        }
        if (articleData.authors) {
            item['authors'] = {
                'SS': Object.keys(articleData.authors).map((authorId) => {
                    return articleData.authors[authorId].name;
                })
            };
        }
        return {
            PutRequest: {
                Item: item
            }
        };
    };
    return {
        'fellowseb-lab-resources': Object.keys(articles).map((articleID) =>
            articleToPutRequest(articleID, articles[articleID]))
    };
}

function createTagsPutRequests(execParams, articles) {
    const tagUniqueList = (articles) =>
        Object.keys(articles).reduce((tagList, articleId) => {
            if (articles[articleId].tags) {
                Object.keys(articles[articleId].tags).forEach((tag) => {
                    if (tagList.indexOf(tag) < 0) {
                        tagList.push(tag);
                    }
                });
            }
            return tagList;
        }, []);

    const tagToPutRequest = (tag) => ({
        'TableName': 'fellowseb-lab-resourceTags',
        'Item': {
            'tag': {
                'S': tag
            },
            'displayName': {
                'M': {
                    'en': {
                        'S': tag
                    }
                }
            }
        },
        'ConditionExpression': 'attribute_not_exists(tag)'
    });

    return tagUniqueList(articles).map(tagToPutRequest);
}

function sendTagsPutRequests(ddb, tagPutRequests, callback) {
    const sendTagsPutRequestsRec = (ddb, tagPutRequest, callback) => {
        ddb.putItem(tagPutRequest, function(err, data) {
            if (callback) {
                if (err && err.code !== 'ConditionalCheckFailedException') {
                    callback(err, null);
                } else {
                    if (tagPutRequests.length > 0) {
                        sendTagsPutRequestsRec(ddb, tagPutRequests.shift(), callback);
                    } else {
                        callback(null, data);
                    }
                }
            }
        });
    };
    if (tagPutRequests.length > 0) {
        sendTagsPutRequestsRec(ddb, tagPutRequests.shift(), callback);
    }
}

function populateDynamoDB(execParams, articles, callback) {
    let dynamodbOptions = {
        apiVersion: '2012-08-10'
    }
    if (execParams.aws_region) {
        dynamodbOptions['region'] = execParams.aws_region;
    }
    var ddb = dynamoDB.rawClient(dynamodbOptions);

    var writeRequests = createBatchWriteRequests(execParams, articles);
    sendBatchWriteRequests(ddb, writeRequests, (error, data) => {
        if (error) {
            if (callback) {
                callback(error, null);
            }
        } else {
            var tagPutRequests = createTagsPutRequests(execParams, articles);
            sendTagsPutRequests(ddb, tagPutRequests, callback);
        }
    });
}

function readExecParams() {
    var consumerKey = process.env.POCKET_CONSUMER_KEY;
    var accessToken = process.env.POCKET_ACCESS_TOKEN;
    var awsRegion = process.env.AWS_REGION;
    process.argv.forEach((val, index) => {
        if (val === '--pocket-consumer-key' && process.argv.length >= index + 1) {
            consumerKey = process.argv[index + 1];
        }
        if (val === '--pocket-access-token' && process.argv.length >= index + 1) {
            accessToken = process.argv[index + 1];
        }
        if (val === '--aws-region' && process.argv.length >= index + 1) {
            awsRegion = process.argv[index + 1];
        }
    });
    return {
        'consumer_key': consumerKey,
        'access_token': accessToken,
        'aws_region': awsRegion
    };
}

function handleError(error, callback) {
    console.log('importFromPocket | ERROR');
    console.error(error);
    callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: error,
    });
    console.log('importFromPocket | END');
}

module.exports.importFromPocket = function(event, context, callback) {
    console.log('importFromPocket | START');
    var execParams = readExecParams();
    fetchPocketArticles(execParams, (error, articles) => {
        if (error) {
            handleError(error, callback);
        } else {
            populateDynamoDB(execParams, articles, (error, data) => {
                if (error) {
                    handleError(error, callback);
                } else {
                    console.log('importFromPocket | END');
                    const response = {
                        statusCode: 200
                    };
                    callback(null, response);
                }
            });
        }
    });
}
