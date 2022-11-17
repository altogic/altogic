import { createClient } from "altogic";

// This `envUrl` and `clientKey` is sample you need to create your own.
let envUrl = "https://auth.c1-europe.altogic.com";
let clientKey = "ccf9aab72f47484bba21e1706d61df0c";

const altogic = createClient(envUrl, clientKey, {
  signInRedirect: "/sign-in",
});

export const altogicWithToken = (token) => {
  altogic.auth.setSession({ token });
  return altogic;
};

export default altogic;
