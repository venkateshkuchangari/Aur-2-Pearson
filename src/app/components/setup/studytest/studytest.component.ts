import { Component } from '@angular/core';
import { ApiEndpoints } from '../../../services/apiendpoints';
import { MessageComponent } from '../../common/error-message.component';
import { ApiCallComponent } from '../../../services/apicall.component';
import { TranslateService } from '@ngx-translate/core';
import { UserInfoComponent } from '../../../shared/userinfo.component';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorComponent } from '../../../services/error.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Dock, DockControl, KeyValuePair } from '../../common/dock.controls';
import { TestModel } from '../test/test.model';
import { ParentTestTypeModel } from '../test/parenttesttype.model';
import { TestTypeModel } from '../test/testtype.model';
import { RaterTypeModel } from '../test/ratertype.model';
import { TestFlatFormModel } from '../test/testplatform.model';
import * as buttonconstants from '../../common/app.buttonconstants';
import { PhaseTestData, PhaseTestModel } from '../phase/phasetest.model';
import { PhaseListModel, PhaseItemsModel } from '../phase/phase.model';
import { Observable } from 'rxjs/Observable';
import { StudyModel } from '../study/study.model';
import { StudyTestModel } from './studytest.model';

declare var $: any;
@Component({
    selector: 'studytest',
    templateUrl: 'studytest.component.html',
    styleUrls: ['studytest.component.scss']
})
export class StudytestComponent {
    options: FormGroup;
    id: any;
    dock: Dock;
    dockControl: DockControl;
    dloList: KeyValuePair[];
    details: any;
    isComponentloaded: boolean;
    listFormGroup: FormGroup;
    testModel: TestModel;
    pageSubmit: boolean;
    parent_data_col_var_opt_id: KeyValuePair[];
    parentTestTypeModel: ParentTestTypeModel[];
    testTypeModel: TestTypeModel[];
    raterTypeModel: RaterTypeModel[];
    testFlatFormModel: TestFlatFormModel[];
    isRowSelected: boolean;
    selectedData: any[];
    countryId: any;
    headerSelected: boolean;
    phaseId: number;
    phaseTestData: PhaseTestData[];
    phaseListModel: PhaseListModel[];
    selectedPhase: PhaseListModel;
    phaseItemsModel: PhaseItemsModel[];
    phaseTestModel: PhaseTestModel;
    projectId: string;
    createNew: boolean;
    studyId: number;
    studyData: StudyModel;
    studyTestModel: StudyTestModel;
    constructor(private apicall: ApiCallComponent, private router: Router
        , private translate: TranslateService
        , private userInfo: UserInfoComponent, public snackBar: MatSnackBar
        // , private loader: LoadingServiceComponent
        , private route: ActivatedRoute
        , private errorComponent: ErrorComponent) {

        this.id = null;
        this.dockControl = new DockControl();
        this.dock = new Dock();
        this.dloList = [];
        this.isComponentloaded = false;
        this.testModel = new TestModel();
        this.pageSubmit = false;
        this.parent_data_col_var_opt_id = [];
        this.parentTestTypeModel = [];
        this.testTypeModel = [];
        this.raterTypeModel = [];
        this.testFlatFormModel = [];
        this.isRowSelected = false;
        this.headerSelected = false;
        this.phaseTestData = [];
        this.phaseListModel = [];
        this.selectedPhase = new PhaseListModel();
        this.phaseItemsModel = [];
        this.phaseTestModel = new PhaseTestModel();
        this.createNew = false;
        this.studyData = new StudyModel();
        this.studyTestModel = new StudyTestModel();

        this.route.params.subscribe(
            params => {
                this.studyId = params != null ? params.id : '';
            });
    }

    ngOnInit() {
        this.createFormGroup();
        this.setDockControls();
        this.getTemplateData();
        this.getStudyById();
    }

    createFormGroup() {
        this.studyTestModel.studyId = this.studyId;
        this.countryId = this.userInfo.getCountryId();
        this.listFormGroup = new FormGroup({
            studyId: new FormControl(this.studyTestModel.studyId),
            phaseTestId: new FormControl(this.studyTestModel.phaseTestId),
            required: new FormControl(this.studyTestModel.required),
            testOrder: new FormControl(this.studyTestModel.testOrder)
        });
    }

    getStudyById() {
        this.apicall.get(ApiEndpoints.getdetails, '91/' + this.studyId).subscribe(
            res => {
                // // this.loader.loading = false;
                if (res.json().ack == 'success') {
                    this.studyData = res.json().Data[0];
                    this.phaseId = this.studyData.phaseId;
                } else {
                    this.errorComponent.handleCustomError(MessageComponent.error_get);
                }
            },
            err => {
                // // this.loader.loading = false;
                this.errorComponent.handleError(err);
            });
    }


