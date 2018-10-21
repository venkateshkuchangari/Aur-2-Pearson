// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { SimpleDockComponent } from './simple-dock.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/modules/material.module';

@NgModule({
    imports: [
        AngularDraggableModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MaterialModule
    ],
    declarations: [
        SimpleDockComponent,
    ],
    exports: [
        SimpleDockComponent,
    ]
})
export class SimpleDockModule {

}
