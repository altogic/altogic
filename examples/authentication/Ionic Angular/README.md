# Email & Password Based Authentication Using Ionic Angular & Altogic

You can access the full source code on our [example repository.](https://github.com/altogic/altogic/tree/main/examples/authentication/Ionic%20)

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

## Create Ionic Angular Project

To create a new Ionic app, open a terminal window and run the following command:

```bash
ionic start altogic-auth-ionic-angular blank --type angular
```

Open **altogic-auth-ionic-angular** folder in Visual Studio Code:

```bash
code altogic-auth-ionic-angular
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

Let’s create a `libs/` folder inside the `src/app` directory to add **altogic.ts** file.

Open `altogic.ts` and paste below code block to export the altogic client instance.

```ts title="src/app/libs/altogic.ts"
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

## Generate Page Components

We will generate our page components using the **Ionic CLI**. Open your terminal window and run the following command:

```bash
ionic generate page pages/home &&
ionic generate page pages/login &&
ionic generate page pages/register &&
ionic generate page pages/login-with-magic-link &&
ionic generate page pages/profile &&
ionic generate page pages/auth-redirect
```

### Home Page

Open `home.page.html` and paste below code block:

```html title="src/app/pages/home/home.page.html"
<ion-content>
    <div class="flex items-center justify-center gap-4 h-screen">
        <a routerLink="/login-with-magic-link" class="border px-4 py-2 font-medium text-sm"> Login With Magic Link </a>
        <a routerLink="/login" class="border px-4 py-2 font-medium text-sm"> Login </a>
        <a routerLink="/register" class="border px-4 py-2 font-medium text-sm"> Register </a>
    </div>
</ion-content>
```

### Login Page

Open `login.page.ts` and paste below code block to define.

In this component, we will use the `signInWithEmail()` method of the _Altogic_ client library to sign in the user.

```ts title="src/app/pages/login/login.page.ts"
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { APIError } from 'altogic';
import altogic from '../../libs/altogic';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
})
export class LoginPage implements OnInit {
    loginForm = this.fb.group({
        email: ['', Validators.required],
        password: ['', Validators.required],
    });
    errors: APIError | null = null;
    loading = false;

    constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {}
    ngOnInit(): void {}

    // @ts-ignore
    async submitHandler() {
        const { email, password } = this.loginForm.value;
        if (!email || !password) return;
        this.loading = true;
        this.errors = null;

        const { user, session, errors } = await altogic.auth.signInWithEmail(email, password);
        this.loading = false;

        if (errors) {
            this.errors = errors;
            return;
        }

        this.authService.setUserAndSession(user, session);
        await this.router.navigate(['profile']);
    }
}
```

then open your `login.page.html` and paste below code block:

```html title="src/app/pages/login/login.page.html"
<ion-content>
    <section class="container mx-auto px-4 flex flex-col items-center justify-center h-96 gap-4">
        <form (ngSubmit)="submitHandler()" [formGroup]="loginForm" class="flex flex-col gap-2 w-full md:w-96">
            <h1 class="self-start text-3xl font-bold">Login to your account</h1>
            <ng-container *ngIf="errors">
                <div *ngFor="let error of errors.items" class="bg-red-600 text-white text-[13px] p-2">
                    <p>{{ error.message }}</p>
                </div>
            </ng-container>
            <input class="text-black" formControlName="email" type="email" placeholder="Type your email" required />
            <input
                class="text-black"
                formControlName="password"
                type="password"
                placeholder="Type your password"
                required
            />
            <div class="flex justify-between gap-4 items-start">
                <a class="text-indigo-400" routerLink="/register">Don't have an account? Register now</a>
                <button
                    type="submit"
                    [disabled]="!loginForm.valid || loading"
                    class="py-2 px-3 bg-white text-black shrink-0"
                >
                    Login
                </button>
            </div>
        </form>
    </section>
</ion-content>
```

### Login With Magic Link Page

Open `login-with-magic-link.page.ts` and paste below code block to define.

In this page, we will show a form to **log in with Magic Link** with only email. We will use `altogic.auth.sendMagicLinkEmail()` method to sending magic link to user's email.

When the user clicks on the magic link in the email, Altogic verifies the validity of the magic link and, if successful, redirects the user to the redirect URL specified in your app authentication settings with an access token in a query string parameter named `access_token` The magic link flows in a similar way to the sign-up process. We use the `getAuthGrant()` method to create a new session and associated `sessionToken`.

```ts title="src/app/pages/login-with-magic-link/login-with-magic-link.page.ts"
import { Component, OnInit } from '@angular/core';
import altogic from '../../libs/altogic';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { APIError } from 'altogic';

@Component({
    selector: 'app-login-with-magic-link',
    templateUrl: './login-with-magic-link.page.html',
})
export class LoginWithMagicLinkPage implements OnInit {
    magicForm = this.fb.group({
        email: ['', Validators.required],
    });
    errors: APIError | null = null;
    loading = false;
    showMessage = false;
    constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {}

    ngOnInit(): void {}

    // @ts-ignore
    async submitHandler() {
        const { email } = this.magicForm.value;
        if (!email) return;
        this.loading = true;
        this.errors = null;
        this.showMessage = false;

        const { errors } = await altogic.auth.sendMagicLinkEmail(email);
        this.loading = false;

        if (errors) {
            this.errors = errors;
            return;
        }

        this.showMessage = true;
        this.magicForm.reset();
    }
}
```

then open your `login-with-magic-link.page.html` and paste below code block:

```html title="src/app/pages/login-with-magic-link/login-with-magic-link.page.html"
<ion-content>
    <section class="container mx-auto px-4 flex flex-col items-center justify-center h-96 gap-4">
        <form (ngSubmit)="submitHandler()" [formGroup]="magicForm" class="flex flex-col gap-2 w-full md:w-96">
            <h1 class="self-start text-3xl font-bold">Login with magic link</h1>

            <div *ngIf="showMessage" class="bg-green-600 text-white text-[13px] p-2">
                Your magic link has been sent to your email address.
            </div>

            <ng-container *ngIf="errors">
                <div *ngFor="let error of errors.items" class="bg-red-600 text-white text-[13px] p-2">
                    <p>{{ error.message }}</p>
                </div>
            </ng-container>

            <input class="text-black" formControlName="email" type="email" placeholder="Type your email" required />
            <div class="flex justify-between gap-4 items-start">
                <a class="text-indigo-600" routerLink="/register">Don't have an account? Register now</a>
                <button
                    type="submit"
                    [disabled]="!magicForm.valid || loading"
                    class="py-2 px-3 bg-white text-black shrink-0"
                >
                    Send magic link
                </button>
            </div>
        </form>
    </section>
</ion-content>
```

### Register Page

Open `register.page.ts` and paste below code block to define.

We will save session and user info to state if the api returns session. Then, user will be redirected to profile page.

If `signUpWithEmail` does not return session, it means user need to confirm email, so we will show the success message.

:::info
`signUpWithEmail` function can accept optional third parameter data to save the user's profile. We will save the user's name to the database in this example.
:::

```ts title="src/app/pages/register/register.page.ts"
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { APIError } from 'altogic';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import altogic from '../../libs/altogic';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
})
export class RegisterPage implements OnInit {
    registerForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', Validators.required],
    });
    errors: APIError | null = null;
    loading = false;
    isNeedToVerify = false;
    constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {}

    ngOnInit(): void {}

    // @ts-ignore
    async submitHandler() {
        const { email, password, name } = this.registerForm.value;
        if (!email || !password || !name) return;
        this.loading = true;
        this.errors = null;
        this.isNeedToVerify = false;

        const { user, session, errors } = await altogic.auth.signUpWithEmail(email, password, name);
        this.loading = false;

        if (errors) {
            this.errors = errors;
            return;
        }

        if (!session) {
            this.isNeedToVerify = true;
            this.registerForm.reset();
            return;
        }

        this.authService.setUserAndSession(user, session);
        await this.router.navigate(['profile']);
    }
}
```

then open your `register.page.html` and paste below code block:

```html title="src/app/pages/register/register.page.html"
<ion-content>
    <section class="container mx-auto px-4 flex flex-col items-center justify-center h-96 gap-4">
        <form (ngSubmit)="submitHandler()" [formGroup]="registerForm" class="flex flex-col gap-2 w-full md:w-96">
            <h1 class="self-start text-3xl font-bold">Create an account</h1>

            <div *ngIf="isNeedToVerify" class="bg-green-500 text-white p-2">
                Your account has been created. Please check your email to verify your account.
            </div>

            <ng-container *ngIf="errors">
                <div *ngFor="let error of errors.items" class="bg-red-600 text-white text-[13px] p-2">
                    <p>{{ error.message }}</p>
                </div>
            </ng-container>

            <input class="text-black" formControlName="email" type="email" placeholder="Type your email" required />
            <input class="text-black" formControlName="name" type="text" placeholder="Type your name" required />
            <input
                class="text-black"
                formControlName="password"
                type="password"
                placeholder="Type your password"
                required
            />
            <div class="flex justify-between gap-4">
                <a class="text-indigo-400" routerLink="/login">Already have an account?</a>
                <button
                    [disabled]="!registerForm.valid || loading"
                    type="submit"
                    class="py-2 px-3 bg-white text-black shrink-0"
                >
                    Register
                </button>
            </div>
        </form>
    </section>
</ion-content>
```

### Profile Page

Open `profile.page.ts` and paste below code block to define.

In this page, we will show the user's profile, and we will use `AuthService` to logout the current user.

```ts title="src/app/pages/profile/profile.page.ts"
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
})
export class ProfilePage implements OnInit {
    loading = false;
    constructor(private router: Router, private authService: AuthService) {}
    ngOnInit(): void {}

    async logout() {
        this.loading = true;
        await this.authService.logout();
        this.loading = false;
        await this.router.navigate(['/login']);
    }
}
```

then open your `profile.page.html` and paste below code block:

```html title="src/app/pages/profile/profile.page.html"
<ion-content>
    <section class="flex flex-col justify-center items-center gap-4 p-4">
        <app-avatar></app-avatar>
        <app-user-info></app-user-info>
        <app-sessions></app-sessions>
        <button (click)="logout()" class="bg-white rounded py-2 px-3 text-black w-full">
            {{ loading ? 'Processing...' : 'Logout' }}
        </button>
    </section>
</ion-content>
```

### Auth Redirect Page

Open `auth-redirect.page.ts` and paste below code block to define.

In this page we use the `getAuthGrant()` method to create a new session and associated `sessionToken` for verify email or sign in with magic link.

```ts title="src/app/pages/auth-redirect/auth-redirect.page.ts"
import { Component, OnInit } from '@angular/core';
import altogic from '../../libs/altogic';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { APIError } from 'altogic';

@Component({
    selector: 'app-auth-redirect',
    templateUrl: './auth-redirect.page.html',
})
export class AuthRedirectPage implements OnInit {
    errors: APIError | null = null;
    noToken = false;
    constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) {}

    ngOnInit(): void {
        this.verifyUser();
    }

    // @ts-ignore
    async verifyUser() {
        const token = this.route.snapshot.queryParamMap.get('access_token');

        if (!token) {
            this.noToken = true;
            return;
        }

        const { user, session, errors } = await altogic.auth.getAuthGrant(token);

        if (errors) {
            this.errors = errors;
            return;
        }

        this.authService.setUserAndSession(user, session);
        await this.router.navigate(['profile']);
    }
}
```

then open your `auth-redirect.page.html` and paste below code block to define:

```html title="src/app/pages/auth-redirect/auth-redirect.page.html"
<section class="h-screen flex flex-col gap-4 justify-center items-center">
    <div *ngIf="noToken; else hasTokenBlock" class="text-center text-red-500 text-6xl">No token provided</div>
    <ng-template #hasTokenBlock>
        <ng-container *ngIf="errors; else waitBlock">
            <div *ngFor="let error of errors.items" class="text-center text-red-500 text-3xl">
                <p>{{ error.message }}</p>
            </div>
        </ng-container>
        <ng-template #waitBlock>
            <div class="text-center">
                <p class="text-6xl">Please wait</p>
                <p class="text-3xl">You're redirecting to your profile...</p>
            </div>
        </ng-template>
    </ng-template>
</section>
```

## Generate Shared Components

we will generate our shared components using the **Ionic CLI**. Open your terminal window and run the following command:

```bash
ionic generate component components/avatar &&
ionic generate component components/sessions &&
ionic generate component components/user-info
```

### Update User Info

Open `user-info.component.ts` and paste below code block to define.

In this component, we will use **Altogic's** database operations to update user's name.

```ts title="/src/app/components/user-info/user-info.component.ts"
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { User } from 'altogic';
import altogic from '../../libs/altogic';

@Component({
    selector: 'app-user-info',
    templateUrl: './user-info.component.html',
})
export class UserInfoComponent implements OnInit {
    errors: null | string = null;
    changeMode = false;
    loading = false;
    name = new FormControl(this.getUserName(), [Validators.required]);
    constructor(private authService: AuthService) {}
    getUserName() {
        return this.authService.user?.name;
    }
    async saveName() {
        this.loading = true;
        this.errors = null;

        const { data, errors: apiErrors } = await altogic.db
            .model('users')
            .object(this.authService.user?._id)
            .update({ name: this.name.value });

        if (apiErrors) {
            this.errors = apiErrors.items[0].message;
        } else {
            this.authService.setUser(data as User);
        }

        this.loading = false;
        this.changeMode = false;
    }
    ngOnInit() {}
}
```

then open your `user-info.component.html` and paste below code block:

```html title="/src/app/components/user-info/user-info.component.html"
<section class="border p-4 container w-full">
    <div class="flex items-center justify-center" *ngIf="changeMode">
        <input
            (keydown.enter)="saveName()"
            autofocus
            [formControl]="name"
            type="text"
            class="border-none text-3xl text-center text-white bg-transparent border"
        />
    </div>
    <div class="space-y-4 flex flex-col items-center" *ngIf="!changeMode">
        <h1 class="text-3xl text-center">Hello, {{ getUserName() }}</h1>
        <button (click)="changeMode = true" class="border p-2 bg-white text-black">Change name</button>
    </div>
    <div *ngIf="errors">{{ errors }}</div>
</section>
```

### Upload Profile Picture

Open `avatar.component.ts` and paste below code block to define:

For convenience, we will be using the user's `_id` as the name of the uploaded file and upload the profile picture to the root directory of our app storage. If needed you can create different buckets for each user or a generic bucket to store all provided photos of users. The Altogic Client Library has all the methods to manage buckets and files.

```ts title="/src/app/components/avatar/avatar.component.ts"
import { Component, OnInit } from '@angular/core';
import { User } from 'altogic';
import altogic from '../../libs/altogic';
import { AuthService } from '../../shared/auth.service';

@Component({
    selector: 'app-avatar',
    templateUrl: './avatar.component.html',
})
export class AvatarComponent implements OnInit {
    loading = false;
    errors = null;
    constructor(private authService: AuthService) {}

    getUserName() {
        return this.authService.user?.name;
    }

    getUserPhoto() {
        return (
            this.authService.user?.profilePicture ||
            `https://ui-avatars.com/api/?name=${this.getUserName()}&background=0D8ABC&color=fff`
        );
    }

    // @ts-ignore
    async onFileChange(event: any) {
        const [file] = event.target.files;
        event.target.value = null;
        if (!file) return;

        this.loading = true;
        this.errors = null;

        try {
            const profilePicture = await this.uploadAvatar(file);
            const user = await this.updateUser({ profilePicture });
            this.authService.setUser(user as User);
        } catch (error: any) {
            this.errors = error.message;
        } finally {
            this.loading = false;
        }
    }
    async uploadAvatar(file: any) {
        // @ts-ignore
        const { data, errors } = await altogic.storage
            .bucket('root')
            .upload(`user_${this.authService.user?._id}`, file);
        if (errors) {
            // @ts-ignore
            throw new Error("Couldn't upload avatar, please try again later");
        }
        // @ts-ignore
        return data.publicPath;
    }
    // @ts-ignore
    async updateUser(data: Partial<User>) {
        const { data: user, errors } = await altogic.db.model('users').object(this.authService.user?._id).update(data);
        if (errors) {
            // @ts-ignore
            throw new Error("Couldn't update user, please try again later");
        }
        return user as User;
    }
    ngOnInit(): void {}
}
```

then open your `avatar.component.html` and paste below code block:

```html title="/src/app/components/avatar/avatar.component.html"
<div>
    <figure class="flex flex-col gap-4 items-center justify-center py-2">
        <picture class="border rounded-full w-24 h-24 overflow-hidden">
            <img class="object-cover w-full h-full" [src]="getUserPhoto()" [alt]="getUserName()" />
        </picture>
    </figure>
    <div class="flex flex-col gap-4 justify-center items-center">
        <label class="bg-white text-black p-2 cursor-pointer">
            <span>{{ loading ? 'Uploading...' : 'Change Avatar' }}</span>
            <input (change)="onFileChange($event)" [disabled]="loading" class="hidden" type="file" accept="image/*" />
        </label>
        <div class="bg-red-500 p-2 text-white" *ngIf="errors">{{ errors }}</div>
    </div>
