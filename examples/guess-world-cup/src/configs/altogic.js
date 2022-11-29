import { createClient } from "altogic";

// This `envUrl` and `clientKey` is sample you need to create your own.
const envUrl = "https://guess-world-cup.c1-europe.altogic.com";
const clientKey = "853f29ed55064e8ba583cdbdfe83aadf";

const altogic = createClient(envUrl, clientKey, {
  signInRedirect: "/sign-in",
});

export const { db, auth, storage, endpoint, queue, realtime, cache } = altogic;
