import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from '../user-list/user-list.component';
import { AddEditUserComponent } from '../add-edit-user/add-edit-user.component';
import { AccountSettingsComponent } from '../account-settings/account-settings.component';
import { RoleGuardService } from '../../../services/role-guard.service';

const route: Routes = [
  {
    path: 'userList',
    component: UserListComponent
  },
  {
    path: 'addEditUser',
    component: AddEditUserComponent,
    canActivate: [RoleGuardService]
  },
  {
    path: 'accountSettings',
    component: AccountSettingsComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(route)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class SetupRoutingModule { }