</div>
```

### Manage Sessions

Open `sessions.component.ts` and paste below code block to define:

In this component, we will use `altogic.auth.getAllSessions()` method to get the user's all sessions.

```ts title="/src/app/components/sessions/sessions.component.ts"
import { Component, HostBinding, OnInit } from '@angular/core';
import { APIError, Session } from 'altogic';
import altogic from '../../libs/altogic';
import { AuthService } from '../../shared/auth.service';

interface SessionData extends Session {
    isCurrent: boolean;
}

@Component({
    selector: 'app-sessions',
    templateUrl: './sessions.component.html',
})
export class SessionsComponent implements OnInit {
    sessions: SessionData[] | null = null;
    errors: APIError | null = null;
    constructor(private authService: AuthService) {}
    @HostBinding('class.w-full')
    ngOnInit(): void {
        this.getSessions();
    }

    // @ts-ignore
    async getSessions() {
        const { sessions, errors } = await altogic.auth.getAllSessions();

        if (errors) {
            this.errors = errors;
            return;
        }

        this.sessions = sessions?.map((session: Session) => {
            return {
                ...session,
                isCurrent: session.token === this.authService.session?.token,
                // @ts-ignore
                creationDtm: new Date(session.creationDtm).toLocaleDateString('en-US'),
            };
        }) as SessionData[];
    }

