// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { MembersComponent } from './members.component';
import { MemebersRoutingModule } from './members-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SimpleDockModule } from '../common/simple-dock/simple-dock.module';
import { MaterialModule } from '../../shared/modules/material.module';
import { DynamicTableModule } from '../common/dynamic-table/dynamic-table.module';
import { DynamicFormModule } from '../common/dynamic-form/dynamic-form.module';
import { MemberspageComponent } from './memberspage/memberspage.component';

@NgModule({
    imports: [
        MemebersRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        SimpleDockModule,
        MaterialModule,
        DynamicTableModule,
        DynamicFormModule
    ],
    declarations: [
        MembersComponent,
        MemberspageComponent
    ],
    exports: [
        MembersComponent,
    ]
})
export class MembersModule {

}
