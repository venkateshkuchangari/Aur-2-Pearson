//import { Component, OnInit } from '@angular/core';
import { Dock, DockControl, KeyValuePair } from './../../common/dock.controls';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as buttonconstants from '../../common/app.buttonconstants';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import { SimpleDockComponent } from '../../common/simple-dock/simple-dock.component';
import { Router } from '@angular/router';
import { UserInfoComponent } from '../../../shared/userinfo.component';
//import { SetupService } from '../setup.service';
import { PortalService } from '../../portal/portal.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogComponent } from '../../dialog/dialog/dialog.component';
import { PhaseListModel } from '../../setup/phase/phase.model';
import { ProjectListModel } from '../../setup/project/project.model';
import { DatePipe } from '@angular/common';
import { ApiCallComponent } from '../../../services/apicall.component';
import { TranslateService } from '@ngx-translate/core';
import { ErrorComponent } from '../../../services/error.component';
import { ApiEndpoints } from '../../../services/apiendpoints';
import { MessageComponent } from '../../common/error-message.component';
import { PhaseTestData } from '../../setup/phase/phasetest.model';
import { ReqModel } from './req.model';

@Component({
  selector: 'req',
  templateUrl: 'req.component.html',
  styleUrls: ['req.component.scss']
})

export class ReqComponent implements OnInit {
  public dock: Dock;
  public dockControl: DockControl;
  public formGroup: FormGroup;
  public editorOptions: Object;
  public loading: boolean;
  public fetchData: any;
  phaseListModel: PhaseListModel[];
  andphaseListModel: PhaseListModel[];
  projectList: ProjectListModel[];
  andprojectList: ProjectListModel[];
  countryId: number;
  listFormGroup: FormGroup;
  phaseTestData: PhaseTestData[];
  andphaseTestData: PhaseTestData[];
  reqModel: ReqModel;
  showTest2: boolean;
  isComponentloaded = true;
  id = 0;
  headerSelected = false;
  public ckEditorConfig: any;
  @ViewChild(SimpleDockComponent) simpleDock: SimpleDockComponent;
  constructor(private datePipe: DatePipe, private apicall: ApiCallComponent
    , private router: Router
    , private translate: TranslateService
    , private userInfo: UserInfoComponent, public snackBar: MatSnackBar
    // , private loader: LoadingServiceComponent
    , private errorComponent: ErrorComponent
  ) {
    this.reqModel = new ReqModel();
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

    this.projectList = [];
    this.phaseListModel = [];
    this.phaseTestData = [];

    this.andprojectList = [];
    this.andphaseListModel = [];
    this.andphaseTestData = [];
    this.showTest2 = true;
    this.ckEditorConfig = buttonconstants.CKEditorSettings;
  }



  setDockControls() {
    this.dock.dockControls = [];
    //this.dock.backgroundcolor = "#343a40"
    this.addButtonToList(buttonconstants.SaveOrAdd, true);
    this.addButtonToList(buttonconstants.Cancel, true);
    //this.addButtonToList(buttonconstants.Delete, true);
    //this.addSelectToList(true);
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
    this.dockControl.key = 'Message Type';
    this.dock.dockControls.push(this.dockControl);
  }

  ngOnInit() {
    this.countryId = this.userInfo.getCountryId();

    this.listFormGroup = new FormGroup({
      forProjectId: new FormControl('', [Validators.required]),
      forPhaseId: new FormControl('', [Validators.required]),
      forPhaseTestId: new FormControl('', [Validators.required]),
      htmlRequirements: new FormControl('', [Validators.required]),
      andProjectId: new FormControl('', [Validators.required]),
      andPhaseId: new FormControl('', [Validators.required]),
      andPhaseTestId: new FormControl('', [Validators.required]),
      phaseTestRequirementId: new FormControl('0', [Validators.required]),
    });
    this.getDloList();
  }

  getDloList() {
    Observable.forkJoin(
      this.getPageDDLs('60/' + this.countryId).map((res: any) => {
        this.projectList = res;
      }),

    ).subscribe(
      data => {
      },
      err => {
      });
  }

  getPhases() {
    Observable.forkJoin(
      this.getPageDDLs('57/' + this.listFormGroup.get('forProjectId').value).map((res: any) => {
        this.phaseListModel = res;
      }),
    ).subscribe(
      data => {
      },
      err => {
        this.errorComponent.handleCustomError(MessageComponent.error_get);
      });
  }

  getAndPhases() {
    this.andphaseListModel = [];
    Observable.forkJoin(
      this.getPageDDLs('57/' + this.listFormGroup.get('andProjectId').value).map((res: any) => {
       // debugger;
        this.andphaseListModel = res;
      }),
    ).subscribe(
      data => {
      },
      err => {
        this.errorComponent.handleCustomError(MessageComponent.error_get);
      });
  }