    async logoutSession(session: Session) {
        const { errors } = await altogic.auth.signOut(session.token);
        if (!errors) {
            // @ts-ignore
            this.sessions = this.sessions?.filter(s => s.token !== session.token) as SessionData[];
        }
    }
}
```

then open your `sessions.component.html` and paste below code block:

```html title="/src/app/components/sessions/sessions.component.html"
<div class="border p-4 space-y-4">
    <p class="text-3xl">All Sessions</p>
    <ul class="flex flex-col gap-2">
        <ng-container *ngIf="errors">
            <div *ngFor="let error of errors.items" class="bg-red-600 text-white text-[13px] p-2">
                <p>{{ error.message }}</p>
            </div>
        </ng-container>
        <ng-container *ngIf="!errors">
            <li class="flex justify-between gap-12" *ngFor="let session of sessions">
                <div>
                    <span *ngIf="session?.isCurrent"> Current Session </span>
                    <span *ngIf="!session?.isCurrent">
                        <strong>Device name: </strong>
                        {{ session?.userAgent?.device?.family }}
                    </span>
                </div>
                <div class="flex items-center gap-2">
                    <span>{{ session.creationDtm }}</span>
                    <button
                        *ngIf="!session?.isCurrent"
                        (click)="logoutSession(session)"
                        class="bg-white text-black grid place-items-center p-2 h-8 w-8 aspect-square leading-none"
                    >
                        X
                    </button>
                </div>
            </li>
        </ng-container>
    </ul>
