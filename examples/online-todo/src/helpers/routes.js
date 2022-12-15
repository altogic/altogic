import AuthRedirect from "../pages/auth-redirect";
import CreateAnAccount from "../pages/create-an-account";
import EmailVerification from "../pages/email-verification";
import ForgotPassword from "../pages/forgot-password";
import ForgotPasswordEmail from "../pages/forgot-password-email";
import Home from "../pages/home";
import JoinRedirect from "../pages/join-redirect";
import NotFound from "../pages/not-found";
import ResetPassword from "../pages/reset-password";
import ResetPasswordSuccessfull from "../pages/reset-password-successful";
import Settings from "../pages/settings";
import SettingsWorkspace from "../pages/settings-workspace";
import SignIn from "../pages/sign-in";
import Workspace from "../pages/workspace";

export const myRouter = {
  WORKSPACE: "/",
  HOME: (workspaceSlug, listSlug = "") => {
    return `/w/${workspaceSlug}/${listSlug}`;
  },
  SETTINGS_WORKSPACE: (workspaceSlug) => {
    return `/settings-workspace/${workspaceSlug}`;
  },
  CREATE_AN_ACCOUNT: (email, workpsaceId) => {
    return `/create-an-account?email=${email}&workspaceId=${workpsaceId}`;
  },
  SIGN_IN: (email, workpsaceId) => {
    return `/sign-in?email=${email}&workspaceId=${workpsaceId}`;
  },
};

const myRoutes = [
  // Privates
  {
    path: "/",
    component: Workspace,
    needAuth: true,
  },
  {
    path: "/w/:workspaceSlug",
    component: Home,
    needAuth: null,
  },
  {
    path: "/w/:workspaceSlug/:listSlug",
    component: Home,
    needAuth: null,
  },
  {
    path: "/settings",
    component: Settings,
    needAuth: true,
  },
  {
    path: "/settings-workspace/:workspaceSlug",
    component: SettingsWorkspace,
    needAuth: true,
  },
  // Publics
  {
    path: "/sign-in",
    component: SignIn,
    needAuth: false,
  },
  {
    path: "/create-an-account",
    component: CreateAnAccount,
    needAuth: false,
  },
  {
    path: "/forgot-password",
    component: ForgotPassword,
    needAuth: false,
  },
  {
    path: "/forgot-password-email",
    component: ForgotPasswordEmail,
    needAuth: false,
  },
  {
    path: "/reset-password/:access_token",
    component: ResetPassword,
    needAuth: false,
  },
  {
    path: "/reset-password-successful",
    component: ResetPasswordSuccessfull,
    needAuth: false,
  },
  {
    path: "/auth-redirect",
    component: AuthRedirect,
    needAuth: null,
  },
  {
    path: "/join-redirect/:email/:workspaceId",
    component: JoinRedirect,
    needAuth: null,
  },
  {
    path: "/email-verification/:email",
    component: EmailVerification,
    needAuth: null,
  },
  {
    path: "*",
    component: NotFound,
    needAuth: false,
  },
];

export default myRoutes;
