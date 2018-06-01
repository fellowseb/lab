'use strict';

const resources = require('./resources');

module.exports.listTalks = resources.listHandler('talk', '/talks');