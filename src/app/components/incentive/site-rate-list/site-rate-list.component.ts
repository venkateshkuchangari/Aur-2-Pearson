import { SimpleDockComponent } from './../../common/simple-dock/simple-dock.component';
import { Cancel } from './../../common/app.buttonconstants';
import { Save } from './../../../shared/app.buttonconstants';
import { Dock, DockControl } from './../../common/dock.controls';
import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as buttonconstants from '../../common/app.buttonconstants';
import { IncentiveService } from '../incentive.service';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { UserInfoComponent } from '../../../shared/userinfo.component';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../../dialog/dialog/dialog.component';


@Component({
  selector: 'app-site-rate-list',
  templateUrl: './site-rate-list.component.html',
  styleUrls: ['./site-rate-list.component.css']
})
export class SiteRateListComponent implements OnInit {
  public dock: Dock;
  public dockControl: DockControl;
  public details: any;
  public selectedRow: any;
  public loading: boolean;
  public newlyCreatedPhaseId: any;
  @ViewChild(SimpleDockComponent) simpleDock: SimpleDockComponent;

  constructor(public _incentiveService: IncentiveService, public _router: Router, public _userInfo: UserInfoComponent, public dialog: MatDialog) {
    this.dock = new Dock();
    this.setDockControls();
    this.loading = false;
    this.newlyCreatedPhaseId = null;
    this.newlyCreatedPhaseId = localStorage.getItem('phaseIdAfterCreate');
    console.log(this.newlyCreatedPhaseId);
    localStorage.removeItem('phaseIdAfterCreate');
  }

  ngOnInit() {
    this.loading = true;
    Observable.combineLatest(
      this._incentiveService.getProjectList(this._userInfo.getCountryId())).subscribe(data => {
        const keyValuePairs = [];
        let i = 0;
        for (i = 0; i < data[0].json().Data.length; i++) {
          const tempObj = {
            ID: data[0].json().Data[i].project_id,
            Description: data[0].json().Data[i].project_name
          };
          keyValuePairs.push(tempObj);
        }
        this.simpleDock.dock.dockControls[3].controlOptions = keyValuePairs;
        this.loading = false;
        const projectId = localStorage.getItem('projectId');
        localStorage.removeItem('projectId');
        if (projectId != null) {
          this.simpleDock.dock.dockControls[3].value = projectId;
          this._incentiveService.getPhaseList(projectId).subscribe(data => {
            this.simpleDock.dock.dockControls[4].controlOptions = [];
            if (data.json().ack != 'failure') {
              const keyValuePairs = [];
              let i = 0;
              for (i = 0; i < data.json().Data.length; i++) {
                const tempObj = {
                  ID: data.json().Data[i].phase_id,
                  Description: data.json().Data[i].phase_name
                };
                keyValuePairs.push(tempObj);
              }
              this.simpleDock.dock.dockControls[4].controlOptions = keyValuePairs;
              this.simpleDock.dock.dockControls[4].value = this.newlyCreatedPhaseId;
            }
            console.log('controlOptions' + this.simpleDock.dock.dockControls[4].controlOptions);
            this.loading = false;
          });
        }
        if (this.newlyCreatedPhaseId != null) {
          this.loading = true;
          this._incentiveService.getSiteRateList(this.newlyCreatedPhaseId).subscribe(data => {
            if (data.json().ack == 'success') {
              this.details = data.json();
            }
            this.loading = false;
          });
        }

      });
  }
  setDockControls() {
    this.dock.dockControls = [];
    this.dock.backgroundcolor = '#343a40';
    this.addButtonToList(buttonconstants.Add, true);
    this.addButtonToList(buttonconstants.Edit, true);
    this.addButtonToList(buttonconstants.Delete, true);
    this.addSelectToList('Project', true);
    this.addSelectToList('Phase', true);
    this.addButtonToList(buttonconstants.Copy, true);
    this.addButtonToList(buttonconstants.Refresh, true);
  }

