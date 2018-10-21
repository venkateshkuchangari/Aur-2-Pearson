import { Component } from '@angular/core';
import { Dock, DockControl, KeyValuePair } from '../../common/dock.controls';
//import { LookupModel } from '../test/testtype.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ApiCallComponent } from '../../../services/apicall.component';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserInfoComponent } from '../../../shared/userinfo.component';
import { MatSnackBar } from '@angular/material';
import { ErrorComponent } from '../../../services/error.component';
import { Observable } from 'rxjs/Observable';
import { ApiEndpoints } from '../../../services/apiendpoints';
import * as buttonconstants from '../../../shared/app.buttonconstants';
import { BasepayModel } from './basepay.model';
import { ProjectListModel } from '../../setup/project/project.model';
import { StatusModel } from '../../setup/project/status.model';
import { PhaseTypeModel, PhaseListModel, PhaseModel, PhaseItemsModel } from '../../setup/phase/phase.model';
import { ProjectTypeModel } from '../../setup/project/projecttype';
import { MessageComponent } from '../../common/error-message.component';
import { LookupModel } from '../../setup/test/testtype.model';
import { Observer } from 'rxjs';
declare var $: any;

@Component({
  selector: 'basepaypage',
  templateUrl: 'basepaypage.component.html',
  styleUrls: ['basepaypage.component.scss']
})
export class BasepaypageComponent {
  basepaymodel: BasepayModel;
  listFormGroup: FormGroup;
  details: any;
  notesdetails: any;
  id: any;
  dock: Dock;
  dockControl: DockControl;
  dloList: KeyValuePair[];
  phasedloList: KeyValuePair[];
  isComponentloaded: boolean;
  projectList: ProjectListModel[];
  pageSubmit: boolean;
  parent_data_col_var_opt_id: KeyValuePair[];
  selectedData: any[];
  dataCollectionVariableId: number;
  statusModel: StatusModel[];
  countryName: string;
  phaseType: PhaseTypeModel[];
  phaseListModel: PhaseListModel[];
  phaseModel: PhaseModel;
  countryId: number;
  selectedProjectId: number;
  selectedPhaseId: number;
  phaseItemsModel: PhaseItemsModel[];
  selectedStudyId: number;
  types: LookupModel[];
  payeeType: LookupModel[];
  payRateTemplateId: number;
  // services: LookupModel[];
  // diagnosis: LookupModel[];
  headerSelected: boolean;
  constructor(private datePipe: DatePipe, private apicall: ApiCallComponent, private router: Router
    , private translate: TranslateService
    , private userInfo: UserInfoComponent, public snackBar: MatSnackBar
    , private errorComponent: ErrorComponent
    , private decPipe: DecimalPipe
  ) {
    this.basepaymodel = new BasepayModel();
    this.id = null;
    this.dockControl = new DockControl();
    this.dock = new Dock();
    this.dloList = [];
    this.isComponentloaded = false;
    this.phaseModel = new PhaseModel();
    this.projectList = [];
    this.pageSubmit = false;
    this.parent_data_col_var_opt_id = [];
    this.selectedData = [];
    this.dataCollectionVariableId = 0;
    //  this.countries = [];
    this.phasedloList = [];
    this.phaseType = [];
    this.phaseListModel = [];
    this.selectedProjectId = 0;
    this.selectedPhaseId = 0;
    this.selectedStudyId = 0;
    this.phaseItemsModel = [];
    this.payeeType = [];
    this.statusModel = [];
    //  this.studydloList = [];
    //  this.services = [];
    //  this.diagnosis = [];
  }

