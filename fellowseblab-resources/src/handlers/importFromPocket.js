import { PocketClient } from "../classes/PocketClient.js";
import { FellowsebLabResource } from "../classes/FellowsebLabResource.js";
import { FellowsebLabResourceTag } from "../classes/FellowsebLabResourceTag.js";
import { FellowsebLabDB } from "../classes/FellowsebLabDB.js";

const readOptions = () => {
  let consumerKey = process.env.POCKET_CONSUMER_KEY;
  let accessToken = process.env.POCKET_ACCESS_TOKEN;
  let since = process.env.POCKET_SINCE
    ? parseInt(process.env.POCKET_SINCE, 10)
    : undefined;
  let state = process.env.POCKET_STATE;
  let favorite = process.env.POCKET_FAVORITE
    ? parseInt(process.env.POCKET_FAVORITE, 10)
    : undefined;
  process.argv.forEach((val, index) => {
    if (val === "--pocket-consumer-key" && process.argv.length >= index + 1) {
      consumerKey = process.argv[index + 1];
    }
    if (val === "--pocket-access-token" && process.argv.length >= index + 1) {
      accessToken = process.argv[index + 1];
    }
    if (val === "--since" && process.argv.length >= index + 1) {
      since = parseInt(process.argv[index + 1], 10);
    }
    if (val === "--state" && process.argv.length >= index + 1) {
      state = process.argv[index + 1];
    }
    if (val === "--favorite" && process.argv.length >= index + 1) {
      favorite = parseInt(process.argv[index + 1], 10);
    }
  });
  return {
    consumerKey,
    accessToken,
    since,
    state,
    favorite,
  };
};

const resourceFromPocketEntry = (pocketEntry) => {
  let tags = pocketEntry.tags ? Object.keys(pocketEntry.tags) : [];
  let isTalk =
    tags.indexOf("talk") !== -1 ||
    pocketEntry.resolvedUrl.indexOf("youtube.com") !== -1;

  return new FellowsebLabResource({
    pocketId: pocketEntry.resolvedId,
    type: isTalk ? "talk" : "article",
    url: pocketEntry.resolvedUrl,
    timeAdded: pocketEntry.timeAdded
      ? parseInt(pocketEntry.timeAdded, 10)
      : undefined,
    timeRead: pocketEntry.timeRead
      ? parseInt(pocketEntry.timeRead, 10)
      : undefined,
    title: pocketEntry.resolvedTitle,
    tags,
    authors: pocketEntry.authors
      ? Object.keys(pocketEntry.authors).map(
          (authorId) => pocketEntry.authors[authorId].name,
        )
      : [],
  });
};

const resourceTagsFromPocketEntry = (pocketEntry) => {
  if (pocketEntry.tags) {
    return Object.keys(pocketEntry.tags).map(
      (tag) => new FellowsebLabResourceTag({ tag }),
    );
  }
  return [];
};

const createResourcesFromPocketEntries = (pocketEntries) =>
  pocketEntries.reduce(
    (obj, entry) => {
      obj.resources = [...obj.resources, resourceFromPocketEntry(entry)];
      obj.resourceTags = [
        ...obj.resourceTags,
        ...resourceTagsFromPocketEntry(entry),
      ];
      return obj;
    },
    { resources: [], resourceTags: [] },
  );

const prepareRetrieveOptions = (
  { state, since, favorite },
  queryStringParameters,
) => {
  // Look in query string
  if (queryStringParameters) {
    if ("since" in queryStringParameters) {
      since = parseInt(queryStringParameters["since"], 10);
    }
    if ("state" in queryStringParameters) {
      state = queryStringParameters["state"];
    }
    if ("favorite" in queryStringParameters) {
      favorite = queryStringParameters["favorite"];
    }
  }
  // Default values
  if (since === undefined)
    since = parseInt(Date.now() / 1000, 10) - 60 * 60 * 24;
  if (state === undefined) state = "archive";
  if (favorite === undefined) favorite = 0;
  return {
    detailType: "complete",
    sort: "oldest",
    state,
    since,
    favorite,
  };
};

export const handler = async ({ queryStringParameters }) => {
  const isOffline = process.env.IS_OFFLINE;
  const stage = process.env.STAGE;
  let response = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  };
  try {
    const { consumerKey, accessToken, since, state, favorite } = readOptions();
    const pocketClient = new PocketClient({ consumerKey, accessToken });
    const retrieveOptions = prepareRetrieveOptions(
      { since, state, favorite },
      queryStringParameters,
    );
    const pocketEntries = await pocketClient.retrieve(retrieveOptions);
    if (pocketEntries.length) {
      const { resources, resourceTags } =
        createResourcesFromPocketEntries(pocketEntries);
      const db = new FellowsebLabDB({ isOffline, stage });
      await db.batchWriteResources(resources);
      console.log(`Inserted ${resources.length} resources.`);
      const insertedTagCnt = await db.putResourceTags(resourceTags);
      console.log(`Inserted ${insertedTagCnt} tags.`);
    } else {
      console.log(`Nothing to import.`);
    }
    response.statusCode = 200;
    response.body = "OK";
    response.headers["Content-Type"] = "text/plain";
  } catch (err) {
    response.statusCode = err.statusCode || 501;
    response.body = err.toString();
    response.headers["Content-Type"] = "text/plain";
  }
  return response;
};
