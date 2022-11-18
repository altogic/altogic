import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginWithMagicLinkPageRoutingModule } from './login-with-magic-link-routing.module';

import { LoginWithMagicLinkPage } from './login-with-magic-link.page';

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule, LoginWithMagicLinkPageRoutingModule, ReactiveFormsModule],
	declarations: [LoginWithMagicLinkPage],
})
export class LoginWithMagicLinkPageModule {}
