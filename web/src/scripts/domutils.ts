import prop from "ramda/es/prop";
import tap from "ramda/es/tap";
import type { SyntheticEvent } from "react";

export default {
  eventCurrentTarget: (event: SyntheticEvent<HTMLElement>) =>
    prop("currentTarget")(event),
  eventStopPropagation: tap((event: SyntheticEvent<HTMLElement>) =>
    event.stopPropagation(),
  ),
  eventPreventDefault: tap((event: SyntheticEvent<HTMLElement>) =>
    event.preventDefault(),
  ),
};
