const AWS = require('aws-sdk');

var s3options = {
    s3BucketEndpoint: false,
    s3ForcePathStyle: true
};
if(process.env.IS_OFFLINE) {
    s3options.endpoint = 'http://localhost:8001';
}
const S3 = new AWS.S3(s3options);

module.exports.getBookThumbnail = function (event, context, callback) {
    const resourceId = event.pathParameters.resourceId;
    const imageExtension = event.queryStringParameters && event.queryStringParameters.type ?
        event.queryStringParameters.type : '';
    S3.getObject({
        Bucket: 'fellowseb-lab',
        Key: `resources/${resourceId}/thumbnail${imageExtension}`
    },
        function (error, output) {
            if (error) {
                console.error(error);
                callback(null, {
                    statusCode: error.statusCode || 501,
                    headers: {
                        'Content-Type': 'text/plain',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true
                    },
                    body: JSON.stringify(`Couldn't fetch the thumbnail.`)
                });
                return;
            }

            const response = {
                statusCode: 200,
                headers: {
                    'Content-Type': output.ContentType,
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true
                },
                body: output.Body,
                isBase64Encoded: true
            };
            callback(null, response);
        });
};
