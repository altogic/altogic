# Email & Password Based Authentication Using Vue & Altogic

## Introduction

[Altogic](https://www.altogic.com) is a Backend as a Service (BaaS) platform and provides a variety of services in modern web and mobile development. Most modern applications using Vue or other libraries/frameworks require knowing the identity of a user. And this necessity allows an app to securely save user data and session in the cloud and provide more personalized functionalities and views to users.

Altogic has an authentication service that integrates and implements well in JAMstack apps. It has a ready-to-use [Javascript client library](https://www.npmjs.com/package/altogic), and it supports many authentication providers such as email/password, phone number, magic link, and OAuth providers like Google, Facebook, Twitter, Github, Apple etc.,

In this tutorial, we will implement email/password authentication with Vue and take a look at how as a Vue developer, we build applications and integrate with Altogic Authentication.

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
-   [Vue.js App](https://vuejs.org/guide/quick-start.html)
-   You also need an Altogic Account. If you do not have one, you can create an account by [signin up for Altogic](https://designer.altogic.com/).

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

Once the user is created successfully, our Vue.js app will route the user to the Verification page, and a verification email will be sent to the user's email address. When the user clicks the link in the mail, the user will navigate to the redirect page to grant authentication rights. After successfully creating a session on the Redirect page, users will be redirected to the Home page.

:::info
If you want, you can deactivate or customize the mail verification from **App Settings -> Authentication** in Altogic Designer.
:::
<Banner
alt="Verification Mail Settings"
src="/client/img/quickstart-guides/global/mail.png"
width={650} />

## Create a Vue Project

Make sure you have an up-to-date version of Node.js installed, then run the following command in your command line

```bash
npm init vue@latest
```

<Banner
alt="terminal preview"
src="/client/img/quickstart-guides/vue/terminal-preview.png"
width={650} />

Open **altogic-auth-example** folder in Visual Studio Code:

```bash
code altogic-auth-example
```

## Integrating With Altogic

Our backend and frontend is now ready and running on the server. ✨

Now, we can install the Altogic client library to our Vue app to connect our frontend with the backend.

```bash
# using npm
npm install altogic
# OR is using yarn
yarn add altogic
```

Let’s create a `libs/` folder inside the `src/` directory to add **altogic.js** file.

Open altogic.js and paste below code block to export the altogic client instance.

```js title="src/libs/altogic.js"
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

Let's create some views in src/views folder as below for vue-router

-   HomeView.vue
-   LoginView.vue
-   RegisterView.vue
-   ProfileView.vue
-   AuthRedirectView.vue
-   LoginWithMagicLinkView.vue

<Banner
alt="VsCode preview"
src="/client/img/quickstart-guides/vue/views-folder.png"
width={650} />

Open the `src/router/index.js` file and paste the code below into the file.

In this file, we will create a router for our app. We will use this router to navigate between pages.

```js title="src/router/index.js"
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: { requiresGuest: true },
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('../views/ProfileView.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginView.vue'),
            meta: { requiresGuest: true },
        },
        {
            path: '/login-with-magic-link',
            name: 'magic-login',
            component: () => import('../views/LoginWithMagicLinkView.vue'),
            meta: { requiresGuest: true },
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('../views/RegisterView.vue'),
            meta: { requiresGuest: true },
        },
        {
            path: '/auth-redirect',
            name: 'auth-redirect',
            component: () => import('../views/AuthRedirectView.vue'),
            meta: { requiresGuest: true },
        },
    ],
});
router.beforeEach((to, from) => {
    const auth = useAuthStore();
    if (to.meta.requiresAuth && !auth.user) {
        return {
            name: 'login',
        };
    }
    if (to.meta.requiresGuest && auth.user) {
        return {
            name: 'profile',
        };
    }
});

export default router;
```

### Home View

In this page, we will show Login, Login With Magic Link and Register buttons.

```html title="src/views/HomeView.vue"
<template>
    <div class="flex items-center justify-center gap-4 h-screen">
        <router-link class="border px-4 py-2 font-medium text-xl" :to="{ name: 'magic-login' }">
            Login With Magic Link
        </router-link>
        <router-link class="border px-4 py-2 font-medium text-xl" :to="{ name: 'login' }">Login</router-link>
        <router-link class="border px-4 py-2 font-medium text-xl" :to="{ name: 'register' }">
            Register
        <router-link>
    </div>
