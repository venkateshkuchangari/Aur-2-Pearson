import { NgModule } from '@angular/core';
import { DialogComponent } from './dialog/dialog.component';
import { MaterialModule } from '../../shared/modules/material.module';

@NgModule({
  imports: [MaterialModule],
  declarations: [DialogComponent],
  exports: [DialogComponent],
  entryComponents: [DialogComponent]
})
export class DialogModule { }
