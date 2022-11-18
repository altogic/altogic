import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginWithMagicLinkPage } from './login-with-magic-link.page';

const routes: Routes = [
  {
    path: '',
    component: LoginWithMagicLinkPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginWithMagicLinkPageRoutingModule {}
