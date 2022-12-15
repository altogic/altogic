import { createClient } from "altogic";

// This `envUrl` and `clientKey` is sample you need to create your own.
const envUrl = "https://online-shopping-list.c1-europe.altogic.com";
export const clientKey = "419ab1e3b2f14e44bd7c8be9f08468d4";

const altogic = createClient(envUrl, clientKey, {
  // signInRedirect: "/sign-in",
});

export const { db, auth, storage, endpoint, queue, realtime, cache } = altogic;