  ngOnInit() {
    this.countryId = this.userInfo.getCountryId();

    //   this.listFormGroup = new FormGroup({
    //     Name: new FormControl(this.basepaymodel.Name),
    //     SelectTest: new FormControl(this.basepaymodel.SelectTest),
    //     Incentivetype: new FormControl(this.basepaymodel.Incentivetype),
    //     Payeetype: new FormControl(this.basepaymodel.Payeetype),
    //     Active: new FormControl(this.basepaymodel.Active),
    //     Selectstatus: new FormControl(this.basepaymodel.Selectstatus),
    //     EffectiveDate: new FormControl(this.basepaymodel.EffectiveDate),
    //     Amount: new FormControl(this.basepaymodel.Amount),
    //     Notes: new FormControl(this.basepaymodel.Notes)
    // });

    this.listFormGroup = new FormGroup({
      payRateBaseId: new FormControl(this.basepaymodel.payRateBaseId),
      payRateTemplateId: new FormControl(this.basepaymodel.payRateTemplateId),
      phaseId: new FormControl(this.basepaymodel.phaseId),
      name: new FormControl(this.basepaymodel.name, [Validators.required]),
      testId: new FormControl(this.basepaymodel.testId, [Validators.required]),
      statusId: new FormControl(this.basepaymodel.statusId, [Validators.required]),
      active: new FormControl(this.basepaymodel.active),
      incentiveTypeId: new FormControl(this.basepaymodel.incentiveTypeId, [Validators.required]),
      payeeTypeId: new FormControl(this.basepaymodel.payeeTypeId, [Validators.required]),
      effectiveDate: new FormControl(this.basepaymodel.effectiveDate, [Validators.required]),
      amount: new FormControl(this.basepaymodel.amount, [Validators.required]),
      paper: new FormControl(this.basepaymodel.paper),
      adjAmount: new FormControl(this.basepaymodel.adjAmount),
      notes: new FormControl(this.basepaymodel.notes),
      userName: new FormControl(this.basepaymodel.userName)
      // projectId: new FormControl(this.phaseModel.projectId, [Validators.required]),
    });

    this.payRateTemplateId = this.basepaymodel.payRateTemplateId;

    this.translate.use('en');
    this.getDloList();

    //this.getTemplateData();
    // this.getServices();
    // this.getDiagnosis();

    this.getTypes();
    this.getStatus();
    this.getTests();
    this.getPayeeType();
  }

  getTemplateData() {
    this.details = false;
    if (this.selectedPhaseId > 0) {
      //  this.loader.loading = true;

      this.apicall.get(ApiEndpoints.getdetails, '81/' + this.selectedPhaseId).subscribe(
        res => {
          // this.loader.loading = false;

          if (res.json().ack == 'success') {
            this.details = res.json();
            const time1 = new Date();
          } else {

            // this.loader.loading = false;

            // this.errorComponent.handleError(err);
          }

        },
        err => {
          // this.loader.loading = false;
          // this.errorComponent.handleError(err);
        });
    }


  }

  saveTemplateData() {
  debugger;
    if (!this.isComponentloaded) {
      return false;
    }
    this.pageSubmit = true;
    if (this.listFormGroup.valid) {
      const saveURL = ApiEndpoints.saveBasePay;
      this.basepaymodel = this.listFormGroup.value;
      this.basepaymodel.phaseId = this.selectedPhaseId;
      this.basepaymodel.payRateTemplateId = this.payRateTemplateId;
      this.basepaymodel.userName = this.userInfo.getUserName();
      this.basepaymodel.effectiveDate = this.datePipe.transform(this.basepaymodel.effectiveDate, 'MM/dd/yyyy');
      this.basepaymodel.amount = Number(this.basepaymodel.amount).toFixed(2);
      debugger;
      if (this.basepaymodel.payRateBaseId != null && this.basepaymodel.payRateBaseId > 0) {
        this.updateTemplate();
      } else {
        debugger;
        this.basepaymodel.payRateBaseId = 0;
        this.saveData();
      }
    }
  }

  saveData() {
    // // this.loader.loading = true;
    this.apicall.post(ApiEndpoints.saveBasePay, this.basepaymodel).subscribe(
      res => {
        // // this.loader.loading = false;
      debugger;
        if (res.status == '201') {
          this.snackBar.open(MessageComponent.msg_savesuccess, 'Success', {
            duration: 2000,
          });
          this.getTemplateData();
          this.cancelEvent();
          this.setDockControls();
        } else {
          debugger;
          this.errorComponent.handleCustomError(MessageComponent.msg_savefail);
          // this.errorComponent.handleError(err);
        }
      },

      err => {
        // this.loader.loading = false;
        this.errorComponent.handleError(err);
      });
  }

  updateTemplate() {
    // // this.loader.loading = true;
    this.apicall.put(ApiEndpoints.updateBasePay, this.basepaymodel).subscribe(
      res => {
        // // this.loader.loading = false;
        if (res.status == '201') {
          this.snackBar.open(MessageComponent.msg_updatesuccess, 'Success', {
            duration: 2000,
          });

          this.getTemplateData();
          this.cancelEvent();
          this.setDockControls();
        } else {
          this.errorComponent.handleCustomError(MessageComponent.msg_savefail);
        }
      },
      err => {
        // // this.loader.loading = false;
        this.errorComponent.handleError(err);
      });
  }

