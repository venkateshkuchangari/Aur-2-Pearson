import { Component } from '@angular/core';
import { Dock, DockControl, KeyValuePair } from '../../common/dock.controls';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { PhaseTypeModel, PhaseListModel, PhaseModel, PhaseItemsModel } from './phase.model';
import { DatePipe } from '@angular/common';
import { ApiCallComponent } from '../../../services/apicall.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserInfoComponent } from '../../../shared/userinfo.component';
import { MatSnackBar } from '@angular/material';
import { ErrorComponent } from '../../../services/error.component';
import * as buttonconstants from '../../common/app.buttonconstants';
import { Observable } from 'rxjs/Observable';
import { ApiEndpoints } from '../../../services/apiendpoints';
import { LookupModel } from '../../setup/test/testtype.model';
import { ProjectListModel } from '../project/project.model';
import { StatusModel } from '../project/status.model';
import { MessageComponent } from '../../common/error-message.component';
import { PhaseTestModel, PhaseTestData } from './phasetest.model';

declare var $: any;

@Component({
    selector: 'phase',
    templateUrl: 'phase.component.html',
    styleUrls: ['phase.component.scss']
})
export class PhaseComponent {
    id: any;
    dock: Dock;
    dockControl: DockControl;
    dloList: KeyValuePair[];
    phasedloList: KeyValuePair[];
    types: KeyValuePair[];
    countries: LookupModel[];
    details: any;
    isComponentloaded: boolean;
    listFormGroup: FormGroup;
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
    selectedPhase: PhaseListModel;
    countryId: number;
    selectedProjectId: number;
    selectedPhaseId: number;
    phaseItemsModel: PhaseItemsModel[];
    headerSelected: boolean;
    selectedItems: any[];
    deletedItems: any[];
    phaseTestModel: PhaseTestModel;
    phaseTestData: PhaseTestData[];
    allphaseTestData: PhaseTestData[];
    isRowSelected: boolean;
    isFromProjectPage:boolean;
    constructor(private datePipe: DatePipe, private apicall: ApiCallComponent, private router: Router
        , private translate: TranslateService
        , private userInfo: UserInfoComponent, public snackBar: MatSnackBar
        // , private loader: LoadingServiceComponent
        , private errorComponent: ErrorComponent
        , private route: ActivatedRoute
    ) {
        this.id = null;
        this.dockControl = new DockControl();
        this.dock = new Dock();
        this.dloList = [];
        this.isComponentloaded = true;
        this.phaseModel = new PhaseModel();
        this.projectList = [];
        this.pageSubmit = false;
        this.parent_data_col_var_opt_id = [];
        this.selectedData = [];
        this.dataCollectionVariableId = 0;
        this.countries = [];
        this.phasedloList = [];
        this.phaseType = [];
        this.phaseListModel = [];
        this.selectedProjectId = 0;
        this.selectedPhaseId = 0;
        this.phaseItemsModel = [];
        this.selectedItems = [];
        this.deletedItems = [];
        this.selectedPhase = new PhaseListModel();
        this.phaseTestData = [];
        this.allphaseTestData = [];
        this.isRowSelected = false;
        this.isFromProjectPage = false;
        
    }

    ngOnInit() {
        this.countryId = this.userInfo.getCountryId();

        this.listFormGroup = new FormGroup({
            phaseId: new FormControl(this.phaseModel.phaseId),
            projectId: new FormControl(this.phaseModel.projectId, [Validators.required]),
            phaseName: new FormControl(this.phaseModel.phaseName, [Validators.required]),
            projectTask: new FormControl(this.phaseModel.projectTask, [Validators.required]),
            expenditureType: new FormControl(this.phaseModel.expenditureType, [Validators.required]),
            expenditureOrg: new FormControl(this.phaseModel.expenditureOrg, [Validators.required]),
            phaseTypeId: new FormControl(this.phaseModel.phaseTypeId, [Validators.required]),
            statusId: new FormControl(this.phaseModel.statusId, [Validators.required]),
            dataCollectionStartDate: new FormControl(this.phaseModel.dataCollectionStartDate, [Validators.required]),
            dataCollectionEndDate: new FormControl(this.phaseModel.dataCollectionEndDate, [Validators.required]),
            phaseAcronym: new FormControl(this.phaseModel.phaseAcronym, [Validators.required]),
            censusReference: new FormControl(this.phaseModel.censusReference, [Validators.required]),
            pedCalculationId: new FormControl(this.phaseModel.pedCalculationId, [Validators.required]),
            lastTestingDate: new FormControl(this.phaseModel.lastTestingDate, [Validators.required]),
        });

       

        this.translate.use('en');
        this.getDloList();
        this.getCountry();
        this.getProjectPhase();
        this.getStatus();
        this.getItems();

        this.route.params.subscribe(
            params => {
                this.selectedProjectId = params.id != null ? params.id : 0;
                if(this.selectedProjectId > 0) {
                    this.isFromProjectPage = true;
                    this.onSelectProject();
                }
            });
    }

