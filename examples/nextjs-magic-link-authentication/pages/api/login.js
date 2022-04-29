import { setCookies } from "cookies-next";

async function handler(req, res) {
  const { token } = req.body;
  //Set the cookie for SSR.
  setCookies("token", token, {
    req,
    res,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "none",
    httpOnly: true,
    secure: true,
  });

  return res.status(200).json({ message: "ok" });
}
export default handler;
