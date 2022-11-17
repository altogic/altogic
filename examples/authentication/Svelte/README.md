# Email & Password Based Authentication Using Svelte & Altogic

## Introduction
**Altogic** is a Backend as a Service (BaaS) platform and provides a variety of services in modern web and mobile development. Most of the modern applications using Svelte or other libraries/frameworks require to know the identity of a user. And this necessity allows an app to securely save user data and session in the cloud and provide more personalized functionalities and views to users.

Altogic has an Authentication service that integrates and implements well in JAMstack apps. It has a ready-to-use Javascript client library, and it supports many authentication providers such as email/password, phone number, magic link, and OAuth providers like Google, Facebook, Twitter, Github, Apple, etc.,

In this tutorial, we will implement email/password authentication with Svelte and take a look how as a Svelte developer we build applications and integrate with Altogic Authentication.

After completion of this tutorial, you will learn:

* How to create sample screens to display forms like login and signup.
* How to create a home screen and authorize only logged-in users.
* How to create different routes using the svelte-navigator.
* How to create an authentication flow by conditionally rendering between these pages whether a user is logged-in or not.
* How to authenticate users using magic link
* How to update user profile info and upload a profile picture
* And we will integrate Altogic authentication with the email/password method.

If you are new to Svelte applications, this tutorial is definitely for you to understand the basics and even advanced concepts.

## How email-based sign-up works in Altogic
By default, when you create an app in Altogic, email-based authentication is enabled. In addition, during email-based authentication, the user's email address is also verified. Below you can find the flow of email and password-based sign-up process.

![Auth Flow](github/13-auth-flow.png)

If email verification is disabled, then after step 2, Altogic immediately returns a new session to the user, meaning that steps after step #2 in the above flow are not executed. You can easily configure email-based authentication settings from the App Settings > Authentication in Altogic Designer. You need to specify one critical parameter, the Redirect URL; you can customize this parameter from App Settings > Authentication. Finally, you can customize the email message template from the App Settings > Authentication > Message Templates.

> For frontend apps that use server-side rendering, the session token needs to be stored in an HTTP cookie so that the client browser and the frontend server can exchange session information. Otherwise, the session information can be lost, and the Altogic Client library methods that require a session token can fail.

## Prerequisites
To complete this tutorial, ensure you have installed the following tools and utilities on your local development environment.

