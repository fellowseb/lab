var AWS = require("aws-sdk");

const getS3 = ({ endpoint, region }) => {
  let params = {
    s3ForcePathStyle: true,
  };
  if (endpoint) {
    params.endpoint = new AWS.Endpoint(endpoint);
    params.s3BucketEndpoint = false;
  }
  if (region) {
    params.region = region;
  }
  return new AWS.S3(params);
};

const listKeys = async (s3, bucket) => {
  let response = await s3.listObjectsV2({ Bucket: bucket }).promise();
  return response.Contents.map((objectData) => objectData.Key);
};

const syncObject = async (
  key,
  sourceS3,
  sourceBucket,
  targetS3,
  targetBucket,
) => {
  const object = await sourceS3
    .getObject({ Bucket: sourceBucket, Key: key })
    .promise();
  if (object.ContentLength > 0) {
    process.stdout.write(`Putting object ${key}...\n`);
    return targetS3
      .putObject({
        Bucket: targetBucket,
        Key: key,
        Body: new Buffer(object.Body),
        Metadata: object.Metadata,
        ContentType: object.ContentType,
      })
      .promise();
  }
};

const readOption = (argIdx) => {
  if (process.argv.length < argIdx + 1) {
    return null;
  }
  const arg = process.argv[argIdx];
  const eqlIdx = arg.indexOf("=");
  if (eqlIdx === -1)
    throw new Error(`[readOption] Illformed argument (${arg})`);
  if (arg.substr(0, 2) !== "--")
    throw new Error(`[readOption] Illformed argument (${arg})`);
  const argName = arg.substr(2, eqlIdx - 2);
  const argValue = arg.substr(eqlIdx + 1);
  let isSource = false;
  if (argName.startsWith("source-")) {
    isSource = true;
  } else if (!argName.startsWith("target-")) {
    throw new Error(`[readOption] Unkown argument ${argName}`);
  }
  const argSubname = argName.substr(7);
  let optionName = "";
  if (argSubname === "bucket") {
    optionName = "bucket";
    optionValue = argValue;
  } else if (argSubname === "region") {
    optionName = "region";
    optionValue = argValue;
  } else if (argSubname === "endpoint") {
    optionName = "endpoint";
    optionValue = argValue;
  } else {
    throw new Error(`[readOption] Unkown argument ${argName}`);
  }
  return {
    [isSource ? "sourceOptions" : "targetOptions"]: {
      [optionName]: optionValue,
    },
  };
};

const readOptions = () => {
  let sourceOptions = {};
  let targetOptions = {};
  let optionIdx = 0;
  let option = readOption(optionIdx);
  while (option) {
    sourceOptions = Object.assign({}, sourceOptions, option.sourceOptions);
    targetOptions = Object.assign({}, targetOptions, option.targetOptions);
    option = readOption(optionIdx);
  }
  return {
    sourceOptions,
    targetOptions,
  };
};

const main = async () => {
  const { sourceOptions, targetOptions } = readOptions();
  const sourceS3 = getS3(sourceOptions);
  const targetS3 = getS3(targetOptions);
  try {
    const keys = await listKeys(sourceS3, sourceOptions.bucket);
    for (let key of keys) {
      await syncObject(
        key,
        sourceS3,
        sourceOptions.bucket,
        sourceS3,
        targetOptions.bucket,
      );
    }
  } catch (err) {
    process.stderr.write(`Error: ${err.stack}\n`);
  }
};

main();
