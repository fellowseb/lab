'use strict';

import * as R from 'ramda';

module.exports = {
    eventCurrentTarget: R.prop('currentTarget'),
    eventStopPropagation: R.tap(event => event.stopPropagation()),
    eventPreventDefault: R.tap(event => event.preventDefault())
};
