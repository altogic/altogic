# Email & Password Based Authentication Using React & Altogic

## Introduction
**Altogic** is a Backend as a Service (BaaS) platform and provides a variety of services in modern web and mobile development. Most of the modern applications using React or other libraries/frameworks require to know the identity of a user. And this necessity allows an app to securely save user data and session in the cloud and provide more personalized functionalities and views to users.

Altogic has an Authentication service that integrates and implements well in JAMstack apps. It has a ready-to-use Javascript client library, and it supports many authentication providers such as email/password, phone number, magic link, and OAuth providers like Google, Facebook, Twitter, Github, Apple, etc.,

In this tutorial, we will implement email/password authentication with React and take a look how as a React developer we build applications and integrate with Altogic Authentication.

After completion of this tutorial, you will learn:

* How to create sample screens to display forms like login and signup.
* How to create a home screen and authorize only logged-in users.
* How to create different routes using the react-router-dom.
* How to create an authentication flow by conditionally rendering between these pages whether a user is logged-in or not.
* How to authenticate users using magic link
* How to update user profile info and upload a profile picture
* And we will integrate Altogic authentication with the email/password method.

If you are new to React applications, this tutorial is definitely for you to understand the basics and even advanced concepts.

## How email-based sign-up works in Altogic
By default, when you create an app in Altogic, email-based authentication is enabled. In addition, during email-based authentication, the user's email address is also verified. Below you can find the flow of email and password-based sign-up process.

![Auth Flow](github/13-auth-flow.png)

If email verification is disabled, then after step 2, Altogic immediately returns a new session to the user, meaning that steps after step #2 in the above flow are not executed. You can easily configure email-based authentication settings from the App Settings > Authentication in Altogic Designer. You need to specify one critical parameter, the Redirect URL; you can customize this parameter from App Settings > Authentication. Finally, you can customize the email message template from the App Settings > Authentication > Message Templates.

> For frontend apps that use server-side rendering, the session token needs to be stored in an HTTP cookie so that the client browser and the frontend server can exchange session information. Otherwise, the session information can be lost, and the Altogic Client library methods that require a session token can fail.

## Prerequisites
To complete this tutorial, ensure you have installed the following tools and utilities on your local development environment.

