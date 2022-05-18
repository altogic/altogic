import { createClient } from "altogic";
//Create the Altogic Client Library instance.
export const altogic = createClient(
  process.env.NEXT_PUBLIC_ALTOGIC_ENV_URL,
  process.env.NEXT_PUBLIC_ALTOGIC_CLIENT_KEY,
  {
    signInRedirect: "/auth/sign-in-redirect",
  }
);