</div>
```

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

## Create Routes

Open `app-routing.module.ts` and paste below code block to define the routes.

```ts title="/src/app/app-routing.module.ts"
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { GuestGuard } from './shared/guest.guard';
import { AuthGuard } from './shared/auth.guard';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
        canActivate: [GuestGuard],
    },
    {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
        canActivate: [GuestGuard],
    },
    {
        path: 'login-with-magic-link',
        loadChildren: () =>
            import('./pages/login-with-magic-link/login-with-magic-link.module').then(
                m => m.LoginWithMagicLinkPageModule
            ),
        canActivate: [GuestGuard],
    },
    {
        path: 'register',
        loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule),
        canActivate: [GuestGuard],
    },
    {
        path: 'profile',
        loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'auth-redirect',
        loadChildren: () => import('./pages/auth-redirect/auth-redirect.module').then(m => m.AuthRedirectPageModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
```

## Generate an Auth Service

We will generate a service to handle the authentication process.

Run the following command to generate a service:

```bash
ionic generate service shared/auth
```

In the `auth.service.ts` file, we will add the following code block to store the user data and handle the authentication process.

```ts title="src/app/shared/auth.service.ts"
import { Injectable } from '@angular/core';
import { Session, User } from 'altogic';
import altogic from '../libs/altogic';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    user: User | null = altogic.auth.getUser();
    session: Session | null = altogic.auth.getSession();

    async logout() {
        await altogic.auth.signOut();
        this.setUserAndSession(null, null);
    }

    setUserAndSession(user: User | null, session: Session | null) {
        this.user = user;
        this.session = session;

        if (session && user) {
            altogic.auth.setUser(user);
            altogic.auth.setSession(session);
        }
    }

    setUser(user: User | null) {
        this.user = user;
        if (user) altogic.auth.setUser(user);
    }
}
```

## Generate Auth and Guest Guard

We will generate some **guards** to protect our routes.

Run the following command to generate a guards:

```bash
ionic generate guard shared/auth && ionic generate guard shared/guest
```

then, you should select the `CanActivate` option for each by pressing enter.

## Define Auth Guard

In this guard, we will check if the user is logged in or not. If the user is logged in, we will return true, otherwise, we will redirect the user to the login page.

Replace the `auth.guard.ts` file with the following code block:

```ts title="src/app/shared/auth.guard.ts"
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.authService.user) return true;
        this.router.navigate(['login']);
        return false;
    }
}
```

## Define Guest Guard

In this guard, we will check if the user is logged in or not. If the user is logged in, we will return false and redirect the user to the profile page, otherwise, we will return true.

Replace the `guest.guard.ts` file with the following code block:

```ts title="src/app/shared/guest.guard.ts"
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class GuestGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.authService.user) {
            this.router.navigate(['profile']);
            return false;
        }
        return true;
    }
}
```

## Conclusion

Congratulations!✨

You had completed the most critical part of the Authentication flow, which includes private routes, sign-up, sign-in, and sign-out operations.

If you have any questions about Altogic or want to share what you have built, please post a message in our [community forum](https://community.altogic.com/home) or [discord channel](https://discord.gg/ERK2ssumh8).
