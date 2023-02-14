import { createClient } from "altogic";

const altogic = createClient(
  "https://exchange.c1-europe.altogic.com",
  "b205444ca335499b9df8c01e4fee1f99"
);
export const { db, auth, storage, endpoint, queue, realtime, cache } = altogic;
