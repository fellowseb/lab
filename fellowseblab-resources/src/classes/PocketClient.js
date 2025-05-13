"use strict";

const rp = require("request-promise-native");
const PocketEntry = require("../../src/classes/PocketEntry");

const POCKET_API_URL = "https://getpocket.com/v3";

function parseRetrieveResponse(responseBody) {
  var bodyJSON = JSON.parse(responseBody);
  if ("list" in bodyJSON === false) {
    throw new Error("Ill-formed response body");
  }
  return Object.values(bodyJSON.list).map((entryJson) =>
    new PocketEntry().fromJSON(entryJson),
  );
}

/**
 * Client for the Pocket API.
 * @class PocketClient
 * @desc https://getpocket.com/developer/docs/v3
 */
class PocketClient {
  /**
   * @member {string} consumerKey Consumer Key.
   */
  constructor({ consumerKey, accessToken }) {
    this.consumerKey = consumerKey;
    this.accessToken = accessToken;
  }
  /**
   * Parameters given to PocketClient.retrieve.
   * @typedef {Object} PocketRetrieveParameters
   * @desc https://getpocket.com/developer/docs/v3/retrieve
   * @property {('unread'|'archvive'|'all')} [state='unread'] State filter.
   * @property {(0|1)} [favorite=0] Favorite entries flag filter.
   * @property {string|'_untagged_'} [tag] String tag filter (only one allowed).
   * @property {'article'|'video'|'image'} [contentType] Pocket entry content type filter.
   * @property {'newest'|'oldest'|'title'|'site'} [sort] How retrieved entries are sorted.
   * @property {'simple'|'complete'} [detailType] Level of details to return.
   * @property {string} [search] Only return items whose title or url contain the search string.
   * @property {string} [domain] Only return items from a particular domain.
   * @property {timestamp} [since] Only return items modified since the given since unix timestamp.
   * @property {number} [count] Only return count number of items.
   * @property {number} [offset] Used only with count; start returning from offset position of results.
   */
  /**
   * Retrieve entries from Pocket account. The returned entries are stored locally for data persistence
   * and returned to caller.
   * @param {PocketRetrieveParameters} retrieveParameters Retrieve parameters.
   * @returns {Promise.<PocketEntry[]>} List of Pocket entries retrieved.
   * @async
   * @api public
   */
  async retrieve(retrieveParameters) {
    const payload = {
      consumer_key: this.consumerKey,
      access_token: this.accessToken,
      ...retrieveParameters,
    };
    const requestOptions = {
      port: 443,
      uri: `${POCKET_API_URL}/get`,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Accept: "*",
        "X-Accept": "application/json",
      },
      form: payload,
    };
    const response = await rp(requestOptions);
    return parseRetrieveResponse(response);
  }
  async modify(operations) {}
  async add() {}
}

module.exports = PocketClient;
