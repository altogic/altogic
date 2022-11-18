# Email & Password Based Authentication Using Ionic Vue & Altogic

You can access the full source code on our [example repository.](https://github.com/altogic/altogic/tree/main/examples/authentication/Ionic%20Vue)

## Introduction

[Altogic](https://www.altogic.com) is a Backend as a Service (BaaS) platform and provides a variety of services in modern web and mobile development. Most modern applications using Ionic or other libraries/frameworks require knowing the identity of a user. And this necessity allows an app to securely save user data and session in the cloud and provide more personalized functionalities and views to users.

Altogic has an authentication service that integrates and implements well in JAMstack apps. It has a ready-to-use [Javascript client library](https://www.npmjs.com/package/altogic), and it supports many authentication providers such as email/password, phone number, magic link, and OAuth providers like Google, Facebook, Twitter, Github, Apple etc.,

In this tutorial, we will implement email/password authentication with Ionic and take a look at how as a Ionic developer, we build applications and integrate with Altogic Authentication.

After completion of this tutorial, you will learn the following:

-   How to create sample screens to display forms like login and signup.
-   How to create a home screen and authorize only logged-in users.
-   How to create an authentication flow by conditionally rendering between these pages whether a user is logged in.
-   How to authenticate users using the magic link
-   How to update user profile info and upload a profile picture
-   How to manage active sessions of a user
-   And we will integrate Altogic authentication with the email/password method.

If you are new to Ionic applications, this tutorial is definitely for you to understand the basics and even advanced concepts.

## How email-based sign-up works in Altogic

By default, when you create an app in Altogic, email-based authentication is enabled. In addition, during email-based authentication, the email address of the user is also verified. Below you can find the flow of email and password-based sign-up process.

<Banner
alt="Email & Password based authentication flow"
src="/client/img/quickstart-guides/global/auth-flow.png"
width={650}>
Email & Password Based Authentication Flow
</Banner>

If email verification is disabled, then after step 2, Altogic immediately returns a new session to the user, meaning that steps after step #2 in the above flow are not executed. You can easily configure email-based authentication settings from the **App Settings > Authentication** in Altogic Designer. One critical parameter you need to specify is the Redirect URL, you can customize this parameter from **App Settings > Authentication**. Finally, you can customize the email message template from the **App Settings > Authentication > Message Templates**.

:::note
For frontend apps that use server-side rendering, the session token needs to be stored in an HTTP cookie so that the client browser and the frontend server can exchange session information. Otherwise, the session information can be lost, and the Altogic Client library methods that require a session token can fail.
:::

## Prerequisites

To complete this tutorial, make sure you have installed the following tools and utilities on your local development environment.

-   [VsCode](https://code.visualstudio.com/download)
-   [NodeJS](https://nodejs.org/en/download/)
-   [Ionic App](https://ionicframework.com/)
-   You also need an Altogic Account. If you do not have one, you can create an account by [signin up for Altogic](https://designer.altogic.com/).

## Creating an Altogic App

We will use Altogic as a backend service platform, so let’s visit [Altogic Designer](https://designer.altogic.com/) and create an account.

<Banner
alt="Altogic Dashboard"
src="/client/img/quickstart-guides/global/1-applications.png"
width={650}>
Altogic Workspace
</Banner>

After creating an account, you will see the workspace where you can access your apps.

Click + New app and follow the instructions;

1. In the App name field, enter a name for the app.
2. Enter your subdomain.
3. Choose the deployment location.
4. And select your free execution environment pricing plan.

<Banner
alt="Create an Altogic App"
src="/client/img/quickstart-guides/global/2-create-app.png"
width={650}>
Create an Application
</Banner>

Then, click Next and select Basic template. This template creates a default user data model for your app which is required by [**Altogic Client Library**](https://www.altogic.com/client/) to store user data and manage authentication. You can add additional user fields to this data model (e.g., name, surname, gender, birthdate) and when calling the `signUpWithEmail` method of the client library you can pass these additional data.

<Banner
alt="Choose Template"
src="/client/img/quickstart-guides/global/3-choose-template.png"
width={650}>
Choose Template
</Banner>

:::tip
If you do not select the basic template, instead selected the blank app template the user data model will not be created for your app. In order to use the Altogic Client Library's authentication methods you need a user data model to store the user data. You can easily create a new data model manually and from the **App Settings > Authentication** mark this new data model as your user data model.
:::

Then click Next to confirm and create an app.

Awesome! We have created our application; now click/tap on the **newly created app to launch the Designer.** In order to access the app and use the Altogic client library, we should get `envUrl` and `clientKey` of this app. You can use any one of the API base URLs specified for your app environment as your envUrl.

Click the **Home** icon at the left sidebar to copy the `envUrl` and `clientKey`.

<Banner
alt="Client Library Keys"
src="/client/img/quickstart-guides/global/4-client-keys.png"
width={650}>
Client Key & Enviroment URL
</Banner>

Once the user created successfully, our Ionic app will route the user to the Verification page, and a verification email will be sent to the user’s email address. When the user clicks the link in the mail, the user will navigate to the redirect page to grant authentication rights. After successfully creating a session on the Redirect page, users will be redirected to the Home page.

:::info
If you want, you can deactivate or customize the mail verification from **App Settings -> Authentication** in Altogic Designer.
:::

<Banner
alt="Verification Mail Settings"
src="/client/img/quickstart-guides/global/mail.png"
width={650}>
Email & Authentication Settings
</Banner>

## Install the Ionic CLI

We use the Ionic CLI to create projects, generate application.

To install the Ionic CLI, open a terminal window and run the following command:

```bash
npm install -g @ionic/cli
```

## Create Ionic Vue Project

To create a new Ionic app, open a terminal window and run the following command:

```bash
ionic start altogic-auth-ionic-vue blank --type vue
```

Open **altogic-auth-ionic-vue** folder in Visual Studio Code:

```bash
code altogic-auth-ionic-vue
```

## Integrating With Altogic

Our backend and frontend is now ready and running on the server. ✨

Now, we can install the Altogic client library to our Angular app to connect our frontend with the backend.

```bash
# using npm
npm install altogic
# OR is using yarn
yarn add altogic
```

Let’s create a `libs/` folder inside the `src/` directory to add **altogic.ts** file.

Open `altogic.ts` and paste below code block to export the altogic client instance.

```ts title="src/libs/altogic.ts"
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

Let's create some views in `src/views` folder as below:

```
src/
└── views/
    ├── Home.vue
    ├── Login.vue
    ├── Register.vue
    ├── Profile.vue
    ├── AuthRedirect.vue
    └── LoginWithMagicLink.vue
```

Open the `src/router/index.ts` file and paste the code below into the file.

In this file, we will create a router for our app. We will use this router to navigate between pages.

```ts title="src/router/index.ts"
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue';
import Home from '@/views/Home.vue';
import { useAuthStore } from '@/store/auth';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: Home,
        meta: {
            requiresGuest: true,
        },
    },
    {
        path: '/login',
        component: () => import('@/views/Login.vue'),
        meta: {
            requiresGuest: true,
        },
    },
    {
        path: '/profile',
        component: () => import('@/views/Profile.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/register',
        component: () => import('@/views/Register.vue'),
        meta: {
            requiresGuest: true,
        },
    },
    {
        path: '/login-with-magic-link',
        component: () => import('@/views/LoginWithMagicLink.vue'),
        meta: {
            requiresGuest: true,
        },
    },
    {
        path: '/auth-redirect',
        component: () => import('@/views/AuthRedirect.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const auth = useAuthStore();
    if (to.meta.requiresAuth && !auth.user) {
        return next('/login');
    }
    if (to.meta.requiresGuest && auth.user) {
        return next('/profile');
    }
    next();
});

export default router;
```

### Home View

In this page, we will show Login, Login With Magic Link and Register buttons.

```html title="src/views/Home.vue"
<script lang="ts">
    import { defineComponent } from 'vue';
    import { IonPage, IonContent } from '@ionic/vue';

    export default defineComponent({
        name: 'HomePage',
        components: { IonContent, IonPage },
    });
</script>

<template>
    <ion-page>
        <ion-content :fullscreen="true">
            <div class="flex justify-center gap-2 h-screen items-center">
                <router-link class="border px-4 py-2 font-medium text-sm" to="/login-with-magic-link">
                    Login With Magic Link
                </router-link>
                <router-link class="border px-4 py-2 font-medium text-sm" to="/login">Login</router-link>
                <router-link class="border px-4 py-2 font-medium text-sm" to="/register">Register</router-link>
            </div>
        </ion-content>
    </ion-page>
</template>
```

### Login View

In this page, we will show a form to log in with email and password. We will use `altogic.auth.signInWithEmail()` method to sign-in.

```html title="src/views/Login.vue"
<script lang="ts">
    import { defineComponent, ref } from 'vue';
    import altogic from '@/libs/altogic';
    import { APIError } from 'altogic';
    import { useAuthStore } from '@/store/auth';
    import { useRouter } from 'vue-router';
    import { IonPage, IonContent } from '@ionic/vue';

    export default defineComponent({
        name: 'LoginPage',
        components: { IonPage, IonContent },
        setup() {
            const email = ref('');
            const password = ref('');
            const errors = ref<APIError | null>(null);
            const loading = ref(false);
            const auth = useAuthStore();
            const router = useRouter();

            async function loginHandler() {
                loading.value = true;
                errors.value = null;
                const {
                    errors: apiErrors,
                    user,
                    session,
                } = await altogic.auth.signInWithEmail(email.value, password.value);
                loading.value = false;

                if (apiErrors) {
                    errors.value = apiErrors;
                    return;
                }

                email.value = '';
                password.value = '';

                auth.setUser(user);
                auth.setSession(session);
                await router.push('/profile');
            }

            return {
                email,
                password,
                loading,
                errors,
                loginHandler,
            };
        },
    });
</script>

<template>
    <ion-page>
        <ion-content :fullscreen="true">
            <section class="container px-4 mx-auto flex flex-col items-center justify-center h-96 gap-4">
                <form @submit.prevent="loginHandler" class="flex flex-col gap-2 w-full md:w-96">
                    <h1 class="self-start text-3xl font-bold">Login to your account</h1>

                    <div v-if="errors" class="bg-red-600 text-white text-[13px] p-2">
                        <p v-for="(error, index) in errors.items" :key="index">{{ error.message }}</p>
                    </div>

                    <input class="text-black" v-model="email" type="email" placeholder="Type your email" required />
                    <input
                        class="text-black"
                        v-model="password"
                        type="password"
                        placeholder="Type your password"
                        required
                    />
                    <div class="flex justify-between gap-4 items-start">
                        <router-link class="text-indigo-400" to="/register">
                            Don't have an account? Register now
                        </router-link>
                        <button
                            :disabled="loading"
                            type="submit"
                            class="bg-white text-black py-2 px-3 transition shrink-0"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </section>
        </ion-content>
    </ion-page>
</template>
```

### Login With Magic Link View

In this page, we will show a form to **log in with Magic Link** with only email. We will use `altogic.auth.sendMagicLinkEmail()` method to sending magic link to user's email.

When the user clicks on the magic link in the email, Altogic verifies the validity of the magic link and, if successful, redirects the user to the redirect URL specified in your app authentication settings with an access token in a query string parameter named `access_token` The magic link flows in a similar way to the sign-up process. We use the `getAuthGrant()` method to create a new session and associated `sessionToken`.

```html title="src/views/LoginWithMagicLink.vue"
<script lang="ts">
    import { defineComponent, ref } from 'vue';
    import { IonContent, IonPage } from '@ionic/vue';
    import altogic from '@/libs/altogic';
    import { APIError } from 'altogic';

    export default defineComponent({
        name: 'LoginPage',
        components: {
            IonContent,
            IonPage,
        },
        setup() {
            const successMessage = ref('');
            const loading = ref(false);
            const email = ref('');
            const errors = ref<APIError | null>(null);

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
            return {
                email,
                errors,
                loginHandler,
                loading,
                successMessage,
            };
        },
    });
</script>

<template>
    <ion-page>
        <ion-content :fullscreen="true">
            <section class="container mx-auto px-4 flex flex-col items-center justify-center h-96 gap-4">
                <form @submit.prevent="loginHandler" class="flex flex-col gap-2 w-full md:w-96">
                    <h1 class="self-start text-3xl font-bold">Login with magic link</h1>
                    <div v-if="successMessage" class="bg-green-600 text-white text-[13px] p-2">
                        {{ successMessage }}
                    </div>
                    <div v-if="errors" class="bg-red-600 text-white text-[13px] p-2">
                        <p v-for="(error, index) in errors.items" :key="index">{{ error.message }}</p>
                    </div>

                    <input class="text-black" v-model="email" type="email" placeholder="Type your email" required />
                    <div class="flex justify-between gap-4 items-start">
                        <router-link class="text-indigo-400" to="/register">
                            Don't have an account? Register now
                        </router-link>
                        <button
                            :disabled="loading"
                            type="submit"
                            class="text-black py-2 px-3 bg-white transition shrink-0"
                        >
                            Send magic link
                        </button>
                    </div>
                </form>
            </section>
        </ion-content>
    </ion-page>
</template>
```

### Register View

In this page, we will show a form to sign up with email and password. We will use `altogic.auth.signUpWithEmail()` method to sign-up.

We will save session and user info to state if the api returns session. Then, user will be redirected to profile page.

If `signUpWithEmail` does not return session, it means user need to confirm email, so we will show the success message.

:::info
`signUpWithEmail` method can accept optional third parameter data to save the user's profile. We will save the user's name to the database in this example.
:::

```html title="src/views/Register.vue"
<script lang="ts">
    import { defineComponent, ref } from 'vue';
    import { APIError } from 'altogic';
    import { useAuthStore } from '@/store/auth';
    import { useRouter } from 'vue-router';
    import altogic from '@/libs/altogic';
    import { IonPage, IonContent } from '@ionic/vue';

    export default defineComponent({
        name: 'RegisterPage',
        components: { IonPage, IonContent },
        setup() {
            const email = ref('');
            const password = ref('');
            const name = ref('');
            const errors = ref<APIError | null>(null);
            const loading = ref(false);
            const isNeedToVerify = ref(false);
            const auth = useAuthStore();
            const router = useRouter();

            async function registerHandler() {
                loading.value = true;
                errors.value = null;
                const {
                    errors: apiErrors,
                    user,
                    session,
                } = await altogic.auth.signUpWithEmail(email.value, password.value, name.value);
                loading.value = false;

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
                await router.push('/profile');
            }

            return {
                isNeedToVerify,
                email,
                name,
                password,
                loading,
                errors,
                registerHandler,
            };
        },
    });
</script>

<template>
    <ion-page>
        <ion-content :fullscreen="true">
            <section class="container mx-auto px-4 flex flex-col items-center justify-center h-96 gap-4">
                <form @submit.prevent="registerHandler" class="flex flex-col gap-2 w-full md:w-96">
                    <h1 class="self-start text-3xl font-bold">Create an account</h1>

                    <div v-if="isNeedToVerify" class="bg-green-500 text-white p-2">
                        Your account has been created. Please check your email to verify your account.
                    </div>

                    <div v-if="errors" class="bg-red-600 text-white text-[13px] p-2">
                        <p v-for="(error, index) in errors.items" :key="index">{{ error.message }}</p>
                    </div>

                    <input class="text-black" v-model="email" type="email" placeholder="Type your email" required />
                    <input class="text-black" v-model="name" type="text" placeholder="Type your name" required />
                    <input
                        class="text-black"
                        v-model="password"
                        type="password"
                        placeholder="Type your password"
                        required
                    />
                    <div class="flex justify-between gap-4">
                        <router-link class="text-indigo-400" to="/login">Already have an account?</router-link>
                        <button type="submit" class="bg-white text-black py-2 px-3 transition shrink-0">
                            Register
                        </button>
                    </div>
                </form>
            </section>
        </ion-content>
    </ion-page>
</template>
```

### Profile View

In this page, we will show the user's profile.

```html title="src/views/Profile.vue"
<script lang="ts">
    import { defineComponent } from 'vue';
    import { IonPage, IonContent } from '@ionic/vue';
    import { useAuthStore } from '@/store/auth';
    import Avatar from '@/components/Avatar.vue';
    import Sessions from '@/components/Sessions.vue';
    import UserInfo from '@/components/UserInfo.vue';
    export default defineComponent({
        name: 'ProfilePage',
        components: { IonContent, IonPage, Avatar, Sessions, UserInfo },
        setup() {
            const auth = useAuthStore();
            return {
                auth,
            };
        },
    });
</script>

<template>
    <ion-page>
        <ion-content :fullscreen="true">
            <div class="max-w-full px-4 flex flex-col gap-4">
                <Avatar />
                <UserInfo />
                <Sessions />
                <button @click="auth.logout" class="bg-gray-600 rounded py-2 px-3 text-white">Logout</button>
            </div>
        </ion-content>
    </ion-page>
</template>
```

### Auth Redirect View

In this page we use the `getAuthGrant()` method to create a new session and associated `sessionToken` for verify email or sign in with magic link.

```html title="src/views/AuthRedirect.vue"
<script lang="ts">
    import { defineComponent, ref, onMounted } from 'vue';
    import altogic from '@/libs/altogic';
    import { APIError } from 'altogic';
    import { useRoute, useRouter } from 'vue-router';
    import { useAuthStore } from '@/store/auth';
    import { IonPage, IonContent } from '@ionic/vue';

    export default defineComponent({
        name: 'AuthRedirectPage',
        components: { IonPage, IonContent },
        setup() {
            const auth = useAuthStore();
            const { access_token } = useRoute().query;
            const router = useRouter();
            const errors = ref<APIError | null>(null);

            onMounted(() => {
                loginWithToken();
            });

            async function loginWithToken() {
                const { user, session, errors: apiErrors } = await altogic.auth.getAuthGrant(access_token?.toString());
                if (!apiErrors) {
                    auth.setSession(session);
                    auth.setUser(user);
                    await router.push('/profile');
                } else {
                    errors.value = apiErrors;
                }
            }
            return {
                auth,
                errors,
            };
        },
    });
</script>
<template>
    <ion-page>
        <ion-content :fullscreen="true">
            <section class="h-screen flex flex-col gap-4 justify-center items-center">
                <div class="text-center" v-if="!errors">
                    <p class="text-6xl">Please wait</p>
                    <p class="text-3xl">You're redirecting to your profile...</p>
                </div>
                <div class="text-center text-red-500 text-3xl" v-else>
                    <p :key="index" v-for="(error, index) in errors.items">{{ error.message }}</p>
                </div>
            </section>
        </ion-content>
    </ion-page>
</template>
```

## Authentication Store

### Installation of Pinia

We will use [Pinia](https://pinia.vuejs.org/) to manage our authentication state.

Open the terminal and run the following command:

```bash
npm install pinia
```

Open the `src/main.ts` file and import the `createPinia` function from the `pinia` library. Then, call the function inside the `use()` method.

```js title="src/main.ts"
import { createPinia } from 'pinia'; // <-- Add this line
const app = createApp(App)
    .use(IonicVue)
    .use(createPinia()) //  <-- Add this line
    .use(router);
```

### Create the Store

Create a folder named `stores/` in the `src/` folder of your project and put a file named **auth.ts** in it.

In this file, we will create a store for authentication. We will use this store to manage the authentication state of our app.

Then paste the code below into the file.

```ts title="src/store/auth.ts"
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import router from '../router';
import altogic from '@/libs/altogic';
import { Session, User } from 'altogic';

export const useAuthStore = defineStore('auth', () => {
    const _user = ref(altogic.auth.getUser());
    const _session = ref(altogic.auth.getSession());

    function setUser(user: User | null) {
        _user.value = user;
        if (user) altogic.auth.setUser(user);
    }
    function setSession(session: Session | null) {
        _session.value = session;
        if (session) altogic.auth.setSession(session);
    }
    async function logout() {
        await altogic.auth.signOut();
        setUser(null);
        setSession(null);
        await router.push('/login');
    }

    const user = computed(() => _user.value);
    const session = computed(() => _session.value);
    return { user, session, setUser, setSession, logout };
});
```

## Upload Profile Picture

Open Avatar.js and paste the below code to create an avatar for the user.

For convenience, we will be using the user's `_id` as the name of the uploaded file and upload the profile picture to the root directory of our app storage. If needed you can create different buckets for each user or a generic bucket to store all provided photos of users. The Altogic Client Library has all the methods to manage buckets and files.

```html title="src/components/Avatar.vue"
<script lang="ts">
    import altogic from '@/libs/altogic';
    import { defineComponent, computed, ref } from 'vue';
    import { useAuthStore } from '@/store/auth';
    import { User } from 'altogic';

    export default defineComponent({
        name: 'AvatarComponent',
        setup() {
            const auth = useAuthStore();
            const loading = ref(false);
            const errors = ref<string | null>(null);
            const userPicture = computed(
                () => auth.user?.profilePicture || `https://ui-avatars.com/api/?name=${auth.user?.name}`
            );
            async function changeHandler(e: any) {
                const file = e.target.files[0];
                e.target.value = null;
                if (!file) return;
                loading.value = true;
                errors.value = null;
                try {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    const { publicPath } = await uploadAvatar(file);
                    const user = await updateUser({ profilePicture: publicPath });
                    auth.setUser(user);
                } catch (error: any) {
                    errors.value = error.message;
                } finally {
                    loading.value = false;
                }
            }

            async function uploadAvatar(file: File) {
                const { data, errors } = await altogic.storage.bucket('root').upload(`user_${auth.user?._id}`, file);
                if (errors) {
                    throw new Error("Couldn't upload avatar, please try again later");
                }
                return data;
            }
            async function updateUser(data: Partial<User>) {
                const { data: user, errors } = await altogic.db.model('users').object(auth.user?._id).update(data);
                if (errors) {
                    throw new Error("Couldn't update user, please try again later");
                }
                return user as User;
            }

            return {
                auth,
                loading,
                errors,
                userPicture,
                changeHandler,
            };
        },
    });
</script>
<template>
    <div>
        <figure class="flex flex-col gap-4 items-center justify-center py-2">
            <picture class="border rounded-full w-24 h-24 overflow-hidden">
                <img class="object-cover w-full h-full" :src="userPicture" :alt="auth.user?.name" />
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
<script lang="ts">
    import { ref, defineComponent } from 'vue';
    import altogic from '../libs/altogic';
    import { useAuthStore } from '@/store/auth';
    import { User } from 'altogic';

    export default defineComponent({
        name: 'UserInfoComponents',
        setup() {
            const auth = useAuthStore();
            const username = ref(auth?.user?.name);
            const loading = ref(false);
            const inputRef = ref<HTMLInputElement>();
            const changeMode = ref(false);
            const errors = ref<string | null>(null);

            function openChangeMode() {
                changeMode.value = true;
                setTimeout(() => {
                    inputRef.value?.focus();
                }, 100);
            }

            async function saveName() {
                loading.value = true;
                errors.value = null;

                let { data, errors: apiErrors } = await altogic.db
                    .model('users')
                    .object(auth.user?._id)
                    .update({ name: username.value });
                let user = data as User;

                if (apiErrors) {
                    errors.value = apiErrors.items[0].message;
                    return;
                } else {
                    username.value = user.name;
                    auth.setUser(user);
                }

                loading.value = false;
                changeMode.value = false;
            }

            return {
                auth,
                username,
                loading,
                inputRef,
                changeMode,
                errors,
                openChangeMode,
                saveName,
            };
        },
    });
</script>

<template>
    <section class="border p-4 w-full">
        <div class="flex items-center justify-center" v-if="changeMode">
            <input
                @keyup.enter="saveName"
                ref="inputRef"
                type="text"
                v-model="username"
                class="bg-transparent text-white border-none text-3xl text-center"
            />
        </div>
        <div class="space-y-4 flex flex-col items-center" v-else>
            <h1 class="text-3xl text-center">Hello, {{ auth.user?.name }}</h1>
            <button @click="openChangeMode" class="bg-white text-black p-2">Change name</button>
        </div>
        <div v-if="errors">{{ errors }}</div>
    </section>
</template>
```

## Manage Sessions

In this component, we will use `altogic.auth.getAllSessions()` method to get the user's sessions and delete them.

```html title="src/components/Sessions.vue"
<script lang="ts">
    import altogic from '../libs/altogic';
    import { defineComponent, ref, onMounted } from 'vue';
    import { useAuthStore } from '@/store/auth';
    import { Session } from 'altogic';

    export default defineComponent({
        name: 'SessionsComponents',
        setup() {
            const sessions = ref<Session[]>([]);
            const auth = useAuthStore();

            onMounted(() => {
                altogic.auth.getAllSessions().then(({ sessions: _sessions, errors }) => {
                    if (!errors && _sessions) {
                        sessions.value = _sessions.map(session => {
                            return {
                                ...session,
                                isCurrent: session.token === auth.session?.token,
                            };
                        });
                    }
                });
            });
            async function logoutSession(session: Session) {
                const { errors } = await altogic.auth.signOut(session.token);
                if (!errors) {
                    sessions.value = sessions.value.filter(s => s.token !== session.token);
                }
            }
            return {
                logoutSession,
                sessions,
            };
        },
    });
</script>

<template>
    <div class="max-w-full border p-4 space-y-4">
        <p class="text-3xl">All Sessions</p>
        <ul class="flex flex-col gap-2">
            <li :key="session.token" class="flex justify-between gap-4" v-for="session in sessions">
                <div class="text-sm">
                    <span v-if="session?.isCurrent"> Current Session </span>
                    <span v-else> <strong>Device name: </strong>{{ session?.userAgent?.device?.family }}</span>
                </div>
                <div class="flex items-center gap-2">
                    <span>{{ new Date(session.creationDtm).toLocaleDateString('en-US') }}</span>
                    <button
                        v-if="!session?.isCurrent"
                        @click="logoutSession(session)"
                        class="bg-white text-black grid place-items-center p-2 h-8 w-8 aspect-square leading-none"
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
