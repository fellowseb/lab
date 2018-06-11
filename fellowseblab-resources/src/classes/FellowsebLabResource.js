'use strict';

const uuid = require('uuid');

class FellowsebLabResource {
    constructor({ id, type = 'article', title = '', url = '', tags = [],
        authors = [], time_read = 0, time_added = 0 }) {
        this.id = id || uuid();
        this.type = type;
        this.title = title;
        this.url = url;
        this.time_read = time_read;
        this.time_added = time_added;
        this.tags = tags;
        this.authors = authors;
    }
    toJSON() {
        var json = {
            resourceId: this.id,
            resourceType: this.type,
            added_time: this.time_added,
            read_time: this.time_read
        };
        if (this.title) json['title'] = this.title;
        if (this.url) json['url'] = this.url;
        if (this.tags) json['tags'] = [...this.tags];
        if (this.authors) json['authors'] = [...this.authors];
        return json;
    }
};

module.exports = FellowsebLabResource;
