import { createClient } from "altogic";

const altogic = createClient(
  process.env.NEXT_PUBLIC_ALTOGIC_ENV_URL,
  process.env.NEXT_PUBLIC_ALTOGIC_CLIENT_KEY,
  {
    signInRedirect: "/sign-in",
  }
);

export const { db, auth, storage, endpoint, queue, realtime, cache } = altogic;
