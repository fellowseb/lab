"use strict";

class PocketEntry {
  constructor() {
    this.itemId = null;
    this.resolvedId = null;
    this.timeAdded = null;
    this.timeRead = null;
    this.givenUrl = "";
    this.resolvedUrl = "";
    this.givenTitle = "";
    this.resolvedTitle = "";
    this.favorite = 0;
    this.status = 0;
    this.tags = {};
    this.authors = {};
  }
  fromJSON(json) {
    this.itemId = json.itemId.slice();
    this.resolvedId = json.resolvedId.slice();
    this.timeAdded = json.timeAdded;
    this.timeRead = json.timeRead;
    this.givenUrl = json.givenUrl.slice();
    this.resolvedUrl = json.resolvedUrl.slice();
    this.givenTitle = json.givenTitle.slice();
    this.resolvedTitle = json.resolvedTitle.slice();
    this.favorite = json.favorite ? json.favorite : 0;
    this.status = json.status ? json.status.slice() : 0;
    this.tags = json.tags ? { ...json.tags } : {};
    this.authors = json.authors ? { ...json.authors } : {};
    return this;
  }
}

module.exports = PocketEntry;
