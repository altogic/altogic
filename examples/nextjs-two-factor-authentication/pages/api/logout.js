import { altogic } from "../../helpers/client";

async function handler(req, res) {
  // Remove the cookie associated with the request.
  altogic.auth.removeSessionCookie(req, res);

  return res.status(200).json({ message: "ok" });
}
export default handler;