</template>
```

### Login View

In this page, we will show a form to log in with email and password. We will use `altogic.auth.signInWithEmail()` method to sign-in.

```html title="src/views/LoginView.vue"
<script setup>
    import { ref } from 'vue';
    import altogic from '@/libs/altogic';
    import { useAuthStore } from '@/stores/auth';
    import { useRouter } from 'vue-router';

    const auth = useAuthStore();
    const router = useRouter();

    const loading = ref(false);
    const email = ref('');
    const password = ref('');
    const errors = ref(null);

    async function loginHandler() {
        loading.value = true;
        errors.value = null;
        const { user, session, errors: apiErrors } = await altogic.auth.signInWithEmail(email.value, password.value);
        if (apiErrors) {
            errors.value = apiErrors;
            loading.value = false;
        } else {
            auth.setUser(user);
            auth.setSession(session);
            await router.push({ name: 'profile' });
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
            <div class="flex justify-between gap-4 items-start">
                <router-link class="text-indigo-600" :to="{ name: 'register' }"
                    >Don't have an account? Register now</router-link
                >
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

### Login With Magic Link View

In this page, we will show a form to **log in with Magic Link** with only email. We will use `altogic.auth.sendMagicLinkEmail()` method to sending magic link to user's email.

When the user clicks on the magic link in the email, Altogic verifies the validity of the magic link and, if successful, redirects the user to the redirect URL specified in your app authentication settings with an access token in a query string parameter named `access_token` The magic link flows in a similar way to the sign-up process. We use the `getAuthGrant()` method to create a new session and associated `sessionToken`.

```html title="src/views/LoginWithMagicLinkView.vue"
<script setup>
    import { ref } from 'vue';
    import altogic from '@/libs/altogic';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const successMessage = ref('');
    const loading = ref(false);
    const email = ref('');
    const errors = ref(null);

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
            <div class="flex justify-between gap-4 items-start">
                <router-link class="text-indigo-600" :to="{ name: 'register' }"
                    >Don't have an account? Register now</router-link
                >
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

### Register View

In this page, we will show a form to sign up with email and password. We will use `altogic.auth.signUpWithEmail()` method to sign-up.

We will save session and user info to state if the api returns session. Then, user will be redirected to profile page.

If `signUpWithEmail` does not return session, it means user need to confirm email, so we will show the success message.

:::info
`signUpWithEmail` method can accept optional third parameter data to save the user's profile. We will save the user's name to the database in this example.
:::

```html title="src/views/RegisterView.vue"
<script setup>
    import { ref } from 'vue';
    import altogic from '@/libs/altogic';
    import { useAuthStore } from '@/stores/auth';
    import { useRouter } from 'vue-router';

    const auth = useAuthStore();
    const router = useRouter();
    const loading = ref(false);
    const email = ref('');
    const name = ref('');
    const password = ref('');
    const errors = ref(null);
    const isNeedToVerify = ref(false);

    async function registerHandler() {
        loading.value = true;
        errors.value = null;
        isNeedToVerify.value = false;

        const {
            user,
            session,
            errors: apiErrors,
        } = await altogic.auth.signUpWithEmail(email.value, password.value, name.value);

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

        auth.setSession(session);
        auth.setUser(user);
        await router.push({ name: 'profile' });
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
            <input v-model="password" type="password" placeholder="Type your password" required />
            <div class="flex justify-between gap-4">
                <router-link class="text-indigo-600" :to="{ name: 'login' }">Already have an account?</router-link>
                <button
                    type="submit"
                    class="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
                >
                    Register
                </button>
            </div>
        </form>
    </section>
</template>
```

### Profile View

In this page, we will show the user's profile.

```html title="src/views/ProfileView.vue"
<script setup>
    import { useAuthStore } from '../stores/auth';
    import Avatar from '../components/Avatar.vue';
    import UserInfo from '../components/UserInfo.vue';
    import Sessions from '../components/Sessions.vue';
    const auth = useAuthStore();
</script>

<template>
    <section class="h-screen py-4 space-y-4 flex flex-col text-center items-center">
        <Avatar />
        <UserInfo />
        <Sessions />
        <button @click="auth.logout" class="bg-gray-400 rounded py-2 px-3 text-white">Logout</button>
    </section>
</template>
```

### Auth Redirect View

In this page we use the `getAuthGrant()` method to create a new session and associated `sessionToken` for verify email or sign in with magic link.

```html title="src/views/AuthRedirectView.vue"
<script setup>
    import { useAuthStore } from '@/stores/auth';
    import { useRoute, useRouter } from 'vue-router';
    import { onMounted, ref } from 'vue';
    import altogic from '@/libs/altogic';

    const auth = useAuthStore();
    const route = useRoute();
    const router = useRouter();
    const errors = ref(null);
    const { access_token } = route.query;

    onMounted(() => {
        loginWithToken();
    });

    async function loginWithToken() {
        const { user, session, errors: apiErrors } = await altogic.auth.getAuthGrant(access_token);
        if (!apiErrors) {
            auth.setSession(session);
            auth.setUser(user);
            await router.push({ name: 'profile' });
        } else {
            errors.value = apiErrors;
        }
    }
</script>
<template>
    <section class="h-screen flex flex-col gap-4 justify-center items-center">
        <div class="text-center" v-if="!errors">
            <p class="text-6xl">Please wait</p>
            <p class="text-3xl">You're redirecting to your profile...</p>
        </div>
        <div class="text-center text-red-500 text-3xl" v-else>
            <p :key="index" v-for="(error, index) in errors.items">{{ error.message }}</p>
        </div>
    </section>
</template>
```

## Authentication Store

Create a folder named `stores/` in the `src/` folder of your project and put a file named **auth.js** in it.

In this file, we will create a store for authentication. We will use this store to manage the authentication state of our app.

Then paste the code below into the file.

```js title="src/stores/auth.js"
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import altogic from '@/libs/altogic';
import router from '../router';

export const useAuthStore = defineStore('auth', () => {
    const _user = ref(altogic.auth.getUser());
    const _session = ref(altogic.auth.getSession());

    function setUser(user) {
        _user.value = user;
        altogic.auth.setUser(user);
    }
    function setSession(session) {
        _session.value = session;
        altogic.auth.setSession(session);
    }
    async function logout() {
        await altogic.auth.signOut();
        setUser(null);
        setSession(null);
        await router.push({ name: 'login' });
    }

    const user = computed(() => _user.value);
    const session = computed(() => _user.value);

    return { user, session, setUser, setSession, logout };
});
```

## Upload Profile Picture

Open Avatar.js and paste the below code to create an avatar for the user.

For convenience, we will be using the user's `_id` as the name of the uploaded file and upload the profile picture to the root directory of our app storage. If needed you can create different buckets for each user or a generic bucket to store all provided photos of users. The Altogic Client Library has all the methods to manage buckets and files.

```html title="src/components/Avatar.vue"
<script setup>
    import { useAuthStore } from '@/stores/auth';
    import altogic from '@/libs/altogic';
    import { computed, ref } from 'vue';
    const auth = useAuthStore();
    const loading = ref(false);
    const errors = ref(null);

    const userPicture = computed(
        () => auth.user.profilePicture || `https://ui-avatars.com/api/?name=${auth.user.name}`
    );

    async function changeHandler(e) {
        const file = e.target.files[0];
        e.target.value = null;
        if (!file) return;
        loading.value = true;
        errors.value = null;
        try {
            const { publicPath } = await uploadAvatar(file);
            const user = await updateUser({ profilePicture: publicPath });
            auth.setUser(user);
        } catch (error) {
            errors.value = error.message;
        } finally {
            loading.value = false;
        }
    }

    async function uploadAvatar(file) {
        const { data, errors } = await altogic.storage.bucket('root').upload(`user_${auth.user_id}`, file);
        if (errors) {
            throw new Error("Couldn't upload avatar, please try again later");
        }
        return data;
    }
    async function updateUser(data) {
        const { data: user, errors } = await altogic.db.model('users').object(auth.user._id).update(data);
        if (errors) {
            throw new Error("Couldn't update user, please try again later");
        }
        return user;
    }
</script>

<template>
    <div>
        <figure class="flex flex-col gap-4 items-center justify-center py-2">
            <picture class="border rounded-full w-24 h-24 overflow-hidden">
                <img class="object-cover w-full h-full" :src="userPicture" :alt="auth.user.name" />
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

```html title="src/components/UserInfo.vue"
<script setup>
    import { useAuthStore } from '../stores/auth';
    import altogic from '../libs/altogic';
    import { ref } from 'vue';
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
            errors.value = apiErrors.items[0].message;
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

In this component, we will use `altogic.auth.getAllSessions()` method to get the user's sessions and delete them.

```html title="src/components/Sessions.vue"
<script setup>
    import altogic from '../libs/altogic';
    import { onMounted, ref } from 'vue';
    import { useAuthStore } from '../stores/auth';
    const sessions = ref([]);
    const auth = useAuthStore();

    onMounted(() => {
        altogic.auth.getAllSessions().then(({ sessions: _sessions, errors }) => {
            if (!errors) {
                sessions.value = _sessions.map(session => {
                    return {
                        ...session,
                        isCurrent: session.token === auth.session.token,
                    };
                });
            }
        });
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
