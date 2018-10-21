import { Component } from '@angular/core';
import { Dock, DockControl, KeyValuePair } from '../../common/dock.controls';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiCallComponent } from '../../../services/apicall.component';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserInfoComponent } from '../../../shared/userinfo.component';
import { MatSnackBar } from '@angular/material';
import { ErrorComponent } from '../../../services/error.component';
import { Observable } from 'rxjs/Observable';
import { ApiEndpoints } from '../../../services/apiendpoints';
import * as buttonconstants from '../../../shared/app.buttonconstants';
import { LookupModel } from '../../setup/test/testtype.model';
import { ProjectListModel } from '../project/project.model';
import { StatusModel } from '../project/status.model';
import { PhaseTypeModel, PhaseListModel, PhaseModel, PhaseItemsModel } from '../phase/phase.model';
import { ProjectTypeModel } from '../project/projecttype';

declare var $: any;

@Component({
    selector: 'consentform',
    templateUrl: 'consentform.component.html',
    styleUrls: ['consentform.component.scss']
})
export class ConsentformComponent {
    id: any;
    dock: Dock;
    dockControl: DockControl;
    dloList: KeyValuePair[];
    phasedloList: KeyValuePair[];
    studydloList: KeyValuePair[];
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
    countryId: number;
    selectedProjectId: number;
    selectedPhaseId: number;
    phaseItemsModel: PhaseItemsModel[];
    selectedStudyId: number;
    types: ProjectTypeModel[];
    services: LookupModel[];
    diagnosis: LookupModel[];
    headerSelected: boolean;

    constructor(private datePipe: DatePipe, private apicall: ApiCallComponent, private router: Router
        , private translate: TranslateService
        , private userInfo: UserInfoComponent, public snackBar: MatSnackBar
        // , private loader: LoadingServiceComponent
        , private errorComponent: ErrorComponent
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
        this.selectedStudyId = 0;
        this.phaseItemsModel = [];
        this.studydloList = [];
        this.services = [];
        this.diagnosis = [];
        //this.setDockControls();
    }



    ngOnInit() {
        this.countryId = this.userInfo.getCountryId();

        this.listFormGroup = new FormGroup({
            phaseId: new FormControl(this.phaseModel.phaseId),
            projectId: new FormControl(this.phaseModel.projectId, [Validators.required]),
        });

        this.translate.use('en');
        this.getDloList();

        this.getTypes();
         this.getStatus();
         this.getServices();
         this.getDiagnosis();
        // this.currentUser = this.userInfo.getUserName();
    }

    getCountry() {
        this.getPageDDLs('67/' + this.countryId).subscribe((res: any) => {
            this.countries = res;
            this.countryName = res[0].data_col_var_opt_desc;
        });
    }