    getCountry() {
        this.getPageDDLs('67/' + this.countryId).subscribe((res: any) => {
            this.countries = res;
            this.countryName = res[0].data_col_var_opt_desc;
        });
    }

    getItems() {
        this.getPageDDLs('65/' + this.countryId).subscribe((res: any) => {
            this.phaseItemsModel = [];
            for (let cnt = 0; cnt < res.length; cnt++) {
                const phaseItem: PhaseItemsModel = new PhaseItemsModel();
                phaseItem.id = res[cnt].id;
                phaseItem.acronym = res[cnt].acronym;
                phaseItem.testName = res[cnt]['Test Name'];
                phaseItem.isChecked = false;
                // phaseItem.isSaved = this.phaseTestData.filter(a => a.);
                this.phaseItemsModel.push(phaseItem);
            }
        });
    }

    // updateCheckedOptions(option, event) {
    //     this.selectedItems[this.selectedItems.length] = event.target.checked ? option : null;
    //  }

     updateCheckedOptions(index) {
        this.phaseItemsModel[index].isChecked = !this.phaseItemsModel[index].isChecked;
     }

     updateCheckedPhaseOptions(option, event) {
        this.deletedItems[this.deletedItems.length] = event.target.checked ? option : null;
     }

     onOrgTxtChange(item, opt, index) {
         item.billing_expenditure_org = opt;
         this.phaseTestData[index] = item;
     }

     onTaskTxtChange(item, opt, index) {
        item.billing_project_task = opt;
        this.phaseTestData[index] = item;
    }

    onTypeTxtChange(item, opt, index) {
        item.billing_expenditure_type = opt;
        this.phaseTestData[index] = item;
    }

    selectPhaseTest(index) {
        this.phaseTestData[index].isChecked = !this.phaseTestData[index].isChecked;
    }

    cancelPhaseTest(item, index) {
        const data = this.allphaseTestData.filter(a => a.phase_test_id == item.phase_test_id)[0];
        this.phaseTestData[index].billing_project_task = data.billing_expenditure_org;
        this.phaseTestData[index].billing_expenditure_type = data.billing_expenditure_org;
        this.phaseTestData[index].billing_expenditure_org = data.billing_expenditure_org;
    }

