'use strict';

const uuid = require('uuid');

class FellowsebLabResource {
    constructor({ id, type = 'article', title = '', url = '', tags = [],
        authors = [], timeRead = 0, timeAdded = 0, isbn = '', editor = '',
        hasThumbnail = false }) {
        this.id = id || uuid();
        this.type = type;
        this.title = title;
        this.url = url;
        this.timeRead = timeRead;
        this.timeAdded = timeAdded;
        this.tags = tags;
        this.authors = authors;
        this.isbn = isbn;
        this.editor = editor;
        this.hasThumbnail = hasThumbnail;
    }
    toJSON() {
        var json = {
            'resourceId': this.id,
            'resourceType': this.type,
            'added_time': this.timeAdded,
            'read_time': this.timeRead
        };
        if (this.title) json['title'] = this.title;
        if (this.url) json['url'] = this.url;
        if (this.tags) json['tags'] = [...this.tags];
        if (this.authors) json['authors'] = [...this.authors];
        if (this.isbn) json['isbn'] = this.isbn;
        if (this.editor) json['editor'] = this.editor;
        if (this.hasThumbnail) json['hasThumbnail'] = this.hasThumbnail;
        return json;
    }
}

module.exports = FellowsebLabResource;
