import { Component, OnInit, ViewChild } from '@angular/core';
import { Dock, DockControl, KeyValuePair } from './../../common/dock.controls';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as buttonconstants from '../../common/app.buttonconstants';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import { SimpleDockComponent } from '../../common/simple-dock/simple-dock.component';
import { Router } from '@angular/router';
import { UserInfoComponent } from '../../../shared/userinfo.component';
//import { GeneralService } from '../general.service';
import { SetupService } from '../setup.service';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../../dialog/dialog/dialog.component';

@Component({
  selector: 'app-digital-test-email-template',
  templateUrl: './digital-test-email-template.component.html',
  styleUrls: ['./digital-test-email-template.component.css']
})
export class DigitalTestEmailTemplateComponent implements OnInit {
  public dock: Dock;
  public dockControl: DockControl;
  public formGroup: FormGroup;
  public editorOptions: Object;
  public loading: boolean;
  public fetchData: any;
  public ckEditorConfig: any;
  @ViewChild(SimpleDockComponent) simpleDock: SimpleDockComponent;

  constructor(public _fb: FormBuilder,
    public api: SetupService,
    public router: Router,
    public dialog: MatDialog,
    public _userInfo: UserInfoComponent) {
    this.dock = new Dock();
    this.dockControl = new DockControl();
    this.setDockControls();
    this.loading = false;
    this.editorOptions = {
      height: 250,
      placeholderText: 'Please Insert Template Text',
      quickInsertTags: [],
      quickInsertButtons: []
    };
    this.ckEditorConfig = buttonconstants.CKEditorSettings;
  }

  ngOnInit() {
    this.formGroup = this._fb.group({
      template: ['', Validators.required]
    });
    this.loading = true;
    Observable.combineLatest(this.api.getTestList(this._userInfo.getCountryId())).subscribe(data => {
      console.log(data[0].json().Data.length);
      if (data[0].json().ack == 'success') {
        const keyValuePairs = [];
        let i = 0;
        for (i = 0; i < data[0].json().Data.length; i++) {
          const tempObj = {
            ID: data[0].json().Data[i].id,
            Description: data[0].json().Data[i]['Test Name']
          };
          keyValuePairs.push(tempObj);
        }
        this.simpleDock.dock.dockControls[3].controlOptions = keyValuePairs;
        this.simpleDock.dock.dockControls[3].value = '';
        this.loading = false;
      }
    });
  }
  setDockControls() {
    this.dock.dockControls = [];
    this.dock.backgroundcolor = '#343a40';
    this.addButtonToList(buttonconstants.Save, true);
    this.addButtonToList(buttonconstants.Cancel, true);
    this.addButtonToList(buttonconstants.Delete, true);
    this.addSelectToList(true);
  }
  addButtonToList(buttonType: any, enable: boolean) {
    this.dockControl = new DockControl();
    this.dockControl.type = 'button';
    this.dockControl.label = buttonType;
    this.dockControl.enable = enable;
    this.dockControl.value = '';
    this.dock.dockControls.push(this.dockControl);
  }
  addSelectToList(enable: boolean) {
    this.dockControl = new DockControl();
    this.dockControl.type = 'select';
    this.dockControl.label = '';
    this.dockControl.enable = enable;
    this.dockControl.key = 'Test';
    this.dockControl.dropDownSettings = {
      singleSelection: true,
      text: 'Select Test',
      enableSearchFilter: true,
      lazyLoading: true,
      primaryKey: 'id',
      labelKey: 'Test Name',
      maxHeight: 200
    };
    this.dockControl.data = [];
    this.dockControl.selectedItems = [];
    this.dock.dockControls.push(this.dockControl);
  }
  handleDocEvent(event: any) {
    const eventType = event.eventInfo.toLowerCase();
    console.log(eventType);
    switch (eventType) {
      case 'save':
        let i: any;
        for (i in this.formGroup.controls) {
          this.formGroup.controls[i].markAsTouched();
        }
        if (this.formGroup.valid) {
          if (this.checkifValid(this.fetchData)) {
            this.loading = true;
            const postData = {
              'testEmailTemplateId': this.fetchData.testEmailTemplateId,
              'testId': this.fetchData.testId,
              'htmlScript': this.formGroup.get('template').value
            };
            this.api.updateDigitalTestEmailTemplate(postData).subscribe(data => {
              this.loading = false;
              this.router.navigate(['home']);
            });
          } else {
            if (this.checkifValid(this.simpleDock.dock.dockControls[3].value)) {
              const postData = {
                'testId': this.simpleDock.dock.dockControls[3].value,
                'htmlScript': this.formGroup.get('template').value
              };
              this.loading = true;
              this.api.saveDigitalTestEmailTemplate(postData).subscribe(data => {
                this.loading = false;
                this.router.navigate(['home']);
              });
            }
          }
        }
        break;
      case 'delete':
        if (this.checkifValid(this.fetchData)) {
          const dialogRef = this.dialog.open(DialogComponent, {
            width: '250px',
            data: {
              item: 'Digital Test Email Template',
              id: this.fetchData.testEmailTemplateId
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result == 'yes') {
              this.loading = true;
              this.api.deleteDigitalTestEmailTemplate(this.fetchData.testEmailTemplateId).subscribe(result => {
                this.loading = false;
                this.router.navigate(['home']);
              });
            }
          });
        }
        break;
      case 'cancel':
        this.router.navigate(['home']);
        break;
      case 'test':
        if (this.checkifValid(event.value)) {
          this.loading = true;
          this.api.fetchDigitalTestEmailTemplate(event.value).subscribe(data => {
            console.log(data.json());
            if (data.json().ack == 'success') {
              this.fetchData = data.json().Data[0];
              this.formGroup.patchValue({
                template: data.json().Data[0].htmlScript
              });

            } else {
              this.formGroup.patchValue({
              template: ''
              });
              }

            this.loading = false;
          });
        }
        break;
    }
  }
  checkifValid(data) {
    if (data != null && data != undefined && data != '') {
      return true;
    }
    return false;
  }
}
