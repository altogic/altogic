import { createClient } from "altogic";

export const altogic = createClient(
  process.env.NEXT_PUBLIC_ALTOGIC_ENV_URL,
  process.env.NEXT_PUBLIC_ALTOGIC_CLIENT_KEY
);
