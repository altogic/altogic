// import Pixel from "./pages/pixel";
// import SignIn from "./pages/auth/sign-in";
// import Home from "./pages/home";
// import NotFound from "./pages/not-found";
// import CreateAnAccount from "./pages/auth/create-an-account";
// import UserArts from "./pages/user-arts";
// import Settings from "./pages/settings";
// import PixelSettings from "./pages/pixel-settings";
// import ForgotPasswordEmail from "./pages/auth/forgot-password-email";
// import ForgotPassword from "./pages/auth/forgot-password";
// import AuthRedirect from "./pages/auth/auth-redirect";
// import ResetPasswordSuccessfull from "./pages/auth/reset-password-successful";
// import ResetPassword from "./pages/auth/reset-password";
// import EmailVerification from "./pages/auth/email-verification";
// import JoinRedirect from "./pages/join-redirect";

export const MyRouter = {
  HOME: "/",
  pixel: (slug) => `/p/${slug}`,
  userArts: (slug) => `/u/${slug}`,
  pixelSettings: (slug) => `/s/${slug}`,
  SIGN_IN: "/sign-in",
  signIn: (email, pixelId) => {
    return `/sign-in?email=${email}&pixelId=${pixelId}`;
  },
  createAnAccount: (email, pixelId) => {
    return `/create-an-account?email=${email}&pixelId=${pixelId}`;
  },
};

// const myRoutes = [
//   // Global
//   {
//     path: "/",
//     component: Home,
//     needAuth: null,
//   },
//   {
//     path: "/p/:pixelSlug",
//     component: Pixel,
//     needAuth: null,
//   },
//   {
//     path: "/u/:userSlug",
//     component: UserArts,
//     needAuth: null,
//   },
//   {
//     path: "*",
//     component: NotFound,
//     needAuth: null,
//   },
//   {
//     path: "/auth-redirect",
//     component: AuthRedirect,
//     needAuth: null,
//   },
//   {
//     path: "/email-verification/:email",
//     component: EmailVerification,
//     needAuth: null,
//   },
//   {
//     path: "/join-redirect/:email/:pixelId",
//     component: JoinRedirect,
//     needAuth: null,
//   },
//   // Need auth
//   {
//     path: "/settings",
//     component: Settings,
//     needAuth: true,
//   },
//   {
//     path: "/s/:pixelSlug",
//     component: PixelSettings,
//     needAuth: true,
//   },
//   // Don't need auth
//   {
//     path: "/create-an-account",
//     component: CreateAnAccount,
//     needAuth: false,
//   },
//   {
//     path: "/sign-in",
//     component: SignIn,
//     needAuth: false,
//   },
//   {
//     path: "/forgot-password",
//     component: ForgotPassword,
//     needAuth: false,
//   },
//   {
//     path: "/forgot-password-email",
//     component: ForgotPasswordEmail,
//     needAuth: false,
//   },
//   {
//     path: "/reset-password-successful",
//     component: ResetPasswordSuccessfull,
//     needAuth: false,
//   },
//   {
//     path: "/reset-password/:access_token",
//     component: ResetPassword,
//     needAuth: false,
//   },
// ];

// export default myRoutes;
