import { createClient } from "altogic";

let envUrl = process.env.REACT_APP_ALTOGIC_ENV_URL;
let clientKey = process.env.REACT_APP_ALTOGIC_CLIENT_KEY;

const altogic = createClient(envUrl, clientKey, {
  signInRedirect: "/signin",
});

export default altogic;
