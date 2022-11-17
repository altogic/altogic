import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginWithMagicLinkComponent } from './pages/login-with-magic-link/login-with-magic-link.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRedirectComponent } from './pages/auth-redirect/auth-redirect.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { SessionsComponent } from './components/sessions/sessions.component';
import { UserInfoComponent } from './components/user-info/user-info.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		RegisterComponent,
		HomeComponent,
		LoginWithMagicLinkComponent,
		ProfileComponent,
  AuthRedirectComponent,
  AvatarComponent,
  SessionsComponent,
  UserInfoComponent,
	],
	imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
