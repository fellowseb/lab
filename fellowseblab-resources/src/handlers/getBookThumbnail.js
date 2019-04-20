const AWS = require('aws-sdk');

module.exports = {
    handler: async(event) => {
        const resourceId = event.pathParameters.resourceId;
        const imageExtension = event.queryStringParameters &&
            event.queryStringParameters.type
            ? event.queryStringParameters.type
            : '';
        let response = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            }
        };
        try {
            let s3options = {
                s3BucketEndpoint: false,
                s3ForcePathStyle: true
            };
            if (process.env.IS_OFFLINE) {
                s3options.endpoint = 'http://localhost:8001';
            }
            const stage = process.env.STAGE || 'dev';
            const S3 = new AWS.S3(s3options);
            const Key = `resources/${resourceId}/thumbnail${imageExtension}`;
            const Bucket = `fellowseb-lab-${stage}`;
            const output = await S3.getObject({ Bucket, Key }).promise();
            response.statusCode = 200;
            response.body = output.Body.toString('base64');
            response.headers['Content-Type'] = output.ContentType;
            response.isBase64Encoded = true;
        } catch (err) {
            response.statusCode = err.statusCode || 501;
            response.body = {
                error: `Couldn't fetch the thumbnail. Err: ${err.toString()}`
            };
            response.headers['Content-Type'] = 'application/json';
        }
        return response;
    }
};
