import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import { UserInfoComponent } from '../../components/user-info/user-info.component';
import { SessionsComponent } from '../../components/sessions/sessions.component';

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule, ProfilePageRoutingModule, ReactiveFormsModule],
	declarations: [ProfilePage, AvatarComponent, UserInfoComponent, SessionsComponent],
})
export class ProfilePageModule {}
