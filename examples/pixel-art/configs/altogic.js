import { createClient } from "altogic";

// This `envUrl` and `clientKey` is sample you need to create your own.
let envUrl = "https://pixel-art.c1-europe.altogic.com";
let clientKey = "d1393cd5be7646c58c648ec7f0fcc963";

const altogic = createClient(envUrl, clientKey, {
  signInRedirect: "/sign-in",
});

export const { db, auth, storage, endpoint, queue, realtime, cache } = altogic;
