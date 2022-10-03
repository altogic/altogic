import { createClient } from "altogic";

let envUrl = "https://c1-europe.altogic.com/e:6315a2d47fe76ffa635dc6f9";
let clientKey = "882f5364e29140e794d0c031ea49f759";

let options = {
  apiKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnZJZCI6IjYzMTVhMmQ0N2ZlNzZmZmE2MzVkYzZmOSIsImtleUlkIjoiNjMxNWEyZDU3ZmU3NmZmYTYzNWRjNzBhIiwiaWF0IjoxNjYyMzYyMzI1LCJleHAiOjI1MjYzNjIzMjV9.c8Sr2eeZTD4riPUDwwp0qt_iXhRCyexbQRKhVLXUvXk",
};

const altogic = createClient(envUrl, clientKey, options);

export { altogic };
