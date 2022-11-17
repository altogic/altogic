# Email & Password Based Authentication Using Nuxt 3 & Altogic

## Introduction

[Altogic](https://www.altogic.com) is a Backend as a Service (BaaS) platform and provides a variety of services in modern web and mobile development. Most modern applications using Nuxt 3 or other libraries/frameworks require knowing the identity of a user. And this necessity allows an app to securely save user data and session in the cloud and provide more personalized functionalities and views to users.

Altogic has an authentication service that integrates and implements well in JAMstack apps. It has a ready-to-use [Javascript client library](https://www.npmjs.com/package/altogic), and it supports many authentication providers such as email/password, phone number, magic link, and OAuth providers like Google, Facebook, Twitter, Github, Apple etc.,

In this tutorial, we will implement email/password authentication with Nuxt 3 and take a look at how as a Nuxt 3 developer, we build applications and integrate with Altogic Authentication.

After completion of this tutorial, you will learn the following:

-   How to create sample screens to display forms like login and signup.
-   How to create a home screen and authorize only logged-in users.
-   How to create an authentication flow by conditionally rendering between these pages whether a user is logged in.
-   How to authenticate users using the magic link
-   How to update user profile info and upload a profile picture
-   How to manage active sessions of a user
-   And we will integrate Altogic authentication with the email/password method.

If you are new to Vue applications, this tutorial is definitely for you to understand the basics and even advanced concepts.

## How email-based sign-up works in Altogic

By default, when you create an app in Altogic, email-based authentication is enabled. In addition, during email-based authentication, the email address of the user is also verified. Below you can find the flow of email and password-based sign-up process.

<Banner
alt="Email & Password based authentication flow"
src="/client/img/quickstart-guides/global/auth-flow.png"
width={650}>
Email & Password based authentication flow
</Banner>

If email verification is disabled, then after step 2, Altogic immediately returns a new session to the user, meaning that steps after step #2 in the above flow are not executed. You can easily configure email-based authentication settings from the **App Settings > Authentication** in Altogic Designer. One critical parameter you need to specify is the Redirect URL, you can customize this parameter from **App Settings > Authentication**. Finally, you can customize the email message template from the **App Settings > Authentication > Message Templates**.

:::note
For frontend apps that use server-side rendering, the session token needs to be stored in an HTTP cookie so that the client browser and the frontend server can exchange session information. Otherwise, the session information can be lost, and the Altogic Client library methods that require a session token can fail.
:::

## Prerequisites

To complete this tutorial, make sure you have installed the following tools and utilities on your local development environment.

-   [VsCode](https://code.visualstudio.com/download)
-   [NodeJS](https://nodejs.org/en/download/)
-   [Nuxt.js App](https://nuxt.com/docs/getting-started/introduction)
-   You also need an Altogic Account. If you do not have one, you can create an account by [sign-in up for Altogic](https://designer.altogic.com/).

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

Then click Next and select Basic template. **This template creates a default user data model for your app which is required by [Altogic Client Library](https://www.npmjs.com/package/altogic) to store user data and manage authentication.** You can add additional user fields to this data model (e.g., name, surname, gender, birthdate) and when calling the `signUpWithEmail` method of the client library you can pass these additional data.

<Banner
alt="Choose Template"
src="/client/img/quickstart-guides/global/3-choose-template.png"
width={650} />

:::tip
If you do not select the basic template, instead selected the blank app template the user data model will not be created for your app. In order to use the Altogic Client Library's authentication methods you need a user data model to store the user data. You can easily create a new data model manually and from the **App Settings > Authentication** mark this new data model as your user data model.
:::

Then click Next to confirm and create an app.

Awesome! We have created our application; now click/tap on the **newly created app to launch the Designer.** In order to access the app and use the Altogic client library, we should get `envUrl` and `clientKey` of this app. You can use any one of the API base URLs specified for your app environment as your envUrl.

Click the **Home** icon at the left sidebar to copy the `envUrl` and `clientKey`.

<Banner
alt="Client Library Keys"
src="/client/img/quickstart-guides/global/4-client-keys.png"
width={650} />

Once the user is created successfully, our Nuxt 3 app will route the user to the Verification page, and a verification email will be sent to the user's email address. When the user clicks the link in the mail, the user will navigate to the redirect page to grant authentication rights. After successfully creating a session on the Redirect page, users will be redirected to the Home page.

:::info
If you want, you can deactivate or customize the mail verification from **App Settings -> Authentication** in Altogic Designer.
:::

<Banner
alt="Verification Mail Settings"
src="/client/img/quickstart-guides/global/mail.png"
width={650} />

## Create Nuxt 3 Project

Make sure you have an up-to-date version of Node.js installed, then run the following command in your command line

```bash
npx nuxi init altogic-auth-nuxt3
```

Open altogic-auth-nuxt3 folder in Visual Studio Code:

```bash
code altogic-auth-nuxt3
```

## Integrating With Altogic

Our backend and frontend is now ready and running on the server. ✨

Now, we can install the Altogic client library to our Nuxt 3 app to connect our frontend with the backend.

```bash
# using npm
npm install altogic
# OR is using yarn
yarn add altogic
```

Let’s create a libs/ folder inside your root directory to add altogic.js file.

Open altogic.js and paste below code block to export the altogic client instance.

```js title="libs/altogic.js"
import { createClient } from 'altogic';

const ENV_URL = ''; // replace with your envUrl
const CLIENT_KEY = ''; // replace with your clientKey

const altogic = createClient(ENV_URL, CLIENT_KEY, {
    signInRedirect: '/login',
});

export default altogic;
```

> Replace `ENV_URL` and `CLIENT_KEY` which is shown in the **Home** view of [Altogic Designer](https://designer.altogic.com/).

:::info
`signInRedirect` is the sign in page URL to redirect the user when user's session becomes invalid. Altogic client library observes the responses of the requests made to your app backend. If it detects a response with an error code of missing or invalid session token, it can redirect the users to this signin url.
:::

## Create Routes

Nuxt has built-in file system routing. It means that we can create a page by creating a file in the **pages/** directory.

Let's create some views in **pages/** folder as below:

-   index.vue
-   login.vue
-   register.vue
-   profile.vue
-   login-with-magic-link.vue
-   auth-redirect.vue

<Banner
alt="vscode preview"
src="/client/img/quickstart-guides/nuxt3/pages.png"
width={650} />

### Home Page

In this page, we will show Login, Login With Magic Link and Register buttons.

```html title="pages/index.vue"
<script setup>
    definePageMeta({
        middleware: ['guest'],
    });
    useHead({
        title: 'Altogic Auth Sample With Nuxt3',
    });
</script>

<template>
    <div class="flex items-center justify-center gap-4 h-screen">
        <NuxtLink class="border px-4 py-2 font-medium text-xl" to="/login-with-magic-link"
            >Login With Magic Link</NuxtLink
        >
        <NuxtLink class="border px-4 py-2 font-medium text-xl" to="/login">Login</NuxtLink>
        <NuxtLink class="border px-4 py-2 font-medium text-xl" to="/register">Register</NuxtLink>
    </div>
</template>
```

### Login Page

In this page, we will show a form to log in with email and password. We will use fetch function to call our backend api. We will save session and user info to state and storage if the api returns success. Then user will be redirected to profile page.

```html title="pages/login.vue"
<script setup>
    import { useAuthStore } from '~/stores/useAuth';

    const router = useRouter();
    const auth = useAuthStore();
    const email = ref('');
    const password = ref('');
    const errors = ref(null);
    const loading = ref(false);

    definePageMeta({
        middleware: ['guest'],
    });
    useHead({
        title: 'Login',
    });

    async function loginHandler() {
        loading.value = true;
        errors.value = null;
        const {
            user,
            errors: apiErrors,
            session,
        } = await $fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email: email.value,
                password: password.value,
            }),
        });
        loading.value = false;
        if (apiErrors) {
            errors.value = apiErrors;
        } else {
            auth.setUser(user);
            auth.setSession(session);
            router.push('/profile');
        }
    }
</script>

<template>
    <section class="flex flex-col items-center justify-center h-96 gap-4">
        <form @submit.prevent="loginHandler" class="flex flex-col gap-2 w-full md:w-96">
            <h1 class="self-start text-3xl font-bold">Login to your account</h1>

            <div v-if="errors" class="bg-red-600 text-white text-[13px] p-2">
                <p v-for="(error, index) in errors.items" :key="index">{{ error.message }}</p>
            </div>

            <input v-model="email" type="email" placeholder="Type your email" required />
            <input v-model="password" type="password" placeholder="Type your password" required />
            <div class="flex justify-between gap-4">
                <NuxtLink class="text-indigo-600" to="/register">Don't have an account? Register now</NuxtLink>
                <button
                    :disabled="loading"
                    type="submit"
                    class="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
                >
                    Login
                </button>
            </div>
        </form>
    </section>
</template>
```

### Login With Magic Link Page

In this page, we will show a form to **log in with Magic Link** with only email. We will use `altogic.auth.sendMagicLinkEmail()` method to sending magic link to user's email.

When the user clicks on the magic link in the email, Altogic verifies the validity of the magic link and, if successful, redirects the user to the redirect URL specified in your app authentication settings with an access token in a query string parameter named `access_token` The magic link flows in a similar way to the sign-up process. We use the `getAuthGrant()` method to create a new session and associated `sessionToken`.

```html title="pages/login-with-magic-link.vue"
<script setup>
    import altogic from '~/libs/altogic';

    const successMessage = ref('');
    const loading = ref(false);
    const email = ref('');
    const errors = ref(null);

    definePageMeta({
        middleware: ['guest'],
    });
    useHead({
        title: 'Login with magic link',
    });

    async function loginHandler() {
        loading.value = true;
        errors.value = null;
        const { errors: apiErrors } = await altogic.auth.sendMagicLinkEmail(email.value);
        loading.value = false;
        if (apiErrors) {
            errors.value = apiErrors;
        } else {
            email.value = '';
            successMessage.value = 'Email sent! Check your inbox.';
        }
    }
</script>

<template>
    <section class="flex flex-col items-center justify-center h-96 gap-4">
        <form @submit.prevent="loginHandler" class="flex flex-col gap-2 w-full md:w-96">
            <h1 class="self-start text-3xl font-bold">Login with magic link</h1>

            <div v-if="successMessage" class="bg-green-600 text-white text-[13px] p-2">{{ successMessage }}</div>

            <div v-if="errors" class="bg-red-600 text-white text-[13px] p-2">
                <p v-for="(error, index) in errors.items" :key="index">{{ error.message }}</p>
            </div>

            <input v-model="email" type="email" placeholder="Type your email" required />
            <div class="flex justify-between gap-4">
                <NuxtLink class="text-indigo-600" to="/register">Don't have an account? Register now</NuxtLink>
                <button
                    :disabled="loading"
                    type="submit"
                    class="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
                >
                    Send magic link
                </button>
            </div>
        </form>
    </section>
</template>
```

### Register Page

In this page, we will show a form to sign up with email and password. We will use **Nuxt Server** call our backend api.

```html title="pages/register.vue"
<script setup>
    import { useAuthStore } from '~/stores/useAuth';

    const auth = useAuthStore();
    const router = useRouter();

    const email = ref('');
    const name = ref('');
    const password = ref('');
    const errors = ref(null);
    const isNeedToVerify = ref(false);
    const loading = ref(false);

    definePageMeta({
        middleware: ['guest'],
    });
    useHead({
        title: 'Register',
    });

    async function registerHandler() {
        loading.value = true;
        errors.value = null;
        const {
            user,
            errors: apiErrors,
            session,
        } = await $fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email: email.value,
                password: password.value,
                name: name.value,
            }),
        });
        if (apiErrors) {
            errors.value = apiErrors;
            return;
        }
        email.value = '';
        password.value = '';
        name.value = '';

        if (!session) {
            isNeedToVerify.value = true;
            return;
        }

        auth.setUser(user);
        auth.setSession(session);
        router.push({ name: 'profile' });
    }
</script>

<template>
    <section class="flex flex-col items-center justify-center h-96 gap-4">
        <form @submit.prevent="registerHandler" class="flex flex-col gap-2 w-full md:w-96">
            <h1 class="self-start text-3xl font-bold">Create an account</h1>

            <div v-if="isNeedToVerify" class="bg-green-500 text-white p-2">
                Your account has been created. Please check your email to verify your account.
            </div>

            <div v-if="errors" class="bg-red-600 text-white text-[13px] p-2">
                <p v-for="(error, index) in errors.items" :key="index">{{ error.message }}</p>
            </div>

            <input v-model="email" type="email" placeholder="Type your email" required />
            <input v-model="name" type="text" placeholder="Type your name" required />
            <input
                v-model="password"
                type="password"
                autocomplete="new-password"
                placeholder="Type your password"
                required
            />
            <div class="flex justify-between gap-4">
                <NuxtLink class="text-indigo-600" to="/login">Already have an account?</NuxtLink>
                <button
                    type="submit"
                    :disabled="loading"
                    class="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
                >
                    Register
                </button>
            </div>
        </form>
    </section>
</template>
```

### Profile Page

In this page, we will show the user's profile, and We will use our sign-out api route.

We will remove session and user info from state and storage if signOut api returns success. Then, user will be redirected to login page.

This page is protected. Before page loaded, We will check cookie. If there is **sessionToken**, and it's valid, we will sign in and fetch user, session information. If there is not or not valid, the user will be redirected to sign in page.

```html title="pages/profile.vue"
<script setup>
    import { useAuthStore } from '~/stores/useAuth';
    const auth = useAuthStore();

    definePageMeta({
        middleware: ['auth'],
    });

    useHead({
        title: `${auth?.user?.name} - Profile`,
    });
</script>

<template>
    <div>
        <section class="h-screen py-4 space-y-4 flex flex-col text-center items-center">
            <Avatar />
            <UserInfo />
            <Sessions />
            <a href="/api/auth/logout" class="bg-gray-400 rounded py-2 px-3 text-white"> Logout </a>
        </section>
    </div>
</template>
```

### Auth Redirect Page

In this page, we will use **Nuxt Server** call our backend api to verify user.

```html title="pages/auth-redirect.vue"
<script setup>
    const auth = useAuthStore();
    const route = useRoute();
    const router = useRouter();
    const errors = ref(null);
    const { access_token } = route.query;

    useHead({
        title: 'Verify your account',
    });

    onMounted(async () => {
        const { errors: apiErrors, user, session } = await $fetch(`/api/auth/verify-user?access_token=${access_token}`);
        if (apiErrors) {
            errors.value = apiErrors;
            return;
        }
        auth.setUser(user);
        auth.setSession(session);
        await router.push('/profile');
    });
</script>

<template>
    <section class="h-screen flex flex-col gap-4 justify-center items-center">
        <div class="text-center" v-if="errors">
            <p class="text-red-500 text-3xl" :key="index" v-for="(error, index) in errors.items">{{ error.message }}</p>
        </div>
        <div class="text-center" v-else>
            <p class="text-6xl text-black">Please wait</p>
            <p class="text-3xl text-black">You're redirecting to your profile...</p>
        </div>
    </section>
</template>
```

## Create Authentication Store

### Install State Management

```bash
npm install pinia
```

### Define Auth Store

Create a folder named `stores/` in your project root folder and put a file named **useAuth.js** in it. Then paste the code below into the file.

We use this store to manage user and session information.

```js title="stores/useAuth.js"
import altogic from '~/libs/altogic';

export const useAuthStore = defineStore('AuthStore', () => {
    const user = ref(null);
    const sessionToken = ref(null);

    const setUser = _user => {
        user.value = _user;
        altogic.auth.setUser(_user);
    };

    const setSession = _session => {
        sessionToken.value = _session;
        altogic.auth.setSession(typeof _session === 'string' ? { token: _session } : _session);
    };

    watchEffect(() => {
        altogic.auth.setUser(user.value);
        const token = typeof sessionToken.value === 'string' ? { token: sessionToken.value } : sessionToken.value;
        altogic.auth.setSession(token);
    });

    return {
        user,
        sessionToken,
        setUser,
        setSession,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
```

## Handling Authentication In Server Side

This is the most important part of the project. We will handle authentication in server side. We will use `altogic` library to handle authentication in server side.

For client-side (browser) rendered frontend apps, Altogic automatically stores the `sessionToken` in local storage. For server-side rendered frontend apps, since we do not have local storage available, we need to store the `sessionToken` somewhere to check whether the user has been authenticated or not. For this reason, we will store the `sessionToken` in an HTTP cookie named `session` which will be exchanged between the client browser and the front end server.

Nuxt is a server side rendering tool, we will do some operations on the backend. So we need to create a folder named `server/` in our project root directory.

### Create Server Folder

Create a folder named `server` in your project root directory.

And create files in server folder like image in below

<Banner
alt="Server folder"
src="/client/img/quickstart-guides/nuxt3/server-folder.png"
width={650} />

### Login API Route

In this file, we have created an endpoint for users to login. And here we are logging in by assigning the session token returned from altogic to the cookie.

```js title="server/api/login.post.js"
import altogic from '~/libs/altogic';

export default defineEventHandler(async event => {
    const { email, password } = await readBody(event);
    const { user, session, errors } = await altogic.auth.signInWithEmail(email, password);

    if (errors) {
        return { errors };
    }

    altogic.auth.setSessionCookie(session.token, event.req, event.res);
    altogic.auth.setSession(session);
    return { user, session };
});
```

### Register API Route

In this file, we have created an endpoint for users to register. And here we are logging in by assigning the session token returned from altogic to the cookie.

If `signUpWithEmail` does not return session, it means user need to confirm email, so we will show the success message.

:::note
`signUpWithEmail` function can accept optional third parameter data to save the user's profile. We will save the user's name to the database in this example.
:::

```js title="server/api/register.post.js"
import altogic from '~/libs/altogic';

export default defineEventHandler(async event => {
    const { email, password, ...rest } = await readBody(event);
    const { user, errors, session } = await altogic.auth.signUpWithEmail(email, password, rest);

    if (errors) {
        return { errors };
    }

    if (session) {
        altogic.auth.setSessionCookie(session.token, event.req, event.res);
        altogic.auth.setSession(session);
        return { user, session };
    }

    return { user };
});
```

### Logout API Route

In this file, we have created an endpoint for users to logout. And here we are logging out by removing the session token from the cookie.

```js title="server/api/logout.js"
import altogic from '~/libs/altogic';

export default defineEventHandler(async event => {
    const token = getCookie(event, 'session_token');
    await altogic.auth.signOut(token);
    altogic.auth.removeSessionCookie(event.req, event.res);
    await sendRedirect(event, '/login');
});
```

### Verify User API Route

In this page we use the `getAuthGrant()` method to create a new session and associated `sessionToken` for verify email or sign in with magic link.

Replacing `pages/auth-redirect.js` with the following code:

```js title="server/api/verify-user.js"
import altogic from '~/libs/altogic';

export default defineEventHandler(async event => {
    const { access_token } = getQuery(event);

    const { errors, user, session } = await altogic.auth.getAuthGrant(access_token.toString());

    if (errors) {
        return { errors };
    }

    altogic.auth.setSessionCookie(session.token, event.req, event.res);
    altogic.auth.setSession(session);
    return { user, session };
});
```

### Auth Server Middleware

In this file, we pull the user from altogic with the token in the cookie according to the login status of the user.

```js title="server/middleware/auth.js"
import altogic from '~/libs/altogic';

export default defineEventHandler(async event => {
    const token = getCookie(event, 'session_token');

    const { user } = await altogic.auth.getUserFromDBbyCookie(event.req, event.res);

    if (user) {
        event.context.user = user;
        event.context.session_token = token;
    }
});
```

## Create Middleware

Create a folder named `middleware` in your project root directory.

And create files in **middleware** folder like image in below

<Banner
alt="middleware folder"
src="/client/img/quickstart-guides/nuxt3/middleware.png"
width={650} />

### Global Auth Middleware

In this file, we update our state by checking the variable that we have previously assigned in **auth.js**, which is the server middleware.

```js title="middleware/auth.global.js"
import { useAuthStore } from '~/stores/useAuth';

export default defineNuxtRouteMiddleware(() => {
    const store = useAuthStore();
    const event = useRequestEvent();

    if (process.server && event.context.user && event.context.session_token) {
        store.setUser(event.context.user);
        store.setSession(event.context.session_token);
    }
});
```

### Auth Middleware

This middleware checks if the user is logged in or not. If the user is not logged in, it redirects the user to the login page.

```js title="middleware/auth.js"
import { useAuthStore } from '~/stores/useAuth';

export default defineNuxtRouteMiddleware(async () => {
    const cookie = useCookie('session_token');
    const store = useAuthStore();
    if (!cookie.value && !store.user) return '/login';
});
```

### Guest Middleware

This middleware checks if the user is logged in or not. If the user is logged in, it redirects the user to the profile page.

```js title="middleware/guest.js"
import { useAuthStore } from '~/stores/useAuth';

export default defineNuxtRouteMiddleware(() => {
    const cookie = useCookie('session_token');
    const store = useAuthStore();

    if (cookie.value || store.user) return '/profile';
});
```

## Upload Profile Picture

Open Avatar.js and paste the below code to create an avatar for the user.

For convenience, we will be using the user's `_id` as the name of the uploaded file and upload the profile picture to the root directory of our app storage. If needed you can create different buckets for each user or a generic bucket to store all provided photos of users. The Altogic Client Library has all the methods to manage buckets and files.

```html title="components/Avatar.vue"
<script setup>
    import altogic from '~/libs/altogic';

    const auth = useAuthStore();
    const loading = ref(false);
    const errors = ref(null);

    const userPicture = computed(() => {
        return auth?.user?.profilePicture || 'https://ui-avatars.com/api/?name=' + auth?.user?.name;
    });

    async function changeHandler(e) {
        const file = e.target.files[0];
        e.target.value = null;
        if (!file) return;
        try {
            loading.value = true;
            errors.value = null;
            const { publicPath } = await updateProfilePicture(file);
            const user = await updateUser({ profilePicture: publicPath });
            auth.setUser(user);
        } catch (e) {
            errors.value = e.message;
        } finally {
            loading.value = false;
        }
    }

    async function updateProfilePicture(file) {
        const { data, errors } = await altogic.storage.bucket('root').upload(`user_${auth.user._id}`, file);
        if (errors) throw new Error("Couldn't upload file");
        return data;
    }

    async function updateUser(data) {
        const { data: user, errors } = await altogic.db.model('users').object(auth.user._id).update(data);
        if (errors) throw new Error("Couldn't update user");
        return user;
    }
</script>

<template>
    <div>
        <figure class="flex flex-col gap-4 items-center justify-center py-2">
            <picture class="border rounded-full w-24 h-24 overflow-hidden">
                <img class="object-cover w-full h-full" :src="userPicture" :alt="auth?.user?.name" />
            </picture>
        </figure>
        <div class="flex flex-col gap-4 justify-center items-center">
            <label class="border p-2 cursor-pointer">
                <span v-if="loading">Uploading...</span>
                <span v-else>Change Avatar</span>
                <input :disabled="loading" class="hidden" type="file" accept="image/*" @change="changeHandler" />
            </label>
            <div class="bg-red-500 p-2 text-white" v-if="errors">{{ errors }}</div>
        </div>
    </div>
</template>
```

## Update User Info

In this component, we will use Altogic's database operations to update the user's name.

```html title="components/UserInfo.vue"
<script setup>
    import { useAuthStore } from '~/stores/useAuth';
    import altogic from '~/libs/altogic';
    const auth = useAuthStore();

    const username = ref(auth?.user?.name);
    const loading = ref(false);
    const inputRef = ref(null);
    const changeMode = ref(false);
    const errors = ref(null);

    function openChangeMode() {
        changeMode.value = true;
        setTimeout(() => {
            inputRef.value.focus();
        }, 100);
    }

    async function saveName() {
        loading.value = true;
        errors.value = null;

        const { data, errors: apiErrors } = await altogic.db
            .model('users')
            .object(auth.user._id)
            .update({ name: username.value });

        if (apiErrors) {
            errors.value = apiErrors[0].message;
        } else {
            username.value = data.name;
            auth.setUser(data);
        }

        loading.value = false;
        changeMode.value = false;
    }
</script>

<template>
    <section class="border p-4 w-full">
        <div class="flex items-center justify-center" v-if="changeMode">
            <input
                @keyup.enter="saveName"
                ref="inputRef"
                type="text"
                v-model="username"
                class="border-none text-3xl text-center"
            />
        </div>
        <div class="space-y-4" v-else>
            <h1 class="text-3xl">Hello, {{ auth?.user?.name }}</h1>
            <button @click="openChangeMode" class="border p-2">Change name</button>
        </div>
        <div v-if="errors">{{ errors }}</div>
    </section>
</template>
```

## Manage Sessions

In this component, we will use Altogic's `altogic.auth.getAllSessions()` to get the user's sessions and delete them.

```html title="components/Sessions.vue"
<script setup>
    import altogic from '../libs/altogic';

    const auth = useAuthStore();
    let { data: sessions } = await useFetch('/api/auth/sessions', {
        headers: useRequestHeaders(['cookie']),
    });
    async function logoutSession(session) {
        const { errors } = await altogic.auth.signOut(session.token);
        if (!errors) {
            sessions.value = sessions.value.filter(s => s.token !== session.token);
        }
    }
</script>

<template>
    <div class="border p-4 space-y-4">
        <p class="text-3xl">All Sessions</p>
        <ul class="flex flex-col gap-2">
            <li :key="session.token" class="flex justify-between gap-12" v-for="session in sessions">
                <div>
                    <span v-if="session?.isCurrent"> Current Session </span>
                    <span v-else> <strong>Device name: </strong>{{ session?.userAgent?.device?.family }}</span>
                </div>
                <div class="flex items-center gap-2">
                    <span>{{ new Date(session.creationDtm).toLocaleDateString('en-US') }}</span>
                    <button
                        v-if="!session?.isCurrent"
                        @click="logoutSession(session)"
                        class="border grid place-items-center p-2 h-8 w-8 aspect-square leading-none"
                    >
                        X
                    </button>
                </div>
            </li>
        </ul>
    </div>
</template>
```

## Conclusion

Congratulations!✨

You had completed the most critical part of the Authentication flow, which includes private routes, sign-up, sign-in, and sign-out operations.

If you have any questions about Altogic or want to share what you have built, please post a message in our [community forum](https://community.altogic.com/home) or [discord channel](https://discord.gg/ERK2ssumh8).