    getTemplateData() {
        //  this.loader.loading = true;
        this.apicall.get(ApiEndpoints.getdetails, '94/' + this.studyId).subscribe(
            res => {
                if (res.json().ack == 'success') {
                    this.details = res.json();
                    const time1 = new Date();
                } else {

                    // this.loader.loading = false;
                    this.errorComponent.handleCustomError(MessageComponent.error_get);
                    // this.errorComponent.handleError(err);
                }
            },
            err => {
                // this.loader.loading = false;
                this.errorComponent.handleError(err);
            });
    }

    getItems() {
        this.phaseTestData = [];
        this.getPageDDLs('115/' + this.phaseId).subscribe((res: any) => {
              this.phaseTestData = res;

            setTimeout(function () {
                $('select[id=\'selectpicker\']').selectpicker('refresh');
            }, 500);

        });
    }

    getParentTestType() {

        this.getPageDDLs('65/242').subscribe((res: any) => {
            for (let cnt = 0; cnt < res.length; cnt++) {
                const testType: ParentTestTypeModel = new ParentTestTypeModel();
                testType.id = res[cnt].id;
                testType.acronym = res[cnt].Acronym;
                testType.testName = res[cnt]['Test Name'];
                this.parentTestTypeModel.push(testType);
            }
            setTimeout(function () {
                $('select[id=\'selectpicker\']').selectpicker('refresh');
            }
                , 500);
        });
    }

    savePhaseTest() {
        // this.phaseTestModel = new PhaseTestModel();
        this.studyTestModel = this.listFormGroup.value;
        this.studyTestModel.studyId = this.studyId;
         //this.phaseTestModel.billingProjectId = this.selectedPhase.project_id;


             this.apicall.post(ApiEndpoints.saveStudyTest, this.studyTestModel).subscribe(
                 res => {
                     // // this.loader.loading = false;
                     if (res.status == '201') {
                        this.snackBar.open(MessageComponent.msg_savesuccess, 'Success', {
                            duration: 2000,
                        });
                        this.navigateOrCreateNew();
                     } else {
                         this.errorComponent.handleCustomError(MessageComponent.msg_savefail);
                     }
                 },
                 err => {
                     // // this.loader.loading = false;
                     this.errorComponent.handleError(err);
                 });

     }

     updatePhaseTest() {
        this.apicall.put(ApiEndpoints.updatePhaseTest, this.phaseTestModel).subscribe(
            res => {
                // // this.loader.loading = false;
                if (res.status == '200') {
                    this.snackBar.open(MessageComponent.msg_updatesuccess, 'Success', {
                        duration: 2000,
                    });
                     this.navigateOrCreateNew();
                } else {
                    this.errorComponent.handleCustomError(MessageComponent.msg_savefail);
                }
            },
            err => {
                // // this.loader.loading = false;
                this.errorComponent.handleError(err);
            });
     }