  getPhasesTests() {
    this.phaseTestData = [];
    Observable.forkJoin(
      this.getPageDDLs('120/' + this.listFormGroup.get('forPhaseId').value).map((res: any) => {
        this.phaseTestData = res;
      }),

    ).subscribe(
      data => {
      },
      err => {
        this.errorComponent.handleCustomError(MessageComponent.error_get);
      });
  }

  getandPhasesTests() {
    this.andphaseTestData = [];
    Observable.forkJoin(
      this.getPageDDLs('120/' + this.listFormGroup.get('andPhaseId').value).map((res: any) => {
        this.andphaseTestData = res;
      }),

    ).subscribe(
      data => {
      },
      err => {
        this.errorComponent.handleCustomError(MessageComponent.error_get);
      });
  }


  getPageDDLs(param: any): Observable<any> {
    return this.apicall.get(ApiEndpoints.getdetails, param).map(
      res => {
        if (res.json().ack == 'success' && res.json().Data != 'None') {
          return res.json().Data;
        } else {
          this.snackBar.open(res.json().error_description, 'Error', {
            duration: 2000,
          });
          return [];
        }
      },
      err => {
        this.snackBar.open(err, 'Error', {
          duration: 2000,
        });
      });
  }


  handleDocEvent(event: any) {
    const eventType = event.eventInfo.toLowerCase();
    switch (eventType) {

      case 'save/add':
        this.saveTemplateData();
        break;
      case 'cancel':
        this.resetFromGroup();
        break;
      default:
        alert('not implimented');
        break;
    }
  }

  resetFromGroup() {
    this.listFormGroup.setValue({
      forProjectId: '',
      forPhaseId: '',
      forPhaseTestId: '',
      htmlRequirements: '',
      andProjectId: '',
      andPhaseId: '',
      andPhaseTestId: '',
      phaseTestRequirementId: 0
    });
  }

  removeTest2() {
    this.listFormGroup.patchValue({
      htmlRequirements: '',
      andProjectId: '',
      andPhaseId: '',
      andPhaseTestId: '',
      phaseTestRequirementId: 0
    });

    this.showTest2 = false;
    this.reqModel = this.listFormGroup.value;
    const forPhaseTestId = this.reqModel.forPhaseTestId;
    if (forPhaseTestId > 0) {
      this.getSaveData();
    }
  }


  getSaveData() {
    this.reqModel = this.listFormGroup.value;
    const forPhaseTestId = this.reqModel.forPhaseTestId;
    const andPhaseTestId = this.reqModel.andPhaseTestId == '' ? 0 : this.reqModel.andPhaseTestId;
    this.apicall.get(ApiEndpoints.getdetails, '121/' + forPhaseTestId + ',' + andPhaseTestId).subscribe(
      res => {
          if (res.json().ack == 'success') {
            this.reqModel =  res.json().Data[0];
            this.listFormGroup.get('htmlRequirements').setValue(this.reqModel.htmlRequirements);
            this.listFormGroup.get('phaseTestRequirementId').setValue(this.reqModel.phaseTestRequirementId);

          } else {
              // // this.loader.loading = false;
          }

          // $("select[id='selectpicker']").selectpicker('refresh');
      },
      err => {
          // // this.loader.loading = false;
          this.errorComponent.handleError(err);
      });
  }

  updateData() {
    this.reqModel = this.listFormGroup.value;
    const forPhaseTestId = this.reqModel.forPhaseTestId;
    const andPhaseTestId = this.reqModel.andPhaseTestId == '' ? 0 : this.reqModel.andPhaseTestId;
    this.apicall.put(ApiEndpoints.updatephasetestreq, this.reqModel).subscribe(
      res => {
        this.showTest2 = true;
        // // this.loader.loading = false;
        if (res.status == '201') {
          this.snackBar.open(MessageComponent.msg_updatesuccess, 'Success', {
            duration: 2000,
          });
        } else {
          this.errorComponent.handleCustomError(MessageComponent.msg_savefail);
        }
      },
      err => {
        // // this.loader.loading = false;
        this.errorComponent.handleError(err);
      });
  }


  saveTemplateData() {
    this.reqModel = this.listFormGroup.value;

      if (this.reqModel.phaseTestRequirementId > 0) {
        this.updateData();
     } else  {
    this.apicall.post(ApiEndpoints.savephasetestreq, this.reqModel).subscribe(
      res => {
        this.showTest2 = true;
        // // this.loader.loading = false;
        if (res.status == '201') {
          this.snackBar.open(MessageComponent.msg_savesuccess, 'Success', {
            duration: 2000,
          });
          // this.resetFromGroup();
          this.getSaveData();
        } else {
          this.errorComponent.handleCustomError(MessageComponent.msg_savefail);
        }
      },
      err => {
       // debugger;
        // // this.loader.loading = false;
        this.errorComponent.handleError(err);
      });
      }

  }
}
