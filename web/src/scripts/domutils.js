import prop from "ramda/es/prop";
import tap from "ramda/es/tap";

export default {
  eventCurrentTarget: prop("currentTarget"),
  eventStopPropagation: tap((event) => event.stopPropagation()),
  eventPreventDefault: tap((event) => event.preventDefault()),
};
