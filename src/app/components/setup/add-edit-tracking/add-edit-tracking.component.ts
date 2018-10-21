import { Dock, DockControl, KeyValuePair } from './../../common/dock.controls';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as buttonconstants from '../../common/app.buttonconstants';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import { SimpleDockComponent } from '../../common/simple-dock/simple-dock.component';
import { Router, ActivatedRoute } from '@angular/router';
import { UserInfoComponent } from '../../../shared/userinfo.component';
//import { GeneralService } from '../general.service';
import { SetupService } from '../setup.service';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../../dialog/dialog/dialog.component';

@Component({
  selector: 'app-add-edit-tracking',
  templateUrl: './add-edit-tracking.component.html',
  styleUrls: ['./add-edit-tracking.component.css']
})
export class AddEditTrackingComponent implements OnInit {
  public dock: Dock;
  public dockControl: DockControl;
  public loading: boolean;
  public phaseId: any;
  public formGroup: FormGroup;
  public memberList: any[];
  public testList: any[];
  public typeList: any[];
  public members: any[];
  public opType: string;

  constructor(public _route: ActivatedRoute,
    public _api: SetupService,
    public _fb: FormBuilder,
    public _router: Router) {
    this.dock = new Dock();
    this.setDockControls();
    this.memberList = [];
    this.members = [];
  }

  ngOnInit() {
    this.formGroup = this._fb.group({
      testId: ['', Validators.required],
      typeId: ['', Validators.required],
      date: ['', Validators.required]

    });
    this._route.params.subscribe(data => {
      this.phaseId = data.phaseId;
      this.opType = data.optype;
      this.loading = true;
      Observable.combineLatest(this._api.selectTestDropdown(this.phaseId),
        this._api.selectTypedropdown()).subscribe(data => {
          if (data[0].json().ack == 'success' && data[0].json().Data != 'None' && data[0].json().Data != '') {
            this.testList = data[0].json().Data;
          }
          if (data[1].json().ack == 'success' && data[1].json().Data != 'None' && data[1].json().Data != '') {
            this.typeList = data[1].json().Data;
          }
          this.memberList = JSON.parse(localStorage.getItem('EditTrackingItems'));
          localStorage.removeItem('EditTrackingItems');
          console.log(this.memberList);
          for (const i in this.memberList) {
            this.members.push(this.memberList[i]['Member ID']);
          }
          this.loading = false;
        });
    });
  }
  setDockControls() {
    this.dock.dockControls = [];
    this.addButtonToList(buttonconstants.Save, true);
    this.addButtonToList(buttonconstants.Cancel, true);
  }

  addButtonToList(buttonType: any, enable: boolean) {
    this.dockControl = new DockControl();
    this.dockControl.type = 'button';
    this.dockControl.label = buttonType;
    this.dockControl.enable = enable;
    this.dockControl.value = '';
    this.dock.dockControls.push(this.dockControl);
  }
  handleDocEvent(event: any) {
    const eventType = event.eventInfo;
    console.log(eventType);
    switch (eventType) {
      case buttonconstants.Save:
        for (const i in this.formGroup.controls) {
          this.formGroup.controls[i].markAsTouched();
        }
        if (this.formGroup.valid) {
          if (this.opType == 'edit') {
            const updateItems: frUpdateMemberPhaseTracking[] = [];
            for (const i in this.memberList) {
              const obj = {
                memberPhaseTrackingId: this.memberList[i]['ID'],
                memberId: this.memberList[i]['Member ID'],
                phaseTestId: this.formGroup.get('testId').value,
                trackingTypeId: this.formGroup.get('typeId').value,
                trackingDate: this.formatDate(this.formGroup.get('date').value)
              };
              updateItems.push(obj);
            }
            const posData = {
              frUpdateMemberPhaseTracking: updateItems
            };
            console.log(posData);
            this.loading = true;
            this._api.updateTrackingData(posData).subscribe(data => {
              this.loading = false;
              this._router.navigate(['home/setup/phaseStausManagement']);
            });
          } else {
            const saveItemsItems: frSaveMemberPhaseTracking[] = [];
            for (const i in this.memberList) {
              const obj = {
                memberId: this.memberList[i]['Member ID'],
                phaseTestId: this.formGroup.get('testId').value,
                trackingTypeId: this.formGroup.get('typeId').value,
                trackingDate: this.formatDate(this.formGroup.get('date').value)
              };
              saveItemsItems.push(obj);
            }
            const posData = {
              frSaveMemberPhaseTracking: saveItemsItems
            };
            this.loading = true;
            this._api.saveTrackingData(posData).subscribe(data => {
              this.loading = false;
              this._router.navigate(['/home/setup/phaseStausManagement']);
            });
            console.log(posData);
          }

        }
        break;
      case buttonconstants.Cancel:
      this._router.navigate(['/home/setup/phaseStausManagement']);
        break;
    }
  }
  formatDate(date: string) {
    const tmp = new Date(date);
    return  tmp.getFullYear() + '/' + (tmp.getMonth() + 1) + tmp.getDate();
  }

}
interface frUpdateMemberPhaseTracking {
  memberPhaseTrackingId: string;
  memberId: string;
  phaseTestId: string;
  trackingTypeId: string;
  trackingDate: string;
}
interface frSaveMemberPhaseTracking {
  memberId: string;
  phaseTestId: string;
  trackingTypeId: string;
  trackingDate: string;
}