  copyTemplate() {
    if (this.isComponentloaded == true) {
      this.basepaymodel.payRateBaseId = 0;
      this.basepaymodel.active = 'true';
      this.basepaymodel.amount = Number(this.basepaymodel.amount).toFixed(2);
      this.basepaymodel.effectiveDate = this.datePipe.transform(this.basepaymodel.effectiveDate, 'MM/dd/yyyy');
      this.basepaymodel.userName = this.userInfo.getUserName();

      this.basepaymodel.notes = '';
      this.basepaymodel.name = 'Copy_' + this.basepaymodel.name;
      this.saveData();
    } else {
      this.getSavedData(this.id).subscribe((data) => {
        this.basepaymodel = data;
        this.basepaymodel.effectiveDate = this.basepaymodel.effectiveDate != '' ? this.datePipe.transform(this.basepaymodel.effectiveDate, 'yyyy-MM-dd') : this.basepaymodel.effectiveDate;

        this.basepaymodel.payRateBaseId = 0;
        this.basepaymodel.active = 'true';
        this.basepaymodel.amount = Number(this.basepaymodel.amount).toFixed(2);
        this.basepaymodel.effectiveDate = this.datePipe.transform(this.basepaymodel.effectiveDate, 'MM/dd/yyyy');
        this.basepaymodel.userName = this.userInfo.getUserName();

        this.basepaymodel.notes = '';
        this.basepaymodel.name = 'Copy_' + this.basepaymodel.name;
        this.saveData();
      });
    }
  }


  handleTableEvent(event: any) {
    this.id = 0;
    this.selectedData = event.value;
    if (this.selectedData.length > 0) {
      this.id = this.selectedData[0]['id'];
      this.isComponentloaded = false;
    }
    console.log('id=' + this.id);
    const eventType = event.eventInfo.toLowerCase();
    switch (eventType) {
      case 'headerselected':
      case 'rowselected':
        if (this.id > 0) {
          this.isComponentloaded = false;
        }
        break;
      default:
        alert('not implimented');
        break;
    }
  }
  getDloList() {
    Observable.forkJoin(
      this.getPageDDLs('60/' + this.countryId).map((res: any) => {
        this.projectList = res;
        this.dloList = [];
        for (const data of this.projectList) {
          const info = new KeyValuePair();
          info.ID = data.project_id;
          info.Description = data.project_name;
          this.dloList.push(info);
        }
      }),

    ).subscribe(
      data => {
        this.setDockControls();
      },
      err => {
      });

  }

  getTests() {
    this.getPageDDLs('65/' + this.countryId).subscribe((res: any) => {
      this.phaseItemsModel = [];
      for (let cnt = 0; cnt < res.length; cnt++) {
        const phaseItem: PhaseItemsModel = new PhaseItemsModel();
        phaseItem.id = res[cnt].id;
        phaseItem.acronym = res[cnt].acronym;
        phaseItem.testName = res[cnt]['Test Name'];
        this.phaseItemsModel.push(phaseItem);
      }
    });
  }


  getTypes() {
    this.getPageDDLs('79/242').subscribe((res: any) => {
      this.types = res;
      setTimeout(() => {
        $('select[id=\'selectpicker\']').selectpicker('refresh');
      }, 500);
    });
  }

  getStatus() {
    this.getPageDDLs('63/1').subscribe((res: any) => {
      this.statusModel = res;
      // $("select[id='selectStatuspicker']").selectpicker('refresh');
      setTimeout(() => {
        $('select[id=\'selectpicker\']').selectpicker('refresh');
      }, 500);
    });
  }

  getPayeeType() {
    this.getPageDDLs('78/0').subscribe((res: any) => {
      this.payeeType = res;
      // $("select[id='selectStatuspicker']").selectpicker('refresh');
      setTimeout(() => {
        $('select[id=\'selectpicker\']').selectpicker('refresh');
      }, 500);
    });
  }

  getPageDDLs(param: any): Observable<any> {
    return this.apicall.get(ApiEndpoints.getdetails, param).map(
      res => {
        if (res.json().ack == 'success') {
          return res.json().Data;
        } else {
          this.snackBar.open(res.json().error_description, 'Error', {
            duration: 2000,
          });
        }
      },
      err => {
        this.snackBar.open(err, 'Error', {
          duration: 2000,
        });
      });
  }

