'use strict';

const resources = require('./resources');

module.exports.listBooks = resources.listHandler('book', '/books');
