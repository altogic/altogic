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
			import('./pages/login-with-magic-link/login-with-magic-link.module').then(m => m.LoginWithMagicLinkPageModule),
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