     navigateOrCreateNew() {
         if (this.createNew) {
           // this.setDockControlsForSave();
            //this.createNew = false;
            this.listFormGroup.reset();
            this.getItems();
            this.testModel = new TestModel();
            this.listFormGroup.reset();
            this.getPhaseByID(this.phaseId);
         } else {
            // this.router.navigate(['./home/setup/study']);
            this.id = null;
                this.isComponentloaded  = false;
                this.toggleClick(1);
                this.getTemplateData();
                this.setDockControls();
                this.isRowSelected = false;
                this.selectedData = [];
         }
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
                    this.deleteRecordById(this.selectedData[cnt]['StudyTestId']).subscribe(res => {

                        if (res) {
                            deletedCount += 1;
                        }

                        if (deletedCount == this.selectedData.length) {
                            this.isComponentloaded = false;
                            this.selectedData = [];
                            this.id = null;
                            this.getTemplateData();
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
        return this.apicall.delete(ApiEndpoints.deleteStudyTest + selectedData, null).map(
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
        this.addButtonToList( this.id > 0 ? buttonconstants.Edit :  buttonconstants.Add, true);
        this.addButtonToList(buttonconstants.Delete, false);
        this.addButtonToList(buttonconstants.Refresh, true);
    }

    addButtonToList(buttonType: any, enable: boolean) {
        this.dockControl = new DockControl();
        this.dockControl.type = 'button';
        this.dockControl.label = buttonType;
        this.dockControl.enable = enable;
        this.dock.dockControls.push(this.dockControl);
    }

    addCheckBoxToList(buttonType: any, enable: boolean) {
        this.dockControl = new DockControl();
        this.dockControl.type = 'checkbox';
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
            case 'add':
                this.loadEmptyTemplate();
                break;
                case 'edit':
                this.loadEmptyTemplate();
                break;
            case 'delete':
                this.deleteTemplate();
                break;
            case 'save':
                this.savePhaseTest();
                break;
            case 'refresh':
                this.id = '';
                this.getTemplateData();
                this.setDockControls();
                break;
            case 'cancel':
                this.id = null;
                this.isComponentloaded  = false;
                this.toggleClick(1);
                this.getTemplateData();
                this.setDockControls();
                this.isRowSelected = false;
                this.selectedData = [];
                
                // this.router.navigate(['./home/setup/studytest']);
                break;
            case 'create another':
                this.createNew = !this.createNew;
                break;
            default:
                alert('not implimented');
                break;
        }
    }

    handleTableEvent(event: any) {
        this.id = 0;
        this.selectedData = event.value;
        if (this.selectedData.length > 0) {
            this.id = this.selectedData[0]['StudyTestId'];
            this.isComponentloaded = true;
        }
        console.log('id=' + this.id);
        const eventType = event.eventInfo.toLowerCase();
        switch (eventType) {
            case 'headerselected':
            case 'rowselected':
                if (this.id > 0) {
                    this.isComponentloaded = true;
                }

                this.setDockControls();
                break;
            default:
                alert('not implimented');
                break;
        }
    }

    getPhaseByID(studyId) {
        this.apicall.get(ApiEndpoints.getdetails, '91/' + studyId).subscribe(
            res => {
                if (res.json().ack == 'success') {
                    this.phaseListModel = res.json().Data;
                    if (this.phaseListModel.length > 0) {
                        this.selectedPhase = this.phaseListModel[0];
                    }

                    // this.listFormGroup.get("billingProjectId").setValue(this.selectedPhase.project_id);
                    // this.listFormGroup.get("billingProjectTask").setValue(this.selectedPhase.project_task);
                    // this.listFormGroup.get("billingExpenditureType").setValue(this.selectedPhase.expenditure_type);
                    // this.listFormGroup.get("billingExpenditureOrg").setValue(this.selectedPhase.expenditure_org);
                } else {
                    // // this.loader.loading = false;
                }

                $('select[id=\'selectpicker\']').selectpicker('refresh');
            },
            err => {
                // // this.loader.loading = false;
                this.errorComponent.handleError(err);
            });
    }

    loadEmptyTemplate() {
        // if (this.id != null && this.id != "" && this.id > 0) {
        //       this.getSavedData(this.id);
        // }
        // else {
            this.testModel = new TestModel();
            this.listFormGroup.reset();
            this.getPhaseByID(this.studyId);
        // }

        this.getItems();
        this.getParentTestType();
        this.toggleClick(1);
        this.isComponentloaded = true;
        this.setDockControlsForSave();
    }

    getSavedData(id: any) {
        this.apicall.get(ApiEndpoints.getdetails + '107/', id).subscribe(
            res => {
                if (res.json().ack == 'success') {
                    this.phaseTestModel = res.json().Data[0];
                    this.listFormGroup.setValue({
                        testId: this.phaseTestModel.testId,
                        reviewRequired: this.phaseTestModel.reviewRequired,
                        billingProjectTask: this.phaseTestModel.billingProjectTask,
                        billingExpenditureType: this.phaseTestModel.billingExpenditureType,
                        billingExpenditureOrg: this.phaseTestModel.billingExpenditureOrg,
                        scoringState: this.phaseTestModel.scoringState,
                        testOrder: this.phaseTestModel.testOrder,
                        phaseId: this.phaseId,
                        phaseTestId: this.phaseTestModel.phaseTestId,
                        billingProjectId: this.phaseTestModel.billingProjectId
                    });

                    $('select[id=\'selectpicker\']').selectpicker('refresh');
                } else {
                    // this.loader.loading = false;
                    this.errorComponent.handleCustomError(MessageComponent.error_get);
                }

            },
            err => {
                // this.loader.loading = false;
                this.errorComponent.handleError(err);
            });
    }


    setDockControlsForSave() {
        this.dock.dockControls = [];
        this.dock.backgroundcolor = '#343a40';
        this.addButtonToList(buttonconstants.Save, true);
        this.addButtonToList(buttonconstants.Cancel, true);
        this.addCheckBoxToList(buttonconstants.CreateAnother, true);
    }

    toggleClick(flag: number) {
        $('#divTest').toggle(500);
        $('#divTable').toggle(500);

        if (flag == 1) {
            this.id = null;
        }
    }
}
