'use strict';

const AWS = require('aws-sdk');
const process = require('process');
const FellowsebLabDB = require('../src/classes/FellowsebLabDB.js');
const FellowsebLabResource = require('../src/classes/FellowsebLabResource.js');
const FellowsebLabResourceTag = require('../src/classes/FellowsebLabResourceTag.js');

const mapToResource = (record) => {
 const { resourceId, resourceType, title, url, tags, authors, read_time, added_time, isbn, ISBN, editor, hasThumbnail } = record;
  return new FellowsebLabResource({ id: resourceId, type: resourceType, title, url, tags: tags ? tags.values : [], authors: authors ? authors.values : [], time_read: read_time, time_added: added_time, isbn: isbn || ISBN, editor, hasThumbnail });
};

const mapToTag = ({ tag }) => {
  return new FellowsebLabResourceTag({ tag });
};

const readOption = (argIdx) => {
  if (process.argv.length < argIdx+1) {
    return null;
  }
  const arg = process.argv[argIdx];
  const eqlIdx = arg.indexOf('=');
  if (eqlIdx === -1) throw new Error(`[readOption] Illformed argument (${arg})`);
  if (arg.substr(0, 2) !== '--') throw new Error(`[readOption] Illformed argument (${arg})`);
  const argName = arg.substr(2, eqlIdx-2);
  const argValue = arg.substr(eqlIdx+1);
  let isSource = false;
  if (argName.startsWith('source-')) {
    isSource = true;
  } else if (!argName.startsWith('target-')) {
    throw new Error(`[readOption] Unkown argument ${argName}`);
  }
  const argSubname = argName.substr(7);
  let optionName = ''
  if (argSubname === 'offline') {
    optionName = 'isOffline';
    optionValue = Boolean(argValue);
  } else if (argSubname === 'resources-table') {
    optionName = 'resourcesTable';
    optionValue = argValue;
  } else if (argSubname === 'resource-tags-table') {
    optionName = 'resourceTagsTable';
    optionValue = argValue;
  } else if (argSubname === 'stage') {
    optionName = 'stage';
    optionValue = argValue;
    if (argValue !== 'prod' && argValue != 'dev') {
      throw new Error(`[readOption] Invalid argument value ${argValue}`);
    }
  } else {
    throw new Error(`[readOption] Unkown argument ${argName}`);
  }
  return { [isSource ? 'sourceOptions' : 'targetOptions']: { [optionName]: optionValue } };
}

const readOptions = () => {
  let sourceOptions = {};
  let targetOptions = {};
  let optionIdx = 0;
  while (const option = readOption(optionIdx)) {
    sourceOptions = Object.assign({}, sourceOptions, option.sourceOptions);
    targetOptions = Object.assign({}, targetOptions, option.targetOptions);
  }
  return {
    sourceOptions,
    targetOptions
  };
}

const makeDB = ({ isOffline, resourcesTable, resourceTagsTable, stage }) => {
  return new FellowsebLabDB({
    isOffline: isOffline || false,
    stage: stage || 'prod'
    resourcesTable,
    resourceTagsTable,
  }
}

const main = async () => {
  const { sourceOptions, targetOptions } = readOptions();
  const sourcedb = makeDB(sourceOptions);
  const targetdb = makeDB(targetOptions);
  try {
    let rawData = await sourcedb.scanResources();
    await targetdb.batchWriteResources(rawData.Items.map(mapToResource));
    process.stdout.write(`Written a batch of ${rawData.Count} resources\n`);
    rawData = await sourcedb.scanResourceTags();
    await targetdb.putResourceTags(rawData.Items.map(mapToTag));
    process.stdout.write(`Written a batch of ${rawData.Count} resource tags\n`);
  } catch (err) {
    process.stdout.write(`${err.message}\n`);
    process.exit(1);
  }
};

main();

