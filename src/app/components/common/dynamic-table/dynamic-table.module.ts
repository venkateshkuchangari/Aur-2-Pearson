// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { DynamicTableComponent } from './dynamic-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/modules/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MaterialModule,
        FlexLayoutModule
    ],
    declarations: [
        DynamicTableComponent,
    ],
    exports: [
        DynamicTableComponent,
    ]
})
export class DynamicTableModule {

}
