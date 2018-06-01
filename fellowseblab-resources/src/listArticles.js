'use strict';

const resources = require('./resources');

module.exports.listArticles = resources.listHandler('article', '/articles');
