import { createClient } from "altogic";

const ENV_URL = process.env.NEXT_PUBLIC_ALTOGIC_API_BASE_URL;
const CLIENT_KEY = process.env.NEXT_PUBLIC_ALTOGIC_CLIENT_KEY;

if (!ENV_URL || !CLIENT_KEY) {
  throw new Error("Missing Altogic API base URL or client key, check .env");
}

const client = createClient(ENV_URL, CLIENT_KEY);

export default client;
