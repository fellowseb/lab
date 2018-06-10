'use strict';

class FellowsebLabResourceTag {
    constructor({ tag }) {
        this.tag = tag;
    }
    toJSON() {
        var json = {
            'tag': this.tag
        };
        return json;
    }
};

module.exports = FellowsebLabResourceTag;