import altogic, { altogicWithToken } from "../../../configs/altogic";

export default async function handler(req, res) {
  const token = req.cookies.session_token;
  const { errors } = await altogicWithToken(token).auth.signOut();
  altogic.auth.removeSessionCookie(req, res);

  if (errors) {
    res.status(errors.status).json({ errors });
  } else {
    res.status(200).json({ data: true });
  }
}