    getTypes() {
        this.getPageDDLs('62/242').subscribe((res: any) => {
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

    getServices() {
        this.services = [];
        this.getPageDDLs('27/3').subscribe((res: any) => {
            this.services = res;

        });
    }

    getDiagnosis() {
        this.services = [];
        this.getPageDDLs('26/2').subscribe((res: any) => {
            this.diagnosis = res;

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
        this.apicall.get(ApiEndpoints.getdetails, '60/242').subscribe(
            res => {
                if (res.json().ack == 'success') {
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
        this.addSelectToList(buttonconstants.Select, this.dloList, 'project', this.selectedProjectId);
        this.addSelectToList(buttonconstants.Select, this.phasedloList, 'phase', this.selectedPhaseId);
        this.addSelectToList(buttonconstants.Select, this.studydloList, 'study', this.selectedStudyId);
        this.addButtonToList(buttonconstants.AddPhase, true);
        this.addButtonToList(buttonconstants.Delete, true);

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
            this.snackBar.open('Please select phase to delete.', 'Success', {
                duration: 2000,
            });
            return false;
        }
        if (confirm('Are you sure you want to delete phase?')) {
            // // this.loader.loading = true;
            this.apicall.put(ApiEndpoints.deletePhase + this.selectedPhaseId, null).subscribe(
                res => {
                    // // this.loader.loading = false;
                    if (res.status == '200') {
                        // this.cancelEvent();
                        //this.setDockControls();
                        this.clearFormGroup();
                        this.selectedPhaseId = 0;
                        this.listFormGroup.get('projectId').setValue(this.selectedProjectId);
                        this.getPhases(this.selectedProjectId);

                        this.snackBar.open('Phase information deleted successfully.', 'Success', {
                            duration: 2000,
                        });
                    } else {

                        // this.errorComponent.handleError(err);
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
            // this.phaseModel.dataCollectionStartDate = this.datePipe.transform(this.phaseModel.dataCollectionStartDate, "MM/dd/yyyy");
            // this.phaseModel.dataCollectionStartDate = this.datePipe.transform(this.phaseModel.dataCollectionStartDate, "EEE MMM dd HH:mm:ss z yyyy");
            this.phaseModel.dataCollectionStartDate = 'SUN Dec 23 00:00:00 CEST 2018';
            this.phaseModel.dataCollectionEndDate = 'MON Dec 24 00:00:00 CEST 2018';
            this.phaseModel.lastTestingDate = 'SAT Dec 22 00:00:00 CEST 2018';
            if (this.phaseModel.phaseId != null && this.phaseModel.phaseId > 0) {
                this.updatePhase();
            } else {
                this.apicall.post(saveURL, this.phaseModel).subscribe(
                    res => {
                        // // this.loader.loading = false;
                        if (res.status == '201') {
                            // this.cancelEvent();
                            //this.setDockControls();
                            this.clearFormGroup();
                            this.listFormGroup.get('projectId').setValue(this.selectedProjectId);
                            this.getPhases(this.selectedProjectId);

                            this.snackBar.open('Phase information saved successfully.', 'Success', {
                                duration: 2000,
                            });
                        } else {

                            // this.errorComponent.handleError(err);
                        }
                    },
                    err => {
                        // // this.loader.loading = false;
                        this.errorComponent.handleError(err);
                    });
            }
        } else {
            this.snackBar.open('Please select Project and fill required fields', 'Error', {
                duration: 2000,
            });
        }

    }

    updatePhase() {
        const saveURL = ApiEndpoints.updatePhase;
        this.apicall.put(saveURL, this.phaseModel).subscribe(
            res => {
                // // this.loader.loading = false;
                if (res.status == '200') {
                    this.getPhases(this.selectedProjectId);

                    this.snackBar.open('Phase information updated successfully.', 'Success', {
                        duration: 2000,
                    });
                } else {

                    // this.errorComponent.handleError(err);
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
                // $("#txtSearch").val("");
                // this.setDockControls();
                // this.getTemplateData();
                // this.ngOnInit();
                break;
            case 'cancel':
                this.id = null;
                this.clearFormGroup();
                 this.selectedProjectId = 0;
                 this.selectedPhaseId = 0;
                 this.getDloList();
                break;
            case 'project':
                this.selectedProjectId = event.value;
                this.listFormGroup.get('projectId').setValue(event.value);
                this.getPhases(event.value);
                break;
            case 'phase':
                this.selectedPhaseId = event.value;
                this.listFormGroup.get('phaseId').setValue(event.value);
                // this.getPhaseByID(event.value);
                break;
            default:
                alert('not implimented');
                break;
        }
    }

    clearFormGroup() {
        this.listFormGroup.reset();
        // this.listFormGroup.get("projectId").setValue("");
        // this.listFormGroup.get("projectTypeId").setValue("");
        // this.listFormGroup.get("statusId").setValue("");
        // this.listFormGroup.get("projectName").setValue("");
        // this.listFormGroup.get("projectAcronym").setValue("");
        // this.listFormGroup.get("projectNumber").setValue("");

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

    getPhases(project_id) {
        this.phasedloList = [];
        this.setDockControls();
        this.apicall.get(ApiEndpoints.getdetails, '57/' + project_id).subscribe(
            res => {
                if (res.json().ack == 'success') {
                    this.phaseListModel = res.json().Data;

                    for (const data of this.phaseListModel) {
                        const info = new KeyValuePair();
                        info.ID = data.phase_id;
                        info.Description = data.phase_name;
                        this.phasedloList.push(info);
                    }
                } else {
                    // // this.loader.loading = false;
                    //this.errorComponent.handleError(err);
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
                    // if (this.isComponentloaded != true) {
                    //     this.isComponentloaded = true;
                    //     this.toggleClick(1);
                    // }

                    // if (res.json().error != null) {
                    //     this.snackBar.open(res.json().error_description, 'Error', {
                    //         duration: 2000,
                    //     });
                    // }
                    // else {
                    //     this.dynamicObject = res.json();
                    // }

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

    cancelEvent() {
        $('#example tr.selected').removeClass('selected');

        $('input:checkbox').prop('checked', false);
        if (this.isComponentloaded) {
            // this.toggleClick(1);
        }

        this.setDockControls();

        // this.isAnyEdited = false;
        this.isComponentloaded = false;
        this.id = '';
        this.pageSubmit = false;
        // this.selectedIndex = -1;
        // this.headerSelected = false;
    }
}
