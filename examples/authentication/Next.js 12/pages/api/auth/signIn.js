import altogic from "../../../configs/altogic";

export default async function handler(req, res) {
  const { email, password } = JSON.parse(req.body);

  const { user, session, errors } = await altogic.auth.signInWithEmail(
    email,
    password
  );

  if (errors) {
    res.status(errors.status).json({ errors });
  } else {
    altogic.auth.setSessionCookie(session.token, req, res);
    altogic.auth.setSession(session);
    res.status(200).json({ user, session });
  }
}
