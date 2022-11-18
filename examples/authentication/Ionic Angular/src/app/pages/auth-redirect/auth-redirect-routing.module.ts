import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthRedirectPage } from './auth-redirect.page';

const routes: Routes = [
  {
    path: '',
    component: AuthRedirectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRedirectPageRoutingModule {}
