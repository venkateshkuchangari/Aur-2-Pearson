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
import { User } from '../../model/user.model';

@Component({
  selector: 'app-phase-tracking',
  templateUrl: './phase-tracking.component.html',
  styleUrls: ['./phase-tracking.component.css']
})
export class PhaseTrackingComponent implements OnInit {
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
    private _api: SetupService,
    private _userinfo: UserInfoComponent,
    private _router: Router,
    private _dialog: MatDialog
  ) {
    this.dock = new Dock();
    this.setDockControls();
  }

  ngOnInit() {
    this.loading = true;
    Observable.combineLatest(
      this._api.projectList(this._userinfo.getCountryId())
    ).subscribe(data => {
      if (data[0].json().ack == 'success' && data[0].json().Data != 'None' && data[0].json().Data != '') {
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
    this.addButtonToList(buttonconstants.Edit, true);
    this.addButtonToList(buttonconstants.Delete, true);
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
          this._api.getPhaseTrackingGrid(event.value).subscribe(data => {
            if (data.json().ack == 'success' && data.json().Data != 'None') {
              this.details = data.json();
            } else {
              this.details = [];
            }
            this.loading = false;
          });
        }
        break;


      case buttonconstants.Refresh:
        const projectId = this.simpleDock.dock.dockControls[0].value;
        const phaseId = this.simpleDock.dock.dockControls[1].value;
        if (this.checkifValid(projectId) && this.checkifValid(phaseId)) {
          this.loading = true;
          this._api.phaseStatusManagementGrid(phaseId).subscribe(data => {
            if (data.json().ack == 'success' && data.json().Data != 'None' && data.json().Data != '') {
              this.details = data.json();
            } else {
              this.details = [];
            }
            this.loading = false;
          });
        }
        break;
      case buttonconstants.Delete:
        if (this.checkifValid(this.selectedRow) && this.selectedRow.length == 1) {
          const dialogRef = this._dialog.open(DialogComponent, {
            width: '250px',
            data: {
              item: 'Tracking',
              id: this.selectedRow[0]['ID']
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result == 'yes') {
              this.loading = true;
              this._api.deleteTracking(this.selectedRow[0]['ID']).subscribe(result => {
                this.loading = false;
                this.handleDocEvent({ eventInfo: 'refresh', value: undefined });
              });
            }
          });
        }
        break;
      case buttonconstants.Edit:
        const phaseIdForEdit = this.dock.dockControls[1].value;
        if (
          this.checkifValid(this.selectedRow)
          && this.selectedRow.length > 0
          && this.checkifValid(phaseIdForEdit)
          && this.checkifValid(this.selectedRow)
          && this.selectedRow.length > 0) {
          localStorage.setItem('EditTrackingItems', JSON.stringify(this.selectedRow));
          this._router.navigate(['home/setup/addEditTracking', this.dock.dockControls[1].value, 'edit']);
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