  addButtonToList(buttonType: any, enable: boolean) {
    this.dockControl = new DockControl();
    this.dockControl.type = 'button';
    this.dockControl.label = buttonType;
    this.dockControl.enable = enable;
    this.dock.dockControls.push(this.dockControl);
  }
  addSelectToList(key: string, enable: boolean) {
    this.dockControl = new DockControl();
    this.dockControl.type = 'select';
    this.dockControl.label = '';
    this.dockControl.value = '';
    this.dockControl.enable = enable;
    this.dockControl.key = key;
    this.dock.dockControls.push(this.dockControl);
  }
  handleDocEvent(event: any) {
    console.log(event);
    const eventType = event.eventInfo.toLowerCase();
    switch (eventType) {
      case 'add':
        localStorage.removeItem('examinerSiteRateEdit');
        const phaseIdForAdd = this.simpleDock.dock.dockControls[4].value;
        const projecIdForAdd = this.simpleDock.dock.dockControls[3].value;
        console.log(phaseIdForAdd);
        if (phaseIdForAdd != undefined && phaseIdForAdd != null && phaseIdForAdd != '') {
          localStorage.setItem('phaseId', phaseIdForAdd);
          localStorage.setItem('projectId', projecIdForAdd);
          this._router.navigate(['/home/incentive/createExaminerSiteRate']);
        }
        break;
      case 'edit':
        const phaseIdForEdit = this.simpleDock.dock.dockControls[4].value;
        const projecIdForEdit = this.simpleDock.dock.dockControls[3].value;
        if (this.selectedRow != null) {
          localStorage.setItem('phaseId', phaseIdForEdit);
          localStorage.setItem('projectId', projecIdForEdit);
          localStorage.setItem('examinerSiteRateEdit', JSON.stringify(this.selectedRow));
          this._router.navigate(['/home/incentive/createExaminerSiteRate']);
        }
        break;
      case 'delete':
        if (this.selectedRow != null && this.selectedRow != undefined) {
          const dialogRef = this.dialog.open(DialogComponent, {
            width: '250px',
            data: {
              item: 'Examiner Site Rate',
              id: this.selectedRow.id
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result == 'yes') {
              this.loading = true;
              this._incentiveService.deleteExaminerSiteRate(this.selectedRow.id).subscribe(result => {
                this.loading = false;
                console.log('success' + result);
              });
            }
          });
        }
        break;
      case 'project':
        this.loading = true;
        if (event.value != undefined && event.value != '') {
          this._incentiveService.getPhaseList(event.value).subscribe(data => {
            this.simpleDock.dock.dockControls[4].controlOptions = [];
            if (data.json().ack != 'failure') {
              const keyValuePairs = [];
              let i = 0;
              for (i = 0; i < data.json().Data.length; i++) {
                const tempObj = {
                  ID: data.json().Data[i].phase_id,
                  Description: data.json().Data[i].phase_name
                };
                keyValuePairs.push(tempObj);
              }
              this.simpleDock.dock.dockControls[4].controlOptions = keyValuePairs;
              this.simpleDock.dock.dockControls[4].value = '';
            }
            console.log('controlOptions' + this.simpleDock.dock.dockControls[4].controlOptions);
            this.loading = false;
          });
        }
        break;
      case 'refresh':
        const phaseId = this.simpleDock.dock.dockControls[4].value;
        console.log(phaseId + '-phaseID');
        if (phaseId != null && phaseId != undefined && phaseId != '') {
          this.loading = true;
          this._incentiveService.getSiteRateList(phaseId).subscribe(data => {
            if (data.json().ack == 'success') {
              this.details = data.json();
            }
            this.loading = false;
          });
        }
        break;
      case 'phase':
        const phaseIdFromSelect = this.simpleDock.dock.dockControls[4].value;
        if (phaseIdFromSelect != null && phaseIdFromSelect != undefined && phaseIdFromSelect != '') {
          this.loading = true;
        }
        this._incentiveService.getSiteRateList(phaseIdFromSelect).subscribe(data => {
          if (data.json().ack == 'success') {
            this.details = data.json();
          }
          this.loading = false;
        });
        break;
      case 'copy':
        const projectIdForCopy = this.simpleDock.dock.dockControls[3].value;
        const phaseIdForCopy = this.simpleDock.dock.dockControls[4].value;
        if (this.selectedRow != null) {
          localStorage.setItem('phaseId', phaseIdForCopy);
          localStorage.setItem('projectId', projectIdForCopy);
          localStorage.setItem('itemCopy', '1');
          localStorage.setItem('paymentAllocationEdit', JSON.stringify(this.selectedRow));
          this._router.navigate(['/home/incentive/createExaminerSiteRate']);
        }
        break;
      default:
        break;
    }
  }
  handleTableEvent(event) {
    console.log(event);
    const eventType = event.eventInfo.toLowerCase();
    switch (eventType) {
      case 'rowselected':
        if (event.value[0].id != undefined) {
          localStorage.setItem('examinerSiteRateEdit', JSON.stringify(event.value[0]));
          this.selectedRow = event.value[0];
        } else {
          this.selectedRow = null;
        }
        break;
    }
  }

}
