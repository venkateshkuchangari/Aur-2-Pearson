import { Dock, DockControl, KeyValuePair } from './../../common/dock.controls';
import { Component, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-add-member-to-phase',
  templateUrl: './add-member-to-phase.component.html',
  styleUrls: ['./add-member-to-phase.component.css']
})
export class AddMemberToPhaseComponent implements OnInit {
  public dock: Dock;
  public dockControl: DockControl;
  public formGroup: FormGroup;
  public editorOptions: Object;
  public loading: boolean;
  public fetchData: any;
  public details: any;
  public selectedRow: any;
  @ViewChild(SimpleDockComponent) simpleDock: SimpleDockComponent;

  constructor(
    public _router: Router,
    public _userInfo: UserInfoComponent,
    public _api: SetupService
  ) {
    this.dock = new Dock();
    this.setDockControls();
  }

  ngOnInit() {
    this.loading = true;
    Observable.combineLatest(
      this._api.projectList(this._userInfo.getCountryId())
    ).subscribe(data => {
      if (data[0].json().ack == 'success' && data[0].json().Data != 'None') {
        this.simpleDock.dock.dockControls[0].controlOptions = data[0].json().Data;
        this.simpleDock.dock.dockControls[0].idKey = 'project_id';
        this.simpleDock.dock.dockControls[0].descKey = 'project_name';
      }
      this.loading = false;
    });
  }
  setDockControls() {
    this.dock.dockControls = [];
    this.addSelectToList(buttonconstants.Project);
    this.addSelectToList(buttonconstants.Phase);
    this.addButtonToList(buttonconstants.Add, true);
    this.addButtonToList(buttonconstants.Refresh, true);
  }

  addButtonToList(buttonType: any, enable: boolean) {
    this.dockControl = new DockControl();
    this.dockControl.type = 'button';
    this.dockControl.label = buttonType;
    this.dockControl.enable = enable;
    this.dockControl.value = '';
    this.dock.dockControls.push(this.dockControl);
  }
  addSelectToList(name: string) {
    this.dockControl = new DockControl();
    this.dockControl.type = 'selectSpecified';
    this.dockControl.label = '';
    this.dockControl.enable = true;
    this.dockControl.key = name;
    this.dockControl.value = '';
    this.dock.dockControls.push(this.dockControl);
  }
  handleDocEvent(event: any) {
    const eventType = event.eventInfo;
    console.log(eventType);
    switch (eventType) {
      case buttonconstants.Project:
        if (this.checkifValid(event.value)) {
          this.loading = true;
          this._api.getPhaseList(event.value).subscribe(data => {
            if (data.json().ack == 'success' && data.json().Data != 'None') {
              this.simpleDock.dock.dockControls[1].controlOptions = data.json().Data;
              this.simpleDock.dock.dockControls[1].idKey = 'phase_id';
              this.simpleDock.dock.dockControls[1].descKey = 'phase_name';
            }
            this.loading = false;
          });
        }
        break;
      case buttonconstants.Phase:
        if (this.checkifValid(event.value)) {
          this.loading = true;
          this._api.addMembersToPhaseGrid(event.value).subscribe(data => {
            if (data.json().ack == 'success' && data.json().Data != 'None') {
              this.details = data.json();
            }
            this.loading = false;
          });
        }
        break;
      case buttonconstants.Add:
        if (this.checkifValid(this.selectedRow) && this.selectedRow.length > 0) {
          const reqArray: savePhaseTrackItem[] = [];
          for (const i in this.selectedRow) {
            const saveItem: savePhaseTrackItem = {
              memberId: '',
              phaseId: '',
              statusId: ''
            };
            saveItem.memberId = this.selectedRow[i]['Member ID'];
            saveItem.phaseId = this.dock.dockControls[1].value;
            saveItem.statusId = '31';
            reqArray.push(saveItem);
          }
          const postdata = {
            frMemberPhaseRequest: reqArray
          };
          this.loading = true;
          this._api.savePhaseStatusManagement(postdata).subscribe(data => {
            this.loading = false;
          },
            data => {
              this.loading = false;
            });
        }
        break;
      case buttonconstants.Refresh:
        const phaseId = this.dock.dockControls[1].value;
        if (this.checkifValid(phaseId)) {
          this.loading = true;
          this._api.addMembersToPhaseGrid(phaseId).subscribe(data => {
            if (data.json().ack == 'success' && data.json().Data != 'None') {
              this.details = data.json();
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
  handleTableEvent(event) {
    const eventType = event.eventInfo.toLowerCase();
    switch (eventType) {
      case 'rowselected':
        if (event.value && event.value.length > 0 && event.value[0].ID != undefined) {
          this.selectedRow = event.value;
        } else {
          this.selectedRow = null;
        }
        break;
    }
  }

}
interface savePhaseTrackItem {
  memberId: string;
  phaseId: string;
  statusId: string;
}