    updatePhaseTest(index) {
        this.phaseTestData[index].billing_project_id = this.selectedProjectId;
        const updatePhase: PhaseTestModel = new PhaseTestModel();
        updatePhase.phaseTestId = this.phaseTestData[index].phase_test_id;
        updatePhase.testId = this.phaseTestData[index].test_id;
        updatePhase.phaseId = this.phaseTestData[index].phase_id;
        updatePhase.billingProjectId = this.selectedProjectId;
        updatePhase.billingProjectTask = this.phaseTestData[index].billing_project_task;
        updatePhase.billingExpenditureType = this.phaseTestData[index].billing_expenditure_type;
        updatePhase.billingExpenditureOrg = this.phaseTestData[index].billing_expenditure_org;

        this.apicall.put(ApiEndpoints.updatePhaseTest, updatePhase).subscribe(
            res => {
                // // this.loader.loading = false;
                if (res.status == '200') {
                     this.getPhasesTests(this.selectedPhaseId);
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

     savePhaseTest() {
        // for(let item of this.selectedItems) {
        //     if(item != null) {
        //         this.phaseTestModel = new PhaseTestModel();
        //         this.phaseTestModel.phaseId = this.selectedPhaseId;
        //         this.phaseTestModel.testId = item.id;
        //         this.phaseTestModel.billingProjectId = this.selectedPhase.project_id;
        //         this.phaseTestModel.billingExpenditureType = this.selectedPhase.expenditure_type;
        //         this.phaseTestModel.billingExpenditureOrg = this.selectedPhase.expenditure_org;
        //         this.phaseTestModel.billingProjectTask = this.selectedPhase.project_task;
        //         // this.phaseTestModel.phaseTestId = 0;

        //         this.apicall.post(ApiEndpoints.savePhaseTest, this.phaseTestModel).subscribe(
        //             res => {
        //                 debugger;
        //                 // // this.loader.loading = false;
        //                 if (res.status == "201") {

        //                 }
        //                 else {
        //                     this.errorComponent.handleCustomError(MessageComponent.msg_savefail);
        //                 }
        //             },
        //             err => {
        //                 // // this.loader.loading = false;
        //                 this.errorComponent.handleError(err);
        //             });
        //     }
        // }

        this.phaseTestModel = new PhaseTestModel();

const data = this.phaseItemsModel.filter(a => a.isChecked);
        for (const item of data) {
            if (item.isChecked) {

            // // this.loader.loading = true;
            this.phaseTestModel.phaseId = this.selectedPhaseId;
            this.phaseTestModel.testId = item.id;
            this.phaseTestModel.billingProjectId = this.selectedPhase.project_id;
            this.phaseTestModel.billingExpenditureType = this.selectedPhase.expenditure_type;
            this.phaseTestModel.billingExpenditureOrg = this.selectedPhase.expenditure_org;
            this.phaseTestModel.billingProjectTask = this.selectedPhase.project_task;

            this.apicall.post(ApiEndpoints.savePhaseTest, this.phaseTestModel).subscribe(
                res => {
                    // // this.loader.loading = false;
                    if (res.status === '201') {

                    } else {
                        this.errorComponent.handleCustomError(MessageComponent.msg_savefail);
                    }
                },
                err => {
                    // // this.loader.loading = false;
                    this.errorComponent.handleError(err);
                });
            }
        }
     }

     deletePhaseTest() {
        for (const item of this.deletedItems) {
            if (item != null) {
                this.apicall.post(ApiEndpoints.deletePhaseTest, item).subscribe(
                    res => {
                        // // this.loader.loading = false;
                        if (res.status === '201') {

                        } else {
                            this.errorComponent.handleCustomError(MessageComponent.msg_savefail);
                        }
                    },
                    err => {
                        // // this.loader.loading = false;
                        this.errorComponent.handleError(err);
                    });
            }
        }
     }


    getProjectPhase() {
        this.getPageDDLs('61/' + this.countryId).subscribe((res: any) => {
            this.phaseType = res;
            setTimeout(() => {
                $('select[id=\'selectpicker\']').selectpicker('refresh');
            }, 500);
        });
    }

    getStatus() {
        this.getPageDDLs('64/5').subscribe((res: any) => {

            this.statusModel = res;

            setTimeout(() => {
                $('select[id=\'selectpicker\']').selectpicker('refresh');
            }, 500);
        });
    }

    getPageDDLs(param: any): Observable<any> {
        return this.apicall.get(ApiEndpoints.getdetails, param).map(
            res => {
                if (res.json().ack === 'success') {
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

    getDloList1() {
        this.dloList = [];
        this.apicall.get(ApiEndpoints.getdetails, '60/' + this.countryId).subscribe(
            res => {
                if (res.json().ack === 'success') {
                    this.projectList = res.json().Data;

                    for (const data of this.projectList) {
                        const info = new KeyValuePair();
                        info.ID = data.project_id;
                        info.Description = data.project_name;
                        this.dloList.push(info);
                    }
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
        this.addButtonToList(buttonconstants.Save, true);
        this.addButtonToList(buttonconstants.Cancel, true);
        this.addButtonToList(buttonconstants.Refresh, true);
        this.addSelectToList(buttonconstants.Select, this.dloList, 'project', this.selectedProjectId);
        this.addSelectToList(buttonconstants.Select, this.phasedloList, 'phase', this.selectedPhaseId);
        this.addButtonToList(buttonconstants.AddPhase, this.selectedProjectId > 0 ? true : false);
        this.addButtonToList(buttonconstants.Delete, this.selectedPhaseId > 0 ? true : false);
        if (this.selectedPhaseId > 0) {
        this.addButtonToList(buttonconstants.AddPhaseTest, true);
        }
        this.addButtonToList(buttonconstants.AddStudy, this.selectedPhaseId > 0 ? true : false);
        this.addButtonToList(buttonconstants.VariableCalculations, this.selectedPhaseId > 0 ? true : false);
        this.addButtonToList(buttonconstants.ConsentForm, this.selectedPhaseId > 0 ? true : false);
        this.addButtonToList(buttonconstants.GradeCalculations, true);
        this.addButtonToList(buttonconstants.ViewStudies, true);
        this.addButtonToList(buttonconstants.RollData, true);
        // this.addButtonToList(buttonconstants.GradeCalculations, true);
        // this.addButtonToList(buttonconstants.ViewStudies, true);
        // this.addButtonToList(buttonconstants.RollData, true);
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

    deleteTemplate() {
        if (this.selectedPhaseId <= 0) {
            this.snackBar.open(MessageComponent.error_selectfordelete, 'Success', {
                duration: 2000,
            });
            return false;
        }
        if (confirm('Are you sure you want to delete phase?')) {
            // // this.loader.loading = true;
            this.apicall.put(ApiEndpoints.deletePhase + this.selectedPhaseId, null).subscribe(
                res => {
                    // // this.loader.loading = false;
                    if (res.status === '200') {
                        // this.cancelEvent();
                        // this.setDockControls();
                        this.clearFormGroup();
                        this.selectedPhaseId = 0;
                        this.listFormGroup.get('projectId').setValue(this.selectedProjectId);
                        this.getPhases(this.selectedProjectId);

                        this.snackBar.open(MessageComponent.msg_deletesuccess, 'Success', {
                            duration: 2000,
                        });
                    } else {
                        this.errorComponent.handleCustomError(MessageComponent.msg_deletefail);
                    }
                },
                err => {
                    // // this.loader.loading = false;
                    this.errorComponent.handleError(err);
                });
        }
    }

    saveTemplateData() {
        this.pageSubmit = true;
        if (this.listFormGroup.valid) {
            // // this.loader.loading = true;
            const saveURL = ApiEndpoints.savePhase;
            this.phaseModel = this.listFormGroup.value;
            this.phaseModel.dataCollectionStartDate = this.datePipe.transform(this.phaseModel.dataCollectionStartDate, 'MM/dd/yyyy');
            this.phaseModel.dataCollectionEndDate = this.datePipe.transform(this.phaseModel.dataCollectionEndDate, 'MM/dd/yyyy');
            this.phaseModel.lastTestingDate = this.datePipe.transform(this.phaseModel.lastTestingDate, 'MM/dd/yyyy');
            if (this.phaseModel.phaseId != null && this.phaseModel.phaseId > 0) {
                this.updatePhase();
            } else {
                this.apicall.post(saveURL, this.phaseModel).subscribe(
                    res => {
                        // // this.loader.loading = false;
                        if (res.status === '201') {
                            this.clearFormGroup();
                            this.listFormGroup.get('projectId').setValue(this.selectedProjectId);
                            this.getPhases(this.selectedProjectId);

                            this.snackBar.open(MessageComponent.msg_savesuccess, 'Success', {
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
        } else {
            this.snackBar.open(MessageComponent.msg_selectproject, 'Error', {
                duration: 2000,
            });
        }

    }

    updatePhase() {
        const saveURL = ApiEndpoints.updatePhase;
        this.apicall.put(saveURL, this.phaseModel).subscribe(
            res => {
                // // this.loader.loading = false;
                if (res.status === '200') {
                    this.getPhases(this.selectedProjectId);

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

    handleDocEvent(event: any) {
        const eventType = event.eventInfo.toLowerCase();
        switch (eventType) {
            case 'add phase':
                this.selectedPhaseId = 0;
                this.clearFormGroup();
                this.listFormGroup.get('projectId').setValue(this.selectedProjectId);
                this.setDockControls();
                break;
            case 'save':
                this.saveTemplateData();
                break;
            case 'delete':
                this.deleteTemplate();
                break;
            case 'refresh':
                break;
            case 'cancel':
            
                this.id = null;
                this.clearFormGroup();
                this.selectedProjectId = 0;
                this.selectedPhaseId = 0;
                this.getDloList();
                if(this.isFromProjectPage) {
                    this.router.navigate(['./home/setup/project']);
                }
                break;
            case 'project':
                this.selectedProjectId = event.value;
                this.onSelectProject();
               
                break;
            case 'phase':
                this.selectedPhaseId = event.value;
                this.clearFormGroup();
                this.listFormGroup.get('projectId').setValue(this.selectedProjectId);
                this.listFormGroup.get('phaseId').setValue(event.value);
                this.getPhaseByID(event.value);
                this.setDockControls();
                if (this.selectedPhaseId > 0) {
                    this.getPhasesTests(this.selectedPhaseId);
                }
                break;
            case 'phase test':
                // this.router.navigate[("/setup/phasetest/"+this.selectedPhaseId)];
                // this.router.navigate(['./home/testpage'])
                this.router.navigate(['./home/setup/phasetest/' + this.selectedPhaseId]);
            break;
            case 'consent form':
            this.router.navigate(['./home/setup/consentform/']);
            break;
            case 'variable calculations':
            this.router.navigate(['./home/setup/phaseVariableCalculationList']);
            break;
            case 'add study':
            this.router.navigate(['./home/setup/study']);
            break;
            default:
               // alert('not implimented');
                break;
        }
    }

    onSelectProject() {
        this.clearFormGroup();
        this.listFormGroup.get('projectId').setValue(this.selectedProjectId);
        this.selectedPhaseId = 0;
        this.getPhases(this.selectedProjectId);
    }

    clearFormGroup() {
        this.listFormGroup.reset();
        setTimeout(function () {
            $('select[id=\'selectpicker\']').selectpicker('refresh');
        }
            , 500);
    }

    getPhaseByID(phase_id) {
        this.apicall.get(ApiEndpoints.getdetails, '76/' + phase_id).subscribe(
            res => {
                if (res.json().ack == 'success') {
                    this.phaseListModel = res.json().Data;
                    let singPhase: PhaseListModel = new PhaseListModel();
                    if (this.phaseListModel.length > 0) {
                        singPhase = this.phaseListModel[0];
                    }
                    singPhase.data_collection_start_date = singPhase.data_collection_start_date != '' ? this.datePipe.transform(singPhase.data_collection_start_date, 'yyyy-MM-dd') : '';
                    singPhase.data_collection_end_date = singPhase.data_collection_end_date != '' ? this.datePipe.transform(singPhase.data_collection_end_date, 'yyyy-MM-dd') : singPhase.data_collection_end_date;
                    singPhase.last_testing_date = singPhase.last_testing_date != '' ? this.datePipe.transform(singPhase.last_testing_date, 'yyyy-MM-dd') : '';
                    this.selectedPhase = singPhase;
                    this.listFormGroup.get('phaseId').setValue(singPhase.phase_id);
                    this.listFormGroup.get('phaseName').setValue(singPhase.phase_name);
                    this.listFormGroup.get('projectTask').setValue(singPhase.project_task);
                    this.listFormGroup.get('expenditureType').setValue(singPhase.expenditure_type);
                    this.listFormGroup.get('expenditureOrg').setValue(singPhase.expenditure_org);
                    this.listFormGroup.get('phaseTypeId').setValue(singPhase.phase_type_id);
                    this.listFormGroup.get('statusId').setValue(singPhase.status_id);
                    this.listFormGroup.get('phaseAcronym').setValue(singPhase.phase_acronym);
                    this.listFormGroup.get('censusReference').setValue(singPhase.census_reference);
                    this.listFormGroup.get('pedCalculationId').setValue(singPhase.ped_calculation_id);
                    this.listFormGroup.get('dataCollectionStartDate').setValue(singPhase.data_collection_start_date);
                    this.listFormGroup.get('dataCollectionEndDate').setValue(singPhase.data_collection_end_date);
                    this.listFormGroup.get('lastTestingDate').setValue(singPhase.last_testing_date);
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


    getPhasesTests(phase_id) {
        this.phaseTestData = [];
        this.allphaseTestData = [];
        this.apicall.get(ApiEndpoints.getdetails, '77/' + phase_id).subscribe(
            res => {
                // this.loader.loading = false;
                if (res.json().ack == 'success') {
                    this.phaseTestData = res.json().Data;
                    this.allphaseTestData = res.json().Data;
                    for (const item of this.phaseTestData) {
                        item.isEdit = false;
                        item.isChecked = false;
                    }
                } else {
                    this.errorComponent.handleCustomError(MessageComponent.error_get);
                }
            },
            err => {
                // // this.loader.loading = false;
                this.errorComponent.handleError(err);
            });
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

    getTemplateData(id: any) {
        this.dataCollectionVariableId = id;
        if (id == '' || id == null || id == 0) {
            this.details = false;
        } else {
            //  this.loader.loading = true;

            this.apicall.get(ApiEndpoints.getdetails, '67/' + id).subscribe(
                res => {
                    // this.loader.loading = false;

                    if (res.json().ack == 'success') {
                        this.details = res.json();
                        const time1 = new Date();
                    } else {
                        this.errorComponent.handleCustomError(MessageComponent.error_get);
                    }
                },
                err => {
                    // this.loader.loading = false;
                    this.errorComponent.handleError(err);
                });
        }
    }

    cancelEvent() {
        $('#example tr.selected').removeClass('selected');

        $('input:checkbox').prop('checked', false);
        if (this.isComponentloaded) {
        }

        this.setDockControls();
        this.isComponentloaded = false;
        this.id = '';
        this.pageSubmit = false;
    }
}
