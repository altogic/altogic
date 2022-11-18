import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { AuthRedirectPageRoutingModule } from './auth-redirect-routing.module';

import { AuthRedirectPage } from './auth-redirect.page';

@NgModule({
	imports: [CommonModule, IonicModule, AuthRedirectPageRoutingModule],
	declarations: [AuthRedirectPage],
})
export class AuthRedirectPageModule {}
