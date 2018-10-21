import { NgModule } from '@angular/core';
import { UserListComponent } from './user-list/user-list.component';
import { SetupRoutingModule } from './setup-routing/setup-routing.module';
import { LoaderModule } from '../loader/loader.module';
import { DialogModule } from '../dialog/dialog.module';
import { MaterialModule } from '../../shared/modules/material.module';
import { SimpleDockModule } from '../common/simple-dock/simple-dock.module';
import { DynamicTableModule } from '../common/dynamic-table/dynamic-table.module';

import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/multiselect.component';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ColorPickerModule } from 'ngx-color-picker';
// import { SettingService } from './settings.service';
import { AccountService} from './account.service';


@NgModule({
  imports: [
    CommonModule,
    SetupRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    MaterialModule,
    LoaderModule,
    DialogModule,
    SimpleDockModule,
    DynamicTableModule,
    AngularMultiSelectModule,
    ColorPickerModule

  ],
  declarations: [
    UserListComponent,
    AddEditUserComponent,
    AccountSettingsComponent
  ],
  providers: [AccountService]
})
export class AccountModule { }
