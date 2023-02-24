import { createClient } from 'altogic';


const altogic = createClient(
    import.meta.env.PUBLIC_ALTOGIC_ENV_URL,
    import.meta.env.PUBLIC_ALTOGIC_CLIENT_KEY,

);
export const { db, auth, storage, endpoint, queue, realtime, cache } = altogic;
