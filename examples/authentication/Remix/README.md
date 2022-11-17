# Email & Password Based Authentication Using Remix & Altogic

## Introduction

[Altogic](https://www.altogic.com) is a Backend as a Service (BaaS) platform and provides a variety of services in modern web and mobile development. Most modern applications using Remix or other libraries/frameworks require knowing the identity of a user. And this necessity allows an app to securely save user data and session in the cloud and provide more personalized functionalities and views to users.

Altogic has an authentication service that integrates and implements well in JAMstack apps. It has a ready-to-use [Javascript client library](https://www.npmjs.com/package/altogic), and it supports many authentication providers such as email/password, phone number, magic link, and OAuth providers like Google, Facebook, Twitter, Github, Apple etc.,

In this tutorial, we will implement email/password authentication with Remix and take a look at how as a Remix developer, we build applications and integrate with Altogic Authentication.

After completion of this tutorial, you will learn the following:

- How to create sample screens to display forms like login and signup.
- How to create a home screen and authorize only logged-in users.
- How to create an authentication flow by conditionally rendering between these pages whether a user is logged in.
- How to authenticate users using the magic link
- How to update user profile info and upload a profile picture
- How to manage active sessions of a user
- And we will integrate Altogic authentication with the email/password method.

If you are new to Remix applications, this tutorial is definitely for you to understand the basics and even advanced concepts.

## How email-based sign-up works in Altogic

By default, when you create an app in Altogic, email-based authentication is enabled. In addition, during email-based authentication, the email address of the user is also verified. Below you can find the flow of email and password-based sign-up process.

<Banner
alt="Email & Password based authentication flow"
src="/client/img/quickstart-guides/global/auth-flow.png"
width={650}>
Email & Password based authentication flow
</Banner>

If email verification is disabled, then after step 2, Altogic immediately returns a new session to the user, meaning that steps after step #2 in the above flow are not executed. You can easily configure email-based authentication settings from the **App Settings > Authentication** in Altogic Designer. One critical parameter you need to specify is the Redirect URL, you can customize this parameter from **App Settings > Authentication**. Finally, you can customize the email message template from the **App Settings > Authentication > Messaget Templates**.

:::note
For frontend apps that use server-side rendering, the session token needs to be stored in an HTTP cookie so that the client browser and the frontend server can exchange session information. Otherwise, the session information can be lost, and the Altogic Client library methods that require a session token can fail.
:::

## Prerequisites

To complete this tutorial, make sure you have installed the following tools and utilities on your local development environment.

- [VsCode](https://code.visualstudio.com/download)
- [NodeJS](https://nodejs.org/en/download/)
- [Remix App](https://remix.run/docs/en/v1/tutorials/blog#quickstart)
- You also need an Altogic Account. If you do not have one, you can create an account by [signin up for Altogic](https://designer.altogic.com/).

## Creating an Altogic App

We will use Altogic as a backend service platform, so let’s visit [Altogic Designer](https://designer.altogic.com/) and create an account.

<Banner
alt="Altogic Dashboard"
src="/client/img/quickstart-guides/global/1-applications.png"
width={650} />

After creating an account, you will see the workspace where you can access your apps.

Click + New app and follow the instructions;

1. In the App name field, enter a name for the app.
2. Enter your subdomain.
3. Choose the deployment location.
4. And select your free execution environment pricing plan.

<Banner
alt="Create an Altogic App"
src="/client/img/quickstart-guides/global/2-create-app.png"
width={650} />

Then, click Next and select Basic template. This template creates a default user data model for your app which is required by [**Altogic Client Library**](https://www.altogic.com/client/) to store user data and manage authentication. You can add additional user fields to this data model (e.g., name, surname, gender, birthdate) and when calling the `signUpWithEmail` method of the client library you can pass these additional data.

<Banner
alt="Choose Template"
src="/client/img/quickstart-guides/global/3-choose-template.png"
width={650} />

:::tip
If you do not select the basic template, instead selected the blank app template the user data model will not be created for your app. In order to use the Altogic Client Library's authentication methods you need a user data model to store the user data. You can easily create a new data model manually and from the **App Settings > Authentication** mark this new data model as your user data model.
:::

Then, click Next to confirm and create an app.

Awesome! We have created our application; now click/tap on the **newly created app to launch the Designer.** In order to access the app and use the Altogic client library, we should get `envUrl` and `clientKey` of this app. You can use any one of the API base URLs specified for your app environment as your envUrl.

Click the **Home** icon at the left sidebar to copy the `envUrl` and `clientKey`.

<Banner
alt="Client Library Keys"
src="/client/img/quickstart-guides/global/4-client-keys.png"
width={650} />

Once the user created successfully, our Remix.js app will route the user to the Verification page, and a verification email will be sent to the user’s email address. When the user clicks the link in the mail, the user will navigate to the redirect page to grant authentication rights. After successfully creating a session on the Redirect page, users will be redirected to the Home page.

:::info
If you want, you can deactivate or customize the mail verification from **App Settings -> Authentication** in Altogic Designer.
:::

<Banner
alt="Verification Mail Settings"
src="/client/img/quickstart-guides/global/mail.png"
width={650} />

## Create Remix Project

Make sure you have an up-to-date version of Node.js installed, then run the following command in your command line

```bash
npx create-remix@latest
```

<Banner
alt="Terminal preview"
src="/client/img/quickstart-guides/remix/terminal.png"
width={650} />

Open **altogic-auth-remix** folder in Visual Studio Code:

```bash
code altogic-auth-remix
```

## Integrating With Altogic

Our backend and frontend is now ready and running on the server. ✨

Now, we can install the Altogic client library to our Remix app to connect our frontend with the backend.

```bash
# using npm
npm install altogic
# OR is using yarn
yarn add altogic
```

Let’s create a `libs/` folder inside your `app/` directory to add **altogic.js** file.

Open altogic.js and paste below code block to export the altogic client instance.

```js title="/app/libs/altogic.js"
import { createClient } from "altogic";

const ENV_URL = ""; // replace with your envUrl
const CLIENT_KEY = ""; // replace with your clientKey

const altogic = createClient(ENV_URL, CLIENT_KEY, {
  signInRedirect: "/login",
});

export default altogic;
```

> Replace `ENV_URL` and `CLIENT_KEY` which is shown in the **Home** view of [Altogic Designer](https://designer.altogic.com/).

:::info
`signInRedirect` is the sign in page URL to redirect the user when user's session becomes invalid. Altogic client library observes the responses of the requests made to your app backend. If it detects a response with an error code of missing or invalid session token, it can redirect the users to this signin url.
:::

## Create Routes

Remix has built-in file system routing. It means that we can create a page by creating a file in the `app/routes` directory.
Let's create some pages and directory in `routes/` folder as below:

```
app/
└── routes/
    ├── api/
    │   ├── logout.jsx
    │   └── update-users.jsx
    ├── index.jsx
    ├── login.jsx
    ├── register.jsx
    ├── profile.jsx
    ├── login-with-magic-link.jsx
    └── auth-redirect.jsx
```

<Banner
alt="vscode preview"
src="/client/img/quickstart-guides/remix/pages.png"
width={650} />

### Home Page

In this page, we will show Login, Login With Magic Link and Register buttons.

```jsx title="/app/routes/index.jsx"
import { Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import { requireNoAuth } from "~/utils/auth.server";

export async function loader({ request }) {
  await requireNoAuth(request);
  return json({});
}

export default function Index() {
  return (
    <div className="flex items-center justify-center gap-4 h-screen">
      <Link
        to="/login-with-magic-link"
        className="border px-4 py-2 font-medium text-xl"
      >
        Login With Magic Link
      </Link>
      <Link to="/login" className="border px-4 py-2 font-medium text-xl">
        Login
      </Link>
      <Link to="/register" className="border px-4 py-2 font-medium text-xl">
        Register
      </Link>
    </div>
  );
}
```

### Login Page

In this page, we will show a form to log in with email and password.

We will use **remix's action** call our backend api. We will save session and user info to state and storage if the api returns success. Then, user will be redirected to profile page.

```jsx title="/app/routes/login.jsx"
import { Form, Link, useActionData, useTransition } from "@remix-run/react";
import { createUserSession, requireNoAuth } from "~/utils/auth.server";
import { json } from "@remix-run/node";
import altogic from "~/libs/altogic";

export async function loader({ request }) {
  await requireNoAuth(request);
  return json({});
}

export async function action({ request }) {
  const formData = await request.formData();
  const { email, password } = Object.fromEntries(formData);
  const { session, errors } = await altogic.auth.signInWithEmail(
    email,
    password
  );

  if (errors) {
    return json({ errors });
  }

  altogic.auth.setSession(session);
  return createUserSession(session.token, "/profile");
}
export default function Login() {
  const transition = useTransition();
  const actionData = useActionData();
  const busy = transition.state === "submitting";

  return (
    <section className="flex flex-col items-center justify-center h-96 gap-4">
      <Form method="post" className="flex flex-col gap-2 w-full md:w-96">
        <h1 className="self-start text-3xl font-bold">Login to your account</h1>
        {actionData?.errors && (
          <div className="bg-red-600 text-white text-[13px] p-2">
            {actionData.errors?.items?.map((error, index) => (
              <p key={index}>{error.message}</p>
            ))}
          </div>
        )}

        <input
          name="email"
          type="email"
          placeholder="Type your email"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Type your password"
          required
        />
        <div className="flex justify-between gap-4">
          <Link className="text-indigo-600" to="/register">
            Don't have an account? Register now
          </Link>
          <button
            disabled={!!busy}
            type="submit"
            className="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
          >
            Login
          </button>
        </div>
      </Form>
    </section>
  );
}
```

### Login With Magic Link Page

In this page, we will show a form to **log in with Magic Link** with only email. We will use `altogic.auth.sendMagicLinkEmail()` method to sending magic link to user's email.

When the user clicks on the magic link in the email, Altogic verifies the validity of the magic link and, if successful, redirects the user to the redirect URL specified in your app authentication settings with an access token in a query string parameter named `access_token` The magic link flows in a similar way to the sign-up process. We use the `getAuthGrant()` method to create a new session and associated `sessionToken`.

```jsx title="/app/routes/login-with-magic-link.jsx"
import { Link, useActionData, useFetcher } from "@remix-run/react";
import altogic from "~/libs/altogic";
import { json } from "@remix-run/node";
import { useRef, useEffect } from "react";
export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const { errors } = await altogic.auth.sendMagicLinkEmail(email);
  return json({ errors });
}

export default function LoginWithMagicLink() {
  const actionData = useActionData();
  const fetcher = useFetcher();
  const formRef = useRef(null);
  const isDone = !actionData?.errors && fetcher.type === "done";

  useEffect(() => {
    if (isDone) formRef.current?.reset();
  }, [isDone]);

  return (
    <section className="flex flex-col items-center justify-center h-96 gap-4">
      <fetcher.Form
        ref={formRef}
        method="post"
        className="flex flex-col gap-2 w-full md:w-96"
      >
        <h1 className="self-start text-3xl font-bold">Login with magic link</h1>

        {isDone && (
          <div className="bg-green-600 text-white text-[13px] p-2">
            We have sent you a magic link. Please check your email.
          </div>
        )}

        {actionData?.errors && (
          <div className="bg-red-600 text-white text-[13px] p-2">
            {actionData.errors?.items?.map((error, index) => (
              <p key={index}>{error.message}</p>
            ))}
          </div>
        )}

        <input
          name="email"
          type="email"
          placeholder="Type your email"
          required
        />
        <div className="flex justify-between gap-4 items-start">
          <Link to="/register" className="text-indigo-600">
            Don't have an account? Register now
          </Link>
          <button
            type="submit"
            className="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
          >
            Send magic link
          </button>
        </div>
      </fetcher.Form>
    </section>
  );
}
```

### Register Page

In this page, we will show a form to sign up with email and password. We will use **remix's action** call our backend api.

We will save session and user info to state if the api returns session. Then, user will be redirected to profile page.

If `signUpWithEmail` does not return session, it means user need to confirm email, so we will show the success message.

:::note
`signUpWithEmail` method can accept optional third parameter data to save the user's profile. We will save the user's name to the database in this example.
:::

```jsx title="/app/routes/register.jsx"
import { Form, Link, useActionData, useTransition } from "@remix-run/react";
import { json } from "@remix-run/node";
import altogic from "~/libs/altogic";
import { createUserSession, requireNoAuth } from "~/utils/auth.server";
import { useEffect, useRef } from "react";

export async function loader({ request }) {
  await requireNoAuth(request);
  return json({});
}

export async function action({ request }) {
  const formData = await request.formData();
  const { email, password, name } = Object.fromEntries(formData);
  const { session, errors } = await altogic.auth.signUpWithEmail(
    email,
    password,
    name
  );

  if (errors) {
    return json({ errors });
  }

  if (!session) {
    return json({ needToVerify: true });
  }

  altogic.auth.setSession(session);
  return createUserSession(session.token, "/profile");
}
export default function Register() {
  const transition = useTransition();
  const actionData = useActionData();
  const busy = transition.state === "submitting";
  const formRef = useRef(null);

  useEffect(() => {
    if (actionData?.needToVerify) {
      formRef.current?.reset();
      document.activeElement.blur();
    }
  }, [actionData]);

  return (
    <section className="flex flex-col items-center justify-center h-96 gap-4">
      <Form
        ref={formRef}
        method="post"
        className="flex flex-col gap-2 w-full md:w-96"
      >
        <h1 className="self-start text-3xl font-bold">Create an account</h1>
        {actionData?.needToVerify && (
          <div className="bg-green-500 text-white p-2">
            Your account has been created. Please check your email to verify
            your account.
          </div>
        )}
        {actionData?.errors && (
          <div className="bg-red-600 text-white text-[13px] p-2">
            {actionData.errors?.items?.map((error, index) => (
              <p key={index}>{error.message}</p>
            ))}
          </div>
        )}
        <input
          name="name"
          autoComplete="given-name"
          type="text"
          placeholder="Type your name"
          required
        />
        <input
          name="email"
          autoComplete="email"
          type="email"
          placeholder="Type your email"
          required
        />
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Type your password"
          required
        />
        <div className="flex justify-between gap-4">
          <Link className="text-indigo-600" to="/login">
            Already have an account? Login now
          </Link>
          <button
            disabled={!!busy}
            type="submit"
            className="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
          >
            Create account
          </button>
        </div>
      </Form>
    </section>
  );
}
```

### Auth Redirect Page

In this page we use the `getAuthGrant()` method to create a new session and associated `sessionToken` for verify email or sign in with magic link.

```jsx title="/app/routes/auth-redirect.jsx"
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import altogic from "~/libs/altogic";
import { createUserSession } from "~/utils/auth.server";

export async function loader({ request }) {
  const url = new URL(request.url);
  const accessToken = url.searchParams.get("access_token");

  const { session, errors } = await altogic.auth.getAuthGrant(accessToken);
  if (errors) return json({ errors });
  await createUserSession(session.token, "/profile");
}

export default function AuthRedirect() {
  const { errors } = useLoaderData();
  return (
    <section className="h-screen flex flex-col gap-4 justify-center items-center">
      {errors && (
        <div className="text-center">
          {errors.items?.map((error, index) => (
            <p className="text-red-500 text-3xl" key={index}>
              {error.message}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
```

### Profile Page

In this page, we will show the user's profile, and We will use our sign-out api route.

We will remove session and user info from state and storage if signOut api returns success. Then, user will be redirected to login page.

This page is protected. Before page loaded, We will check cookie. If there is **sessionToken**, and it's valid, we will sign in and fetch user, session information. If there is not or not valid, the user will be redirected to sign in page.

```jsx title="/app/routes/profile.jsx"
import { Link, useLoaderData } from "@remix-run/react";
import {
  getAllSessions,
  getToken,
  getUserByToken,
  requireAuth,
} from "~/utils/auth.server";
import UserInfo from "~/components/UserInfo";
import Avatar from "~/components/Avatar";
import { json } from "@remix-run/node";
import Sessions from "~/components/Sessions";

export async function loader({ request }) {
  await requireAuth(request);
  const { user, errors: userErrors } = await getUserByToken(
    await getToken(request)
  );
  const { sessions, errors: sessionErrors } = await getAllSessions(request);
  if (userErrors || sessionErrors) {
    return json(userErrors || sessionErrors, { status: 401 });
  }
  return json({ user, sessions });
}
export default function Profile() {
  const { user, sessions } = useLoaderData();
  return (
    <div>
      <section className="h-screen py-4 space-y-4 flex flex-col text-center items-center">
        <Avatar user={user} />
        <UserInfo user={user} />
        <Sessions sessions={sessions} />
        <Link
          to="/api/logout"
          className="bg-gray-400 rounded py-2 px-3 text-white"
        >
          Logout
        </Link>
      </section>
    </div>
  );
}
```

### Logout Page (API Route)

In this page we will remove session and user info from state and storage.

```js title="/app/routes/api/logout.jsx"
import { logout } from "~/utils/auth.server";

export const loader = async ({ request }) => {
  return logout(request);
};
```

### Update User Page (API Route)

In this page we will update user's information from database.

```js title="/app/routes/api/update-user.jsx"
import { redirect } from "@remix-run/node";
import { updateUser } from "~/utils/auth.server";

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  return updateUser(request, data);
}

export async function loader() {
  return redirect("/profile");
}
```

## Handling Authentication in Server Side

This is the most important part of the project. We will handle authentication in server side. We will use altogic library to handle authentication in server side.

For client-side (browser) rendered frontend apps, Altogic automatically stores the `sessionToken` in local storage. For server-side rendered frontend apps, since we do not have local storage available, we need to store the `sessionToken` somewhere to check whether the user has been authenticated or not. For this reason, we will store the `sessionToken` in an HTTP cookie named `session` which will be exchanged between the client browser and the front end server.

Remix is a server side rendering tool, we will do some operations on the backend.
So we need to create a folder named `utils/` in our `app/` directory and create a file named `auth.server.js` in it.

### Authentication Utils

In this file, we will create some functions for our authentication system.

For more information about authentication, you can check the [Remix Documentation](https://remix.run/docs/en/v1/tutorials/jokes#authentication).

```js title="/app/utils/auth.server.js"
import { createCookieSessionStorage, json, redirect } from "@remix-run/node";
import altogic from "~/libs/altogic";

export async function logout(request) {
  const session = await getUserSession(request);
  const token = session.get("token");

  altogic.auth.setSession({ token });
  await altogic.auth.signOut(token);

  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set in your environment");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

function getUserSession(request) {
  return storage.getSession(request.headers.get("Cookie"));
}
export async function getToken(request) {
  const session = await getUserSession(request);
  const token = session.get("token");
  if (!token) return null;
  return token;
}
export async function requireAuth(request) {
  const session = await getUserSession(request);
  const token = session.get("token");
  if (!token) {
    throw redirect(`/login`);
  }
  return token;
}
export async function requireNoAuth(request) {
  const session = await getUserSession(request);
  const token = session.get("token");
  if (token) {
    throw redirect(`/profile`);
  }
  return null;
}
export async function createUserSession(token, redirectTo) {
  const session = await storage.getSession();
  session.set("token", token);
  throw redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function getUserFromDbAndWriteToSession(
  request,
  needAuth = false
) {
  const session = await getUserSession(request);
  const { user } = await getUserByToken(session.get("token"));

  session.set("user", user);

  if (needAuth && !user) {
    return redirect("/login", {
      headers: {
        "Set-Cookie": await storage.destroySession(session),
      },
    });
  }

  return json(user, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function getAllSessions(request) {
  const { sessions, errors } = await altogic.auth.getAllSessions();
  const token = await getToken(request);

  if (errors) {
    return { errors };
  }

  return {
    sessions: sessions.map((session) => ({
      ...session,
      isCurrent: session.token === token,
    })),
  };
}

export async function updateUser(request, data) {
  const { user, errors } = await getUserByToken(await getToken(request));
  if (errors) throw errors;
  return altogic.db.model("users").object(user._id).update(data);
}

export function getUserByToken(token) {
  altogic.auth.setSession({ token });
  return altogic.auth.getUserFromDB();
}
```

## Upload Profile Picture

Open Avatar.js and paste the below code to create an avatar for the user.

For convenience, we will be using the user's `_id` as the name of the uploaded file and upload the profile picture to the root directory of our app storage. If needed you can create different buckets for each user or a generic bucket to store all provided photos of users. The Altogic Client Library has all the methods to manage buckets and files.

```jsx title="/app/components/Avatar.js"
import { useState } from "react";
import altogic from "~/libs/altogic";

export default function Avatar({ user }) {
  const [_user, setUser] = useState(user);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const userPicture =
    _user?.profilePicture ?? `https://ui-avatars.com/api/?name=${_user?.name}`;

  async function handleChange(e) {
    const file = e.target.files[0];
    e.target.value = null;
    if (!file) return;
    try {
      setLoading(true);
      setErrorMessage(null);
      const { publicPath } = await updateProfilePicture(file);
      const user = await updateUser({ profilePicture: publicPath });
      setUser(user);
    } catch (e) {
      setErrorMessage(e.message);
    } finally {
      setLoading(false);
    }
  }
  async function updateProfilePicture(file) {
    const { data, errors } = await altogic.storage
      .bucket("root")
      .upload(`user_${_user?._id}`, file);
    if (errors) throw new Error("Couldn't upload file");
    return data;
  }
  async function updateUser(data) {
    const { data: userFromDB, errors } = await altogic.db
      .model("users")
      .object(_user?._id)
      .update(data);
    if (errors) throw new Error("Couldn't update user");
    return userFromDB;
  }

  return (
    <div>
      <figure className="flex flex-col gap-4 items-center justify-center py-2">
        <picture className="border rounded-full w-24 h-24 overflow-hidden">
          <img
            className="object-cover w-full h-full"
            src={userPicture}
            alt={_user?.name}
          />
        </picture>
      </figure>
      <div className="flex flex-col gap-4 justify-center items-center">
        <label className="border p-2 cursor-pointer">
          <span>{loading ? "Uploading..." : "Change Avatar"}</span>
          <input
            onChange={handleChange}
            name="picture"
            disabled={loading}
            className="hidden"
            type="file"
            accept="image/*"
          />
        </label>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </div>
    </div>
  );
}
```

## Update User Info

In this component, we will show and change the user's name.

We use **Remix's API route** `"/api/update-user"` to update the user's name.

```jsx title="/app/components/UserInfo.js"
import { useEffect, useState } from "react";
import { useActionData, useFetcher } from "@remix-run/react";

export default function UserInfo({ user }) {
  const fetcher = useFetcher();
  const [changeMode, setChangeMode] = useState(false);
  const actionData = useActionData();

  const openChangeMode = () => {
    setChangeMode(true);
  };

  useEffect(() => {
    if (fetcher.type === "done") setChangeMode(false);
  }, [fetcher]);

  return (
    <section className="border p-4 w-full">
      {actionData?.name}
      {changeMode ? (
        <fetcher.Form
          method="post"
          action="/api/update-user"
          className="flex items-center justify-center"
        >
          <input
            defaultValue={user.name}
            type="text"
            name="name"
            className="text-3xl text-center"
          />
        </fetcher.Form>
      ) : (
        <div className="space-y-4">
          <h1 className="text-3xl">Hello, {user?.name}</h1>
          <button onClick={openChangeMode} className="border p-2">
            Change name
          </button>
        </div>
      )}
    </section>
  );
}
```

## Manage Sessions

In this component, we will use `altogic.auth.getAllSessions()` method to get the user's sessions and delete them.

```jsx title="/app/components/Sessions.js"
import altogic from "~/libs/altogic";
import { useState } from "react";

export default function Sessions({ sessions }) {
  const [sessionsList, setSessionsList] = useState(sessions);
  altogic.auth.setSession({ token: sessions.find((s) => s.isCurrent).token });

  const logoutSession = async (session) => {
    const { errors } = await altogic.auth.signOut(session.token);
    if (!errors) {
      setSessionsList((prev) => prev.filter((s) => s.token !== session.token));
    }
  };

  return (
    <div className="border p-4 space-y-4">
      <p className="text-3xl">All Sessions</p>
      <ul className="flex flex-col gap-2">
        {sessionsList.map((session) => (
          <li key={session.token} className="flex justify-between gap-12">
            <div>
              {session?.isCurrent ? (
                <span>Current Sessions</span>
              ) : (
                <span>
                  <strong>Device name: </strong>
                  {session?.userAgent?.device?.family}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span>
                {new Date(session.creationDtm).toLocaleDateString("en-US")}
              </span>
              {!session?.isCurrent && (
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
```

## Conclusion

Congratulations!✨

You had completed the most critical part of the Authentication flow, which includes private routes, sign-up, sign-in, and sign-out operations.

If you have any questions about Altogic or want to share what you have built, please post a message in our [community forum](https://community.altogic.com/home) or [discord channel](https://discord.gg/zDTnDPBxRz).
