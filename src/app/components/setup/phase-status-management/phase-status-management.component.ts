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
  selector: 'app-phase-status-management',
  templateUrl: './phase-status-management.component.html',
  styleUrls: ['./phase-status-management.component.css']
})
export class PhaseStatusManagementComponent implements OnInit {
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
    public _api: SetupService,
    public _userInfo: UserInfoComponent,
    public _router: Router
  ) {
    this.dock = new Dock();
    this.setDockControls();
  }

  ngOnInit() {
    this.loading = true;
    Observable.combineLatest(
      this._api.projectList(this._userInfo.getCountryId()),
      this._api.getStatusList()).subscribe(data => {
        console.log(data[0].json());
        if (data[0].json().ack == 'success' && data[0].json().Data != 'None') {
          this.simpleDock.dock.dockControls[0].controlOptions = data[0].json().Data;
          this.simpleDock.dock.dockControls[0].idKey = 'project_id';
          this.simpleDock.dock.dockControls[0].descKey = 'project_name';
        }
        if (data[1].json().ack == 'success' && data[1].json().Data != 'None') {
          this.simpleDock.dock.dockControls[2].controlOptions = data[1].json().Data;
          this.simpleDock.dock.dockControls[2].idKey = 'status_id';
          this.simpleDock.dock.dockControls[2].descKey = 'status_description';
        }
        this.loading = false;
      });
  }
  setDockControls() {
    this.dock.dockControls = [];
    this.addSelectToList(buttonconstants.Project);
    this.addSelectToList(buttonconstants.Phase);
    this.addSelectToList(buttonconstants.Status);
    this.addButtonToList(buttonconstants.Save, true);
    this.addButtonToList(buttonconstants.FilterByCSV, true);
    this.addButtonToList(buttonconstants.Tracking, true);
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
            } else {
              this.simpleDock.dock.dockControls[1].controlOptions = [];
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
          this._api.phaseStatusManagementGrid(event.value).subscribe(data => {
            if (data.json().ack == 'success' && data.json().Data != 'None') {
              this.details = data.json();
            } else {
              this.details = [];
            }
            this.loading = false;
          });
        }
        break;
      case buttonconstants.Status:
        break;
      case buttonconstants.Tracking:
        const phaseIdforAddTracking = this.simpleDock.dock.dockControls[1].value;
        if (this.checkifValid(phaseIdforAddTracking) && this.checkifValid(this.selectedRow) && this.selectedRow.length > 0) {
          const itemFortrackingCreation = this.selectedRow;
          for (const i in itemFortrackingCreation) {
            itemFortrackingCreation[i]['ID'] = null;
          }
          localStorage.setItem('EditTrackingItems', JSON.stringify(itemFortrackingCreation));
          this._router.navigate(['home/setup/addEditTracking', phaseIdforAddTracking, 'create']);
        }
        break;
      case buttonconstants.Refresh:
        const projectId = this.simpleDock.dock.dockControls[0].value;
        const phaseId = this.simpleDock.dock.dockControls[1].value;
        if (this.checkifValid(projectId) && this.checkifValid(phaseId)) {
          this.loading = true;
          this._api.phaseStatusManagementGrid(phaseId).subscribe(data => {
            if (data.json().ack == 'success' && data.json().Data != 'None') {
              this.details = data.json();
            } else {
              this.details = [];
            }
            this.loading = false;
          });
        }
        break;
      case buttonconstants.Save:
        const statusId = this.dock.dockControls[2].value;
        if (this.checkifValid(statusId) && this.checkifValid(this.selectedRow) && this.selectedRow.length != 0) {
          const phaseRequestItems: phaseRequestItem[] = [];
          for (const i in this.selectedRow) {
            const tmpObj: phaseRequestItem = {
              memberPhaseId: '',
              memberId: '',
              phaseId: '',
              statusId: ''
            };
            tmpObj.memberPhaseId = this.selectedRow[i]['ID'];
            tmpObj.memberId = this.selectedRow[i]['Member ID'];
            tmpObj.phaseId = this.selectedRow[i]['PhaseID'];
            tmpObj.statusId = this.dock.dockControls[2].value;
            phaseRequestItems.push(tmpObj);
          }
          const postData = {
            frMemberPhaseRequest: phaseRequestItems

          };
          this.loading = true;
          this._api.updateMemberPhase(postData).subscribe(data => {
            this.loading = false;
          },
            data => {
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
    console.log(event);
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
interface phaseRequestItem {
  memberPhaseId: string;
  memberId: string;
  phaseId: string;
  statusId: string;
}
