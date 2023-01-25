// configs/altogic.js
import { createClient } from "altogic";

// This `envUrl` and `clientKey` is sample you need to create your own.
let envUrl = "https://j82n-6upq.c3-na.altogic.com";
let clientKey = "24fdec348d474cc190e0a7d0f8520431";

const altogic = createClient(envUrl, clientKey);

export default altogic;
