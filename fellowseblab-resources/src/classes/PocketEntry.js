'use strict';

class PocketEntry {
    constructor() {
        this.item_id = null;
        this.resolved_id = null;
        this.time_added = null;
        this.time_read = null;
        this.given_url = "";
        this.resolved_url = "";
        this.given_title = "";
        this.resolved_title = "";
        this.favorite = 0;
        this.status = 0;
        this.tags = {};
        this.authors = {};
    }
    fromJSON(json) {
        this.item_id = json.item_id.slice();
        this.resolved_id = json.resolved_id.slice();
        this.time_added = json.time_added;
        this.time_read = json.time_read;
        this.given_url = json.given_url.slice();
        this.resolved_url = json.resolved_url.slice();
        this.given_title = json.given_title.slice();
        this.resolved_title = json.resolved_title.slice();
        this.favorite = json.favorite ? json.favorite : 0;
        this.status = json.status ? json.status.slice() : 0;
        this.tags = json.tags ? {...json.tags} : {};
        this.authors = json.authors ? {...json.authors} : {};
        return this;      
    }
}

module.exports = PocketEntry;