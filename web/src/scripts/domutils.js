"use strict";

import prop from "ramda/es/prop";
import tap from "ramda/es/tap";

module.exports = {
  eventCurrentTarget: prop("currentTarget"),
  eventStopPropagation: tap((event) => event.stopPropagation()),
  eventPreventDefault: tap((event) => event.preventDefault()),
};