  setDockControls() {

    this.dock.dockControls = [];
    this.dock.backgroundcolor = '#343a40';
    this.addButtonToList(buttonconstants.AddorEdit, true);
    this.addButtonToList(buttonconstants.Delete, false);
    this.addSelectToList(buttonconstants.Select, this.dloList, 'project', this.selectedProjectId);
    this.addSelectToList(buttonconstants.Select, this.phasedloList, 'phase', this.selectedPhaseId);
    this.addButtonToList(buttonconstants.Copy, false);
    this.addButtonToList(buttonconstants.Refresh, true);
  }

  addButtonToList(buttonType: any, enable: boolean) {
    this.dockControl = new DockControl();
    this.dockControl.type = 'button';
    this.dockControl.label = buttonType;
    this.dockControl.enable = enable;
    this.dock.dockControls.push(this.dockControl);
  }

  addSelectToList(buttonType: any, options: any[], key: string, value) {
    this.dockControl = new DockControl();
    this.dockControl.type = 'select';
    this.dockControl.label = buttonType;
    this.dockControl.enable = true;
    this.dockControl.value = value;
    this.dockControl.key = key;
    this.dockControl.controlOptions = options;
    this.dock.dockControls.push(this.dockControl);
  }

  handleDocEvent(event: any) {
    const eventType = event.eventInfo.toLowerCase();
    switch (eventType) {
      case 'add/edit':
        if (this.selectedPhaseId != null && this.selectedPhaseId > 0) {
          this.loadEmptyTemplate();
          //this.getNotesData();
          this.isComponentloaded = true;
        } else {
          this.errorComponent.handleCustomError(MessageComponent.msg_selectphase);
        }
        break;
      case 'add phase':
        this.selectedPhaseId = 0;
        //  this.clearFormGroup();
        this.listFormGroup.get('phaseId').setValue(this.selectedPhaseId);
        this.setDockControls();
        break;
      case 'save':
        this.saveTemplateData();
        break;
       case 'delete':
       this.deleteTemplate();
         break;
      case 'refresh':
        $('#txtSearch').val('');
        this.setDockControls();
        this.getTemplateData();
        // this.ngOnInit();
        break;
      case 'cancel':
        /* this.id = null;
        // this.clearFormGroup();
        this.selectedProjectId = 0;
        this.selectedPhaseId = 0;
        this.getDloList(); */
        this.id = null;
        this.cancelEvent();
        break;
      case 'project':
        this.selectedPhaseId = 0;
        this.selectedProjectId = event.value;
        // this.listFormGroup.get("projectId").setValue(event.value);
        this.getPhases(event.value);
        break;
      case 'phase':
        this.selectedPhaseId = event.value;
        this.listFormGroup.get('phaseId').setValue(event.value);
        // this.getPhaseByID(event.value);
        console.log('event.value=' + event.value);
        this.getTemplateData();
        break;
      case 'copy':
        this.copyTemplate();
        break;
      default:
        alert('not implimented');
        break;
    }
  }

  cancelEvent() {
    this.basepaymodel = new BasepayModel();

    this.listFormGroup.reset();
    $('select[id=\'selectpicker\']').selectpicker('refresh');
    $('#example tr.selected').removeClass('selected');

    $('input:checkbox').prop('checked', false);
    if (this.isComponentloaded) {
      this.toggleClick(1);
    }
    this.setDockControls();
    this.isComponentloaded = false;
    this.id = '';
    this.pageSubmit = false;
    this.getTemplateData();
  }

  loadEmptyTemplate() {
    //this.loadAllDdls();
    this.setDockControlsForSave();

    if (this.id != null && this.id != '' && this.id > 0) {
      // this.getSavedData(this.id)

      this.getSavedData(this.id).subscribe((data) => {
        this.basepaymodel = data;
        this.basepaymodel.effectiveDate = this.basepaymodel.effectiveDate != '' ? this.datePipe.transform(this.basepaymodel.effectiveDate, 'yyyy-MM-dd') : this.basepaymodel.effectiveDate;
        this.listFormGroup.setValue({
          payRateBaseId: this.basepaymodel.payRateBaseId,
          payRateTemplateId: this.basepaymodel.payRateTemplateId,
          phaseId: this.basepaymodel.phaseId,
          name: this.basepaymodel.name,
          testId: this.basepaymodel.testId,
          statusId: this.basepaymodel.statusId,
          active: this.basepaymodel.active,
          incentiveTypeId: this.basepaymodel.incentiveTypeId,
          payeeTypeId: this.basepaymodel.payeeTypeId,
          effectiveDate: this.basepaymodel.effectiveDate,
          amount: this.basepaymodel.amount,
          paper: this.basepaymodel.paper,
          adjAmount: this.basepaymodel.adjAmount,
          notes: '',
          userName: this.userInfo.getUserName(),

        });

        this.getNotesData();
        $('select[id=\'selectpicker\']').selectpicker('refresh');

      });
    } else {
      this.basepaymodel = new BasepayModel();
      this.listFormGroup.reset();

    }
    this.toggleClick(1);
    this.isComponentloaded = true;

  }