- [VsCode](https://code.visualstudio.com/download)
- [NodeJS](https://nodejs.org/en/download/)
- [Svelte](https://svelte.dev/)
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

Once the user created successfully, our Svelte app will route the user to the Verification page, and a verification email will be sent to the user’s email address. When the user clicks the link in the mail, the user will navigate to the redirect page to grant authentication rights. After successfully creating a session on the Redirect page, users will be redirected to the Home page.

> If you want, you can deactivate or customize the mail verification from **App Settings -> Authentication** in Logic Designer.

![Mail](github/15-mail.png)

We have changed the redirect URL to `http://localhost:5173/auth-redirect`

## Create a Svelte project
```bash
npm create vite@latest myapp -- --template svelte
```

## Integrating with Altogic
Our backend and frontend is now ready and running on the server. ✨

Now, we can install the Altogic client library to our Svelte app to connect our frontend with the backend.

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

export const altogic = createClient(envUrl, clientKey, {
  signInRedirect: "/sign-in",
});
```

> Replace envUrl and clientKey which is shown in the <strong>Home</strong> view of [Altogic Designer](https://designer.altogic.com/).

> `signInRedirect` is the sign in page URL to redirect the user when user's session becomes invalid. Altogic client library observes the responses of the requests made to your app backend. If it detects a response with an error code of missing or invalid session token, it can redirect the users to this signin url.

## Create an Authentication Store
We need to share data across our components. We can use these functions throughout our application by creating an authentication store. Passing down the authentication status to each component is redundant. It leads to prop drilling, so using context is a good option. If you are not familiar with state management in Svelte, check out their docs [here](https://svelte.dev/tutorial/writable-stores).

Let’s create store/ folder inside of the src/ directory to add `auth.store.js` file inside it.

Open `auth.store.js` and copy following code.
```javascript
// src/store/auth.store.js
import { altogic } from "../configs/altogic";
import { writable } from "svelte/store";

export const authStore = writable(undefined);
export const sessionStore = writable(undefined);

// Check if user information is exist in storage
const userFromStorage = altogic.auth.getUser();
authStore.set(userFromStorage);
// Check if session information is exist in storage
const sessionFromStorage = altogic.auth.getSession();
sessionStore.set(sessionFromStorage);

// Set user information to storage when auth state's changed
authStore.subscribe((value) => {
  altogic.auth.setUser(value);
});
// Set session information to storage when session state's changed
sessionStore.subscribe((value) => {
  altogic.auth.setSession(value);
});
```

## Create Routes

### Private Route Component
To secure the application and authorize users to access specified routes let’s create components/ folder inside of the src/ directory to add `PrivateRoute.svelte` and paste the code below.

```js
// /src/components/PrivateRoute.svelte
<script>
  import { afterUpdate } from "svelte";
  import { authStore } from "../store/auth.store";

  afterUpdate(() => {
    if ($authStore === null) {
      // Navigate to sign in, if the user has not session
      window.location.href = "/sign-in";
    }
  });
</script>

<div>
  {#if $authStore}
    <slot />
  {:else}
    <div>Loading...</div>
  {/if}
</div>
```

> Previously we have created our authentication store to use user information. And, here, we are controlling session to route users, whether the Login page or the children.

Now we can wrap necessary routes with the PrivateRoute component to specify access in the `App.svelte`. Let’s open it and wrap our Profile page with the PrivateRoute as the screen below.

> Firstly, you need to install [Svelte Navigator](https://github.com/mefechoel/svelte-navigator#readme). It's a routing library for svelte applications.

Here also you can copy the code;

```js
// /src/App.svelte
<script>
  import { Router, Route, Link } from "svelte-navigator";
  import PrivateRoute from "./components/PrivateRoute.svelte";
  import IndexView from "./routes/index.svelte";
  import AuthRedirectView from "./routes/auth-redirect.svelte";
  import MagicLinkView from "./routes/magic-link.svelte";
  import SignInView from "./routes/sign-in.svelte";
  import SignUpView from "./routes/sign-up.svelte";
  import ProfileView from "./routes/profile.svelte";
</script>

<Router>
  <!-- Public Routes -->
  <Route path="/"><IndexView /></Route>
  <Route path="/auth-redirect"><AuthRedirectView /></Route>
  <Route path="/magic-link"><MagicLinkView /></Route>
  <Route path="/sign-in"><SignInView /></Route>
  <Route path="/sign-up"><SignUpView /></Route>
  <!-- Private Routes -->
  <Route path="/profile">
    <PrivateRoute>
      <ProfileView />
    </PrivateRoute>
  </Route>
</Router>
```

### Index Page
In this page, we will show Login, Login With Magic Link and Register buttons.

Replacing `routes/index.svelte` with the following code:
```javascript
// /src/routes/index.svelte
<div class="flex items-center justify-center gap-4 h-screen">
	<a class="border px-4 py-2 font-medium text-xl" href="/magic-link"> Login With Magic Link </a>
	<a class="border px-4 py-2 font-medium text-xl" href="/sign-in">Sign In</a>
	<a class="border px-4 py-2 font-medium text-xl" href="/sign-up">Sign Up</a>
</div>
```

Let's create some views in **src/routes/** folder as below:
* index.svelte
* sign-in.svelte
* sign-up.svelte
* auth-redirect.svelte
* magic-link.svelte
* profile.svelte

### Login Page
On this page, we will show a form to log in with your email and password. We will use Altogic's `altogic.auth.signInWithEmail()` function to log in. We will save the session and user info to state and storage if the `signInWithEmail` function returns success. Then the user will be redirected to the profile page.

Replacing `routes/sign-in.svelte` with the following code:
```javascript
// /src/routes/sign-in.svelte
<script>
  import { authStore, sessionStore } from "../store/auth.store";
  import { altogic } from "../configs/altogic";

  let loading = false;
  let errors = null;

  const handleSignIn = async (e) => {
    e.preventDefault();
    const [email, password] = e.target;
    try {
      loading = true;

      const {
        user,
        session,
        errors: apiErrors,
      } = await altogic.auth.signInWithEmail(email.value, password.value);

      if (apiErrors) {
        throw apiErrors;
      }

      authStore.set(user);
      sessionStore.set(session);
      window.location.href = "/profile";
    } catch (err) {
      errors = err.items;
      loading = false;
    }
  };
</script>

<section class="flex flex-col items-center justify-center h-96 gap-4">
  <form class="flex flex-col gap-2 w-full md:w-96" on:submit={handleSignIn}>
    <h1 class="self-start text-3xl font-bold">Login to your account</h1>
    {#if errors}
      <div class="bg-red-600 text-white text-[13px] p-2">
        {#each errors as { message }}
          <p>{message}</p>
        {/each}
      </div>
    {/if}

    <input type="email" placeholder="Type your email" />
    <input
      autoComplete="new-password"
      type="password"
      placeholder="Type your password"
    />
    <div class="flex justify-between gap-4">
      <a class="text-indigo-600" href="/sign-up"
        >Don't have an account? Register now</a
      >
      <button
        type="submit"
        class="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
        disabled={loading}
      >
        Login
      </button>
    </div>
  </form>
</section>
```

### Register Page
On this page, we will show a form to sign up with email and password. We will use Altogic's `altogic.auth.signUpWithEmail()` function to log in.

We will save the session and user info to state and storage if the `signUpWithEmail` function returns the user. The user will be redirected to the profile page.

If `signUpWithEmail` does not return the user, it means the user must confirm the email so we will show the success message.

> `signUpWithEmail` function can accept optional  third parameter data to save the user's profile. We will save the user's name to the database in this example.

Replacing `routes/sign-up.svelte` with the following code:
```javascript
// /src/routes/sign-up.svelte
<script>
  import { authStore, sessionStore } from "../store/auth.store";
  import { altogic } from "../configs/altogic";

  let loading = false;
  let success = "";
  let errors = null;

  const handleSignUp = async (e) => {
    e.preventDefault();
    const [name, email, password] = e.target;
    try {
      loading = true;

      const {
        user,
        session,
        errors: apiErrors,
      } = await altogic.auth.signUpWithEmail(
        email.value,
        password.value,
        name.value
      );

      if (apiErrors) {
        throw apiErrors;
      }

      if (session) {
        authStore.set(user);
        sessionStore.set(session);
        window.location.href = "/profile";
      } else {
        success = `We sent a verification link to ${email.value}`;
        errors = null;
        loading = false;
        name.value = "";
        email.value = "";
        password.value = "";
      }
    } catch (err) {
      success = "";
      errors = err.items;
      loading = false;
    }
  };
</script>

<section class="flex flex-col items-center justify-center h-96 gap-4">
  <form class="flex flex-col gap-2 w-full md:w-96" on:submit={handleSignUp}>
    <h1 class="self-start text-3xl font-bold">Create an account</h1>
    {#if success}
      <div class="bg-green-600 text-white text-[13px] p-2">
        {success}
      </div>
    {/if}

    {#if errors}
      <div class="bg-red-600 text-white text-[13px] p-2">
        {#each errors as { message }}
          <p>{message}</p>
        {/each}
      </div>
    {/if}

    <input type="text" placeholder="Type your name" />
    <input type="email" placeholder="Type your email" />
    <input
      autoComplete="new-password"
      type="password"
      placeholder="Type your password"
    />
    <div class="flex justify-between gap-4">
      <a class="text-indigo-600" href="/sign-in">Already have an account?</a>
      <button
        type="submit"
        class="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
        disabled={loading}
      >
        Register
      </button>
    </div>
  </form>
</section>
```

### Profile Page
On this page, we will show the user's profile and use Altogic's `altogic.auth.signOut()` function to log out.

We will remove session and user info from state and storage if the `signOut` function returns success. The user will be redirected to the login page.

Replacing  `routes/profile.svelte` with the following code:
```javascript
// /src/routes/profile.svelte
<script>
	import { authStore, sessionStore } from '../../store/auth.store';
	import { altogic } from '../../configs/altogic';
	import UserInfo from '../../components/UserInfo.svelte';
	import Avatar from '../../components/Avatar.svelte';
	import Sessions from '../../components/Sessions.svelte';

	async function handleSignOut() {
		try {
			const { errors: apiErrors } = await altogic.auth.signOut();

			if (apiErrors) {
				throw apiErrors;
			}

			authStore.set(null);
			sessionStore.set(null);
			window.location.href = '/';
		} catch (err) {
			console.error(err);
		}
	}
</script>

<section class="h-screen py-4 space-y-4 flex flex-col text-center items-center">
	<Avatar />
	<UserInfo />
	<Sessions />
	<button
		class="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
		on:click={handleSignOut}
	>
		Sign Out
	</button>
</section>
```

### Auth Redirect Page
We use this page to verify the user's email address and process magic link. This is the page where the user is redirected when clicked on the sign-up email confirmation link or the magic link.

We will use Altogic's `altogic.auth.getAuthGrant()` function to log in with the handled access_token from the URL and use this access_token to create a new user session and associated `sessionToken`.

Replacing `routes/auth-redirect.svelte` with the following code:
```javascript
// /src/routes/auth-redirect.svelte
<script>
	import { authStore, sessionStore } from '../../store/auth.store';
	import { altogic } from '../../configs/altogic';
	import { onMount } from 'svelte';

	const handleToken = async () => {
		const query = new URLSearchParams(window.location.search);
		const access_token = query.get('access_token');
		const { user, session } = await altogic.auth.getAuthGrant(access_token);

		if (user) {
			authStore.set(user);
			sessionStore.set(session);
			window.location.href = '/profile';
		} else {
			window.location.href = '/sign-in';
		}
	};

	onMount(() => {
		handleToken();
	});
</script>

<div>
	<div>Redirecting...</div>
</div>
```

### Magic Link Page
On this page, we will show a form to log in with Magic Link with only email. We will use Altogic's `altogic.auth.sendMagicLinkEmail()` function to log in.

When the user clicks on the magic link in the email, Altogic verifies the validity of the magic link and, if successful, redirects the user to the redirect URL specified in your app authentication settings with an access token in a query string parameter named `access_token.` The magic link flows in a similar way to the sign-up process. We use the `getAuthGrant` method explained above to create a new session and associated `sessionToken`.

Replacing `routes/magic-link.svelte` with the following code:
```javascript
// /src/routes/magic-link.svelte
<script>
  import { altogic } from "../configs/altogic";

  let loading = false;
  let success = "";
  let errors = null;

  async function loginHandler(e) {
    e.preventDefault();
    const [email] = e.target;
    loading = true;
    errors = null;

    const { errors: apiErrors } = await altogic.auth.sendMagicLinkEmail(
      email.value
    );
    loading = false;

    if (apiErrors) {
      errors = apiErrors.items;
    } else {
      email.value = "";
      success = "Email sent! Check your inbox.";
    }
  }
</script>

<section class="flex flex-col items-center justify-center h-96 gap-4">
  <form class="flex flex-col gap-2 w-full md:w-96" on:submit={loginHandler}>
    <h1 class="self-start text-3xl font-bold">Login with magic link</h1>
    {#if success}
      <div class="bg-green-600 text-white text-[13px] p-2">
        {success}
      </div>
    {/if}

    {#if errors}
      <div class="bg-red-600 text-white text-[13px] p-2">
        {#each errors as { message }}
          <p>{message}</p>
        {/each}
      </div>
    {/if}

    <input type="email" placeholder="Type your email" />
    <div class="flex justify-between gap-4">
      <a class="text-indigo-600" href="/sign-up"
        >Don't have an account? Register now</a
      >
      <button
        disabled={loading}
        type="submit"
        class="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
      >
        Send magic link
      </button>
    </div>
  </form>
</section>
```

## Updating User Info
In these component, we will use Altogic's database operations to update user fields and manage sessions.

Let's create some components in the **src/components/** folder as below:
* UserInfo.svelte
* Sessions.svelte
  
Replacing `components/UserInfo.svelte` with the following code:
```js
// /src/components/UserInfo.svelte
<script>
  import { authStore } from "../store/auth.store";
  import { altogic } from "../configs/altogic";

  let changeMode = false;
  let name = $authStore.name || "";
  let errors = null;

  const handleNameChange = () => {
    changeMode = true;
  };

  const handleKeyDown = async (e) => {
    if (e.code === "Enter") {
      errors = null;

      const { data: updatedUser, errors: apiErrors } = await altogic.db
        .model("users")
        .object($authStore._id)
        .update({ name });

      if (apiErrors) errors = apiErrors.items[0].message;
      else authStore.set(updatedUser);

      changeMode = false;
    }
  };
</script>

<section class="border p-4 w-full">
  {#if changeMode}
    <div class="flex items-center justify-center">
      <input
        type="text"
        class="border-none text-3xl text-center"
        on:keydown={handleKeyDown}
        bind:value={name}
      />
    </div>
  {:else}
    <div class="space-y-4">
      <h1 class="text-3xl">Hello, {$authStore?.name}</h1>
      <button on:click={handleNameChange} class="border p-2">
        Change name
      </button>
    </div>
  {/if}
  {#if errors}<div>{errors}</div>{/if}
</section>
```

Replacing `components/Sessions.svelte` with the following code:
```js
// /src/components/Sessions.svelte
<script>
	import { sessionStore } from '../store/auth.store';
	import { altogic } from '../configs/altogic';
	import { onMount } from 'svelte';

	let sessions = [];

	const logoutSession = async (session) => {
		const { errors } = await altogic.auth.signOut(session.token);
		if (!errors) {
			sessions = sessions.filter((s) => s.token !== session.token);
		}
	};

	const getAllSessions = async () => {
		const { sessions: sessionList } = await altogic.auth.getAllSessions();

		sessions = sessionList.map((session) =>
			session.token === $sessionStore.token ? { ...session, isCurrent: true } : session
		);
	};

	onMount(() => {
		getAllSessions();
	});
</script>

<div class="border p-4 space-y-4">
	<p class="text-3xl">All Sessions</p>
	<ul class="flex flex-col gap-2">
		{#each sessions as session}
			<li class="flex justify-between gap-12">
				<div>
					{#if session.isCurrent}<span> Current Session </span>{/if}
					<span>
						<strong>Device name: </strong>
						{session?.userAgent.device.family}
					</span>
				</div>
				<div class="flex items-center gap-2">
					<span>
						{new Date(session.creationDtm).toLocaleDateString('en-US')}
					</span>
					{#if !session.isCurrent}
						<button
							class="border grid place-items-center p-2 h-8 w-8 aspect-square leading-none"
							on:click={() => logoutSession(session)}
						>
							X
						</button>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
</div>
```

## Bonus: Upload Profile Photo
Let's create an Avatar component for users can upload a profile photo.

Open `Avatar.js` and paste the below code to create an avatar for the user. For convenience, we will be using the user's `_id` as the uploaded file's name and uploading the profile picture to the root directory of our app storage. If needed, you can create different buckets for each user or a generic bucket to store all provided photos of users. The Altogic Client Library has all the methods to manage buckets and files.

```javascript
// /src/components/Avatar.svelte
<script>
  import { authStore } from "../store/auth.store";
  import { altogic } from "../configs/altogic";

  let errors = null;
  let loading = false;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    e.target.value = null;
    if (!file) return;
    try {
      loading = true;
      errors = null;
      const { publicPath } = await updateProfilePicture(file);
      const updatedUser = await updateUser({ profilePicture: publicPath });
      authStore.set(updatedUser);
    } catch (e) {
      errors = e.message;
    } finally {
      loading = false;
    }
  };
  const updateProfilePicture = async (file) => {
    const { data, errors } = await altogic.storage
      .bucket("root")
      .upload(`user_${$authStore._id}`, file);
    if (errors) throw new Error("Couldn't upload file");
    return data;
  };
  const updateUser = async (data) => {
    const { data: updatedUser, errors } = await altogic.db
      .model("users")
      .object($authStore._id)
      .update(data);
    if (errors) throw new Error("Couldn't update user");
    return updatedUser;
  };
</script>

<div>
  <figure class="flex flex-col gap-4 items-center justify-center py-2">
    <picture class="border rounded-full w-24 h-24 overflow-hidden">
      <img
        class="object-cover w-full h-full"
        src={$authStore?.profilePicture ||
          `https://ui-avatars.com/api/?name=${$authStore?.name}&background=0D8ABC&color=fff`}
        alt={$authStore?.name}
      />
    </picture>
  </figure>
  <div class="flex flex-col gap-4 justify-center items-center">
    <label class="border p-2 cursor-pointer">
      <span>{loading ? "Uploading..." : "Change Avatar"}</span>

      <input
        class="hidden"
        type="file"
        accept="image/*"
        disabled={loading}
        on:change={handleFileChange}
      />
    </label>
    {#if errors}<div>{errors}</div>{/if}
  </div>
</div>
```

## Conclusion
Congratulations!✨

You had completed the most critical part of the Authentication flow, which includes private routes, sign-up, sign-in, and sign-out operations.

If you have any questions about Altogic or want to share what you have built, please post a message in our [community forum](https://community.altogic.com/home) or [discord channel](https://discord.gg/ERK2ssumh8).