- [VsCode](https://code.visualstudio.com/download)
- [NodeJS](https://nodejs.org/en/download/)
- [React](https://reactjs.org/)
- You also need an Altogic Account. If you do not have one, you can create an account by [signin up for Altogic](https://designer.altogic.com/).

## Creating an Altogic App
After creating an account, you will see the workspace where you can access your apps.

![Application](github/1-applications.png)

Click + New app and follow the instructions;

1. In the App name field, enter a name for the app.
2. Enter your subdomain.
3. Choose the deployment location.
4. And select your free execution environment pricing plan.

![Create App](github/2-create-app.png)

Then click Next and select Basic template. **This template creates a default user data model for your app which is required by [Altogic Client Library](https://www.npmjs.com/package/altogic) to store user data and manage authentication.** You can add additional user fields to this data model (e.g., name, surname, gender, birthdate) and when calling the `signUpWithEmail` method of the client library you can pass these additional data.

![Choose Template](github/3-choose-template.png)

> **Tip:** If you do not select the basic template, instead selected the blank app template the user data model will not be created for your app. In order to use the Altogic Client Library's authentication methods you need a user data model to store the user data. You can easily create a new data model manually and from the **App Settings > Authentication** mark this new data model as your user data model. 

Then click Next to confirm and create an app.

Awesome! We have created our application; now click/tap on the <strong>newly created app to launch the Designer.</strong> In order to access the app and use the Altogic client library, we should get `envUrl` and `clientKey` of this app. You can use any one of the API base URLs specified for your app environment as your envUrl.

Click the <strong>Home</strong> icon at the left sidebar to copy the `envUrl` and `clientKey`.

![Client Keys](github/4-client-keys.png)

Once the user created successfully, our React app will route the user to the Verification page, and a verification email will be sent to the user’s email address. When the user clicks the link in the mail, the user will navigate to the redirect page to grant authentication rights. After successfully creating a session on the Redirect page, users will be redirected to the Home page.

> If you want, you can deactivate or customize the mail verification from **App Settings -> Authentication** in Logic Designer.

![Mail](github/15-mail.png)

We have changed the redirect URL to `http://localhost:3000/auth-redirect`

## Create a React project
```bash
npx create-react-app
```

## Integrating with Altogic
Our backend and frontend is now ready and running on the server. ✨

Now, we can install the Altogic client library to our React app to connect our frontend with the backend.

```bash
# using npm
npm install altogic
# OR is using yarn
yarn add altogic
```

Let’s create a configs/ folder inside of the src/ directory to add `altogic.js` file.

Open `altogic.js` and paste below code block to export the altogic client instance.

`/src/configs/altogic.js`

```javascript
// /src/configs/altogic.js
import { createClient } from "altogic";

// This `envUrl` and `clientKey` is sample you need to create your own.
let envUrl = "https://auth.c1-na.altogic.com";
let clientKey = "e574fee1fb2b443...a8598ca68b7d8";

const altogic = createClient(envUrl, clientKey, {
  signInRedirect: "/sign-in",
});

export default altogic;
```

> Replace envUrl and clientKey which is shown in the <strong>Home</strong> view of [Altogic Designer](https://designer.altogic.com/).

> `signInRedirect` is the sign in page URL to redirect the user when user's session becomes invalid. Altogic client library observes the responses of the requests made to your app backend. If it detects a response with an error code of missing or invalid session token, it can redirect the users to this signin url.

## Create an Authentication Context
We need to share data across our components. We can use this hook throughout our application by creating an authentication context. Passing down the authentication status to each component is redundant. It leads to prop drilling, so using context is a good option. If you are not familiar with Context API in React, check out their docs [here](https://reactjs.org/docs/context.html).

> The React Context API is a state management tool used for sharing data across React components.

Let’s create contexts/ folder inside of the src/ directory to add `Auth.context.js` file inside it.

Open `Auth.context.js` and copy following code.
```javascript
// /src/contexts/Auth.context.js
import React, { useState, useEffect, useContext } from "react";
import altogic from "../configs/altogic";

const Context = React.createContext(null);

const useFetchAuth = () => {
  const [fetchedAuth, setFetchedAuth] = useState(undefined);
  const [fetchedSession, setFetchedSession] = useState(undefined);

  useEffect(() => {
    // Check if user information is exist in storage
    const userFromStorage = altogic.auth.getUser();
    setFetchedAuth(userFromStorage);

    // Check if session information is exist in storage
    const sessionFromStorage = altogic.auth.getSession();
    setFetchedSession(sessionFromStorage);
  }, []);

  return { fetchedAuth, fetchedSession };
};

const Provider = ({ children }) => {
  const { fetchedAuth, fetchedSession } = useFetchAuth();

  const [auth, setAuth] = useState(fetchedAuth);
  const [session, setSession] = useState(fetchedSession);

  useEffect(() => {
    // Set user information to auth state if it's exist in storage
    setAuth(fetchedAuth);
  }, [fetchedAuth]);
  useEffect(() => {
    // Set user information to storage when auth state's changed
    altogic.auth.setUser(auth);
  }, [auth]);

  useEffect(() => {
    // Set session information to auth state if it's exist in storage
    setSession(fetchedSession);
  }, [fetchedSession]);
  useEffect(() => {
    // Set session information to storage when auth state's changed
    altogic.auth.setSession(session);
  }, [session]);

  return (
    <Context.Provider
      value={{
        auth,
        setAuth,
        session,
        setSession,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(Context);
  return context;
};

export default Provider;
```

## Create Routes

### Private Route Component
To secure the application and authorize users to access specified routes let’s create components/ folder inside of the src/ directory to add `PrivateRoute.js` and paste the code below.

```javascript
// /src/components/PrivateRoute.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/Auth.context";

function PrivateRoute({ children }) {
  const { auth } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth === null) {
      // Navigate to sign in, if the user has not session
      navigate("/sign-in");
    }
  }, [auth]);

  return (
    <div>
      {auth === undefined ? (
        <div>Loading...</div>
      ) : auth ? (
        children
      ) : (
        <div>You are redirecting to the login...</div>
      )}
    </div>
  );
}

export default PrivateRoute;
```

> Previously we have created our authentication context to use user information. And, here, we are controlling session to route users, whether the Login page or the children.

Now we can wrap necessary routes with the PrivateRoute component to specify access in the `App.js`. Let’s open it and wrap our Profile page with the PrivateRoute as the screen below.

> Firstly, you need to install [React Router Dom](https://reactrouter.com/en/main). It's a routing library for react applications.

Here also you can copy the code;

```js
// /src/App.js
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

import AuthProvider from "./contexts/Auth.context";
import AuthRedirectView from "./pages/auth-redirect";
import IndexView from "./pages/index";
import MagicLinkView from "./pages/magic-link";
import ProfileView from "./pages/profile";
import SignInView from "./pages/sign-in";
import SignUpView from "./pages/sign-up";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<IndexView />} />
          <Route path="/auth-redirect" element={<AuthRedirectView />} />
          <Route path="/magic-link" element={<MagicLinkView />} />
          <Route path="/sign-in" element={<SignInView />} />
          <Route path="/sign-up" element={<SignUpView />} />
          {/* Private Routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfileView />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
```

Let's create some views in **src/pages/** folder as below:
* index.js
* sign-in.js
* sign-up.js
* auth-redirect.js
* magic-link.js
* profile.js

![Foldering](github/14-foldering.png)

### Index Page
In this page, we will show Login, Login With Magic Link and Register buttons.

Replacing `pages/index.js` with the following code:
```javascript
// /src/pages/index.js
import { Link } from "react-router-dom";

function IndexView() {
  return (
    <div className="flex items-center justify-center gap-4 h-screen">
      <Link className="border px-4 py-2 font-medium text-xl" to="/magic-link">
        Login With Magic Link
      </Link>
      <Link className="border px-4 py-2 font-medium text-xl" to="/sign-in">
        Sign In
      </Link>
      <Link className="border px-4 py-2 font-medium text-xl" to="/sign-up">
        Sign Up
      </Link>
    </div>
  );
}
export default IndexView;
```

### Login Page
On this page, we will show a form to log in with your email and password. We will use Altogic's `altogic.auth.signInWithEmail()` function to log in. We will save the session and user info to state and storage if the `signInWithEmail` function returns success. Then the user will be redirected to the profile page.

Replacing `pages/sign-in.js` with the following code:
```javascript
// /src/pages/sign-in.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import altogic from "../configs/altogic";
import { useAuthContext } from "../contexts/Auth.context";

function SignInView() {
  const { setAuth, setSession } = useAuthContext();
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    const [email, password] = e.target;
    try {
      setLoading(true);
      const { user, session, errors } = await altogic.auth.signInWithEmail(
        email.value,
        password.value
      );

      if (errors) {
        throw errors;
      }

      setAuth(user);
      setSession(session);
      navigate("/profile");
    } catch (err) {
      setLoading(false);
      setError(err.items);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center h-96 gap-4">
      <form
        className="flex flex-col gap-2 w-full md:w-96"
        onSubmit={handleSignIn}
      >
        <h1 className="self-start text-3xl font-bold">Login to your account</h1>
        {error?.map(({ message }) => (
          <div key={message} className="bg-red-600 text-white text-[13px] p-2">
            <p>{message}</p>
          </div>
        ))}

        <input type="email" placeholder="Type your email" />
        <input
          autoComplete="new-password"
          type="password"
          placeholder="Type your password"
        />
        <div className="flex justify-between gap-4">
          <Link className="text-indigo-600" to="/sign-up">
            Don't have an account? Register now
          </Link>
          <button
            type="submit"
            className="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
            disabled={loading}
          >
            Login
          </button>
        </div>
      </form>
    </section>
  );
}

export default SignInView;
```

### Register Page
On this page, we will show a form to sign up with email and password. We will use Altogic's `altogic.auth.signUpWithEmail()` function to log in.

We will save the session and user info to state and storage if the `signUpWithEmail` function returns the user. The user will be redirected to the profile page.

If `signUpWithEmail` does not return the user, it means the user must confirm the email so we will show the success message.

> `signUpWithEmail` function can accept optional  third parameter data to save the user's profile. We will save the user's name to the database in this example.

Replacing `pages/sign-up.js` with the following code:
```javascript
// /src/pages/sign-up.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import altogic from "../configs/altogic";
import { useAuthContext } from "../contexts/Auth.context";

function SignUpView() {
  const { setAuth, setSession } = useAuthContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    const [name, email, password] = e.target;
    try {
      setLoading(true);
      const { user, session, errors } = await altogic.auth.signUpWithEmail(
        name.value,
        email.value,
        password.value
      );

      if (errors) {
        throw errors;
      }

      if (session) {
        setAuth(user);
        setSession(session);
        navigate("/profile");
      } else {
        setSuccess(`We sent a verification link to ${email.value}`);
        setError(null);
        setLoading(false);
        name.value = "";
        email.value = "";
        password.value = "";
      }
    } catch (err) {
      setSuccess(null);
      setError(err.items);
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center h-96 gap-4">
      <form
        className="flex flex-col gap-2 w-full md:w-96"
        onSubmit={handleSignUp}
      >
        <h1 className="self-start text-3xl font-bold">Create an account</h1>
        {success && (
          <div className="bg-green-500 text-white p-2">{success}</div>
        )}
        {error?.map(({ message }) => (
          <div key={message} className="bg-red-600 text-white text-[13px] p-2">
            <p>{message}</p>
          </div>
        ))}

        <input type="text" placeholder="Type your name" />
        <input type="email" placeholder="Type your email" />
        <input
          autoComplete="new-password"
          type="password"
          placeholder="Type your password"
        />
        <div className="flex justify-between gap-4">
          <Link className="text-indigo-600" to="/sign-in">
            Already have an account?
          </Link>
          <button
            type="submit"
            className="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
            disabled={loading}
          >
            Register
          </button>
        </div>
      </form>
    </section>
  );
}

export default SignUpView;
```

### Profile Page
On this page, we will show the user's profile and use Altogic's `altogic.auth.signOut()` function to log out.

We will remove session and user info from state and storage if the `signOut` function returns success. The user will be redirected to the login page.

Replacing `pages/profile.js` with the following code:
```javascript
// /src/pages/profile.js
import { useNavigate } from "react-router-dom";
import Avatar from "../components/Avatar";
import Sessions from "../components/Sessions";
import UserInfo from "../components/UserInfo";
import altogic from "../configs/altogic";
import { useAuthContext } from "../contexts/Auth.context";

function ProfileView() {
  const { setAuth, setSession } = useAuthContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { errors } = await altogic.auth.signOut();

      if (errors) {
        throw errors;
      }

      setSession(null);
      setAuth(null);
      navigate("/sign-in");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="h-screen py-4 space-y-4 flex flex-col text-center items-center">
      <Avatar />
      <UserInfo />
      <Sessions />
      <button
        className="bg-gray-400 rounded py-2 px-3 text-white"
        onClick={handleSignOut}
      >
        Sign Out
      </button>
    </section>
  );
}

export default ProfileView;
```

### Auth Redirect Page
We use this page to verify the user's email address and process magic link. This is the page where the user is redirected when clicked on the sign-up email confirmation link or the magic link.

We will use Altogic's `altogic.auth.getAuthGrant()` function to log in with the handled access_token from the URL and use this access_token to create a new user session and associated `sessionToken`.

Replacing `pages/auth-redirect.js` with the following code:
```javascript
// /src/pages/auth-redirect.js
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import altogic from "../configs/altogic";
import { useAuthContext } from "../contexts/Auth.context";

function AuthRedirectView() {
  const { setAuth, setSession } = useAuthContext();
  const { search } = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(search);
  const access_token = query.get("access_token");

  const handleToken = async () => {
    const { user, session } = await altogic.auth.getAuthGrant(access_token);

    if (user) {
      setAuth(user);
      setSession(session);
      navigate("/profile");
    } else {
      navigate("/sign-in");
    }
  };

  useEffect(() => {
    handleToken();
  }, []);

  return (
    <div>
      <div>Redirecting...</div>
    </div>
  );
}

export default AuthRedirectView;
```

### Magic Link Page
On this page, we will show a form to log in with Magic Link with only email. We will use Altogic's `altogic.auth.sendMagicLinkEmail()` function to log in.

When the user clicks on the magic link in the email, Altogic verifies the validity of the magic link and, if successful, redirects the user to the redirect URL specified in your app authentication settings with an access token in a query string parameter named `access_token.` The magic link flows in a similar way to the sign-up process. We use the `getAuthGrant` method explained above to create a new session and associated `sessionToken`.

```javascript
// /src/pages/magic-link.js
import { useState } from "react";
import { Link } from "react-router-dom";
import altogic from "../configs/altogic";

function MagicLinkView() {
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loginHandler(e) {
    e.preventDefault();
    const [email] = e.target;
    setLoading(true);
    setErrors(null);

    const { errors: apiErrors } = await altogic.auth.sendMagicLinkEmail(
      email.value
    );
    setLoading(false);

    if (apiErrors) {
      setErrors(apiErrors.items);
    } else {
      email.value = "";
      setSuccess("Email sent! Check your inbox.");
    }
  }

  return (
    <section className="flex flex-col items-center justify-center h-96 gap-4">
      <form
        className="flex flex-col gap-2 w-full md:w-96"
        onSubmit={loginHandler}
      >
        <h1 className="self-start text-3xl font-bold">Login with magic link</h1>
        {success && (
          <div className="bg-green-600 text-white text-[13px] p-2">
            {success}
          </div>
        )}
        {errors && (
          <div className="bg-red-600 text-white text-[13px] p-2">
            {errors.map(({ message }) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        )}

        <input type="email" placeholder="Type your email" />
        <div className="flex justify-between gap-4">
          <Link className="text-indigo-600" to="/sign-up">
            Don't have an account? Register now
          </Link>
          <button
            disabled={loading}
            type="submit"
            className="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
          >
            Send magic link
          </button>
        </div>
      </form>
    </section>
  );
}

export default MagicLinkView;
```

## Updating User Info
In these component, we will use Altogic's database operations to update user fields and manage sessions.

Let's create some components in the **src/components/** folder as below:
* UserInfo.js
* Sessions.js
  
Replacing `components/UserInfo.js` with the following code:
```js
// /src/components/UserInfo.js
import { useRef, useState } from "react";
import altogic from "../configs/altogic";
import { useAuthContext } from "../contexts/Auth.context";

function UserInfo() {
  const { auth, setAuth } = useAuthContext();
  const inputRef = useRef();

  const [name, setName] = useState("");

  const [changeMode, setChangeMode] = useState(false);
  const [errors, setErrors] = useState(null);

  const handleNameChange = () => {
    setChangeMode(true);
    setTimeout(() => {
      inputRef.current.focus();
    }, 100);
  };

  const handleKeyDown = async (e) => {
    if (e.code === "Enter") {
      setErrors(null);

      const { data: updatedUser, errors: apiErrors } = await altogic.db
        .model("users")
        .object(auth._id)
        .update({ name });

      if (apiErrors) setErrors(apiErrors.items[0].message);
      else setAuth(updatedUser);

      setChangeMode(false);
    }
  };

  return (
    <section className="border p-4 w-full">
      {changeMode ? (
        <div className="flex items-center justify-center">
          <input
            ref={inputRef}
            onKeyDown={handleKeyDown}
            type="text"
            className="border-none text-3xl text-center"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <h1 className="text-3xl">Hello, {auth?.name}</h1>
          <button onClick={handleNameChange} className="border p-2">
            Change name
          </button>
        </div>
      )}
      {errors && <div>{errors}</div>}
    </section>
  );
}

export default UserInfo;
```

Replacing `components/Sessions.js` with the following code:
```js
// /src/components/Sessions.js
import { useEffect, useState } from "react";
import altogic from "../configs/altogic";
import { useAuthContext } from "../contexts/Auth.context";

function Sessions() {
  const {
    session: { token },
  } = useAuthContext();
  const [sessions, setSessions] = useState([]);

  const getAllSessions = async () => {
    const { sessions } = await altogic.auth.getAllSessions();

    const sessionList = sessions.map((session) =>
      session.token === token ? { ...session, isCurrent: true } : session
    );
    setSessions(sessionList);
  };

  const logoutSession = async (session) => {
    const { errors } = await altogic.auth.signOut(session.token);
    if (!errors) {
      setSessions(sessions.filter((s) => s.token !== session.token));
    }
  };

  useEffect(() => {
    getAllSessions();
  }, []);

  return (
    <div className="border p-4 space-y-4">
      <p className="text-3xl">All Sessions</p>
      <ul className="flex flex-col gap-2">
        {sessions?.map((session) => (
          <li key={session.token} className="flex justify-between gap-12">
            <div>
              {session.isCurrent && <span> Current Session </span>}
              <span>
                {" "}
                <strong>Device name: </strong>
                {session?.userAgent.device.family}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>
                {new Date(session.creationDtm).toLocaleDateString("en-US")}
              </span>
              {!session.isCurrent && (
                <button
                  onClick={() => logoutSession(session)}
                  className="border grid place-items-center p-2 h-8 w-8 aspect-square leading-none"
                >
                  X
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sessions;
```

## Bonus: Upload Profile Photo
Let's create an Avatar component for users can upload a profile photo.

Open `Avatar.js` and paste the below code to create an avatar for the user. For convenience, we will be using the user's `_id` as the uploaded file's name and uploading the profile picture to the root directory of our app storage. If needed, you can create different buckets for each user or a generic bucket to store all provided photos of users. The Altogic Client Library has all the methods to manage buckets and files.

```javascript
// /src/components/Avatar.js
import { useState } from "react";
import altogic from "../configs/altogic";
import { useAuthContext } from "../contexts/Auth.context";

function Avatar() {
  const { auth, setAuth } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    e.target.value = null;
    if (!file) return;
    try {
      setLoading(true);
      setErrors(null);
      const { publicPath } = await updateProfilePicture(file);
      const updatedUser = await updateUser({ profilePicture: publicPath });
      setAuth(updatedUser);
    } catch (e) {
      setErrors(e.message);
    } finally {
      setLoading(false);
    }
  };
  const updateProfilePicture = async (file) => {
    const { data, errors } = await altogic.storage
      .bucket("root")
      .upload(`user_${auth._id}`, file);
    if (errors) throw new Error("Couldn't upload file");
    return data;
  };
  const updateUser = async (data) => {
    const { data: updatedUser, errors } = await altogic.db
      .model("users")
      .object(auth._id)
      .update(data);
    if (errors) throw new Error("Couldn't update user");
    return updatedUser;
  };

  return (
    <div>
      <figure className="flex flex-col gap-4 items-center justify-center py-2">
        <picture className="border rounded-full w-24 h-24 overflow-hidden">
          <img
            className="object-cover w-full h-full"
            src={
              auth?.profilePicture ||
              `https://ui-avatars.com/api/?name=${auth?.name}&background=0D8ABC&color=fff`
            }
            alt={auth?.name}
          />
        </picture>
      </figure>
      <div className="flex flex-col gap-4 justify-center items-center">
        <label className="border p-2 cursor-pointer">
          <span>{loading ? "Uploading..." : "Change Avatar"}</span>

          <input
            disabled={loading}
            className="hidden"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
        {errors && <div className="bg-red-500 p-2 text-white">{errors}</div>}
      </div>
    </div>
  );
}

export default Avatar;
```

## Conclusion
Congratulations!✨

You had completed the most critical part of the Authentication flow, which includes private routes, sign-up, sign-in, and sign-out operations.

If you have any questions about Altogic or want to share what you have built, please post a message in our [community forum](https://community.altogic.com/home) or [discord channel](https://discord.gg/zDTnDPBxRz).

