import { altogic } from "../../helpers/client";

async function handler(req, res) {
  const { token } = req.body;
  //Set the cookie for SSR.
  altogic.auth.setSessionCookie(token, req, res);

  return res.status(200).json({ message: "ok" });
}
export default handler;
