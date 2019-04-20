'use strict';

class FellowsebLabResourceTag {
    constructor({ tag = [], displayName = '' }) {
        this.tag = tag;
        this.displayName = displayName;
    }
    toJSON() {
        var json = {
            'tag': this.tag,
            'displayName': {
                'en': this.displayName
            }
        };
        return json;
    }
}

module.exports = FellowsebLabResourceTag;