  deleteTemplate() {
    const selectedRows = $('input[name=\'chkSelect\']:checked');

    if (this.id.length == 0) {
        this.errorComponent.handleCustomError(MessageComponent.error_selectfordelete);
    } else {
        if (confirm(MessageComponent.msg_confirm)) {
            let deletedCount = 0;
            // // this.loader.loading = true;
            for (let cnt = 0; cnt < this.selectedData.length; cnt++) {
                this.deleteRecordById(this.selectedData[cnt]['id']).subscribe(res => {

                    if (res) {
                        deletedCount += 1;
                    }

                    if (deletedCount == this.selectedData.length) {
                        this.isComponentloaded = false;
                        this.selectedData = [];
                        this.id = null;
                        this.getTemplateData();
                        this.cancelEvent();
                        this.snackBar.open(MessageComponent.msg_deletesuccess, 'Success', {
                            duration: 2000,
                        });
                        // // this.loader.loading = false;
                    }
                });
            }
        }
    }
}

deleteRecordById(selectedData: string): Observable<any> {
    return this.apicall.delete(ApiEndpoints.deleteBasePay + selectedData, null).map(
        res => {
            if (res.status != '200') {
                this.errorComponent.handleError(res.json().error_description);
            }
            return true;
        },
        err => {
            this.errorComponent.handleError(err);
            return false;
        });
}

  getSavedData(id: any): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      this.apicall.get(ApiEndpoints.getBasePay + '86/', id).subscribe(
        res => {
          if (res.json().ack == 'success') {

            observer.next(res.json().Data[0]);
          } else {
            // this.loader.loading = false;
            this.errorComponent.handleCustomError(MessageComponent.error_get);
          }

        },
        err => {
          // this.loader.loading = false;
          this.errorComponent.handleError(err);
        });

    });
  }



  getNotesData() {
    this.notesdetails = false;
      this.apicall.get(ApiEndpoints.getdetails , '89/' + this.basepaymodel.payRateBaseId).subscribe(
        res => {
          if (res.json().ack == 'success') {
            this.notesdetails = res.json();
          } else {
            // this.loader.loading = false;
            this.details = false;
            //this.errorComponent.handleCustomError(MessageComponent.error_get);
          }

        },
        err => {
          this.details = false;
          // this.loader.loading = false;
          //this.errorComponent.handleError(err);
        });


  }



  toggleClick(flag: number) {
    $('#divTest').toggle(500);
    $('#divTable').toggle(500);

    if (flag == 1) {
      this.id = null;
    }
  }
  setDockControlsForSave() {
    this.dock.dockControls = [];
    this.dock.backgroundcolor = '#343a40';
    this.addButtonToList(buttonconstants.Save, true);
    this.addButtonToList(buttonconstants.Cancel, true);
    if (this.id > 0) {
      this.addButtonToList(buttonconstants.Copy, true);
    }
  }

  getPhases(project_id) {
    this.phasedloList = [];
    this.setDockControls();
    this.apicall.get(ApiEndpoints.getdetails, '57/' + project_id).subscribe(
      res => {
        // // this.loader.loading = false;
        if (res.json().ack == 'success') {
          this.phaseListModel = res.json().Data;

          for (const data of this.phaseListModel) {
            const info = new KeyValuePair();
            info.ID = data.phase_id;
            info.Description = data.phase_name;
            this.phasedloList.push(info);
          }
        } else {
          this.errorComponent.handleCustomError(MessageComponent.error_get);
        }
        this.setDockControls();
      },
      err => {
        // // this.loader.loading = false;
        this.errorComponent.handleError(err);
      });
  }

}
