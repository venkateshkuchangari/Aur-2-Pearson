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
import { LookupModel } from '../../setup/test/testtype.model';
import { ProjectListModel } from '../project/project.model';
import { StatusModel } from '../project/status.model';
import { PhaseTypeModel, PhaseListModel, PhaseModel, PhaseItemsModel } from '../phase/phase.model';
import { ProjectTypeModel } from '../project/projecttype';
import { MessageComponent } from '../../common/error-message.component';
import { StudyModel } from './study.model';
import * as buttonconstants from '../../common/app.buttonconstants';
declare var $: any;


@Component({
    selector: 'study',
    templateUrl: 'study.component.html',
    styleUrls: ['study.component.scss']
})
export class StudyComponent {
    id: any;
    dock: Dock;
    dockControl: DockControl;
    dloList: KeyValuePair[];
    phasedloList: KeyValuePair[];
    studydloList: KeyValuePair[];
    studyModel: LookupModel[];
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
    studyData: StudyModel;
    countryId: number;
    selectedProjectId: number;
    selectedPhaseId: number;
    phaseItemsModel: PhaseItemsModel[];
    selectedStudyId: number;
    types: ProjectTypeModel[];
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
        this.studyData = new StudyModel();
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

    }

    ngOnInit() {
        this.countryId = this.userInfo.getCountryId();
        this.listFormGroup = new FormGroup({
            studyId: new FormControl(this.studyData.studyId),
            phaseId: new FormControl(this.studyData.phaseId, [Validators.required]),
            studyName: new FormControl(this.studyData.studyName, [Validators.required]),
            studyAcronym: new FormControl(this.studyData.studyAcronym, [Validators.required]),
            studyTypeId: new FormControl(this.studyData.studyTypeId, [Validators.required]),
            studyStatusId: new FormControl(this.studyData.studyStatusId, [Validators.required]),
        });

        this.translate.use('en');
        this.getDloList();

        this.getTypes();
        this.getStatus();
        this.getItems();
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
            setTimeout(() => {
                $('select[id=\'selectpicker\']').selectpicker('refresh');
            }, 500);
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
                this.phaseItemsModel.push(phaseItem);
            }
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


    setDockControls() {
        this.dock.dockControls = [];
        this.dock.backgroundcolor = '#343a40';
        this.addButtonToList(buttonconstants.Save, true);
        this.addButtonToList(buttonconstants.Cancel, true);
        this.addSelectToList(buttonconstants.Select, this.dloList, 'project', this.selectedProjectId);
        this.addSelectToList(buttonconstants.Select, this.phasedloList, 'phase', this.selectedPhaseId);
        this.addSelectToList(buttonconstants.Select, this.studydloList, 'study', this.selectedStudyId);

        if (this.selectedStudyId > 0) {
            this.addButtonToList(buttonconstants.AddStudyTest, true);
            }
        // this.addButtonToList(buttonconstants.AddPhase, true);
        // this.addButtonToList(buttonconstants.Delete, true);
        this.addButtonToList(buttonconstants.AddStudy, true);
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
        if (confirm(MessageComponent.msg_confirm)) {
            // // this.loader.loading = true;
            this.apicall.put(ApiEndpoints.deletePhase + this.selectedPhaseId, null).subscribe(
                res => {
                    // // this.loader.loading = false;
                    if (res.status == '200') {
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
        this.listFormGroup.get('phaseId').setValue(this.selectedPhaseId);
        if (this.listFormGroup.valid && this.selectedPhaseId > 0 ) {
            // // this.loader.loading = true;
            const saveURL = ApiEndpoints.saveStudy;
            this.studyData = this.listFormGroup.value;
            this.studyData.phaseId = this.selectedPhaseId;

            if (this.studyData.studyId != null && this.studyData.studyId > 0) {
                 this.updateStudy();
            } else {
                this.apicall.post(saveURL, this.studyData).subscribe(
                    res => {
                        // // this.loader.loading = false;
                        if (res.status == '201') {
                            this.clearFormGroup();
                            $('select[id=\'selectpicker\']').selectpicker('refresh');
                            this.getStudy(this.selectedPhaseId);
                            // this.listFormGroup.get("projectId").setValue(this.selectedProjectId);

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
            this.errorComponent.handleCustomError(MessageComponent.msg_selectproject);
        }
    }

    updateStudy() {
        const saveURL = ApiEndpoints.updateStudy;
        this.apicall.put(saveURL, this.studyData).subscribe(
            res => {
                debugger;
                // // this.loader.loading = false;
                if (res.status == '201') {
                    this.getStudy(this.selectedPhaseId);

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
                this.selectedStudyId = 0;
                this.getDloList();
                this.getTypes();
                this.getStatus();
                break;
            case 'project':
                this.selectedProjectId = event.value;
                this.getPhases(event.value);
                break;
            case 'phase':
                this.selectedPhaseId = event.value;
                this.listFormGroup.get('phaseId').setValue(event.value);
                this.getStudy(this.selectedPhaseId);
                break;
            case 'study':
                this.selectedStudyId = event.value;
                  this.listFormGroup.get('studyId').setValue(event.value);
                 this.getStudyById(this.selectedStudyId);

                 this.setDockControls();
                break;
            case 'study test':
                this.router.navigate(['./home/setup/studytest/' + this.selectedStudyId]);
            break;
            default:
                alert('not implimented');
                break;
        }
    }

    clearFormGroup() {
        this.listFormGroup.reset();
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

    getStudy(phase_id) {
        this.studydloList = [];
        // this.setDockControls();
        this.apicall.get(ApiEndpoints.getdetails, '97/' + phase_id).subscribe(
            res => {
                // // this.loader.loading = false;
                if (res.json().ack == 'success') {
                    this.studyModel = res.json().Data;
                    for (const data of this.studyModel) {
                        const info = new KeyValuePair();
                        info.ID = data.lkp_lookup_value_id;
                        info.Description = data.value_description;
                        this.studydloList.push(info);
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

    getStudyById(studyId) {
        this.apicall.get(ApiEndpoints.getdetails, '91/' + studyId).subscribe(
            res => {
                // // this.loader.loading = false;
                if (res.json().ack == 'success') {
                    this.studyData = res.json().Data[0];
                    this.fillDataToContorls();
                } else {
                    this.errorComponent.handleCustomError(MessageComponent.error_get);
                }
            },
            err => {
                // // this.loader.loading = false;
                this.errorComponent.handleError(err);
            });
    }

    fillDataToContorls() {
        this.listFormGroup.setValue({
            studyId: this.studyData.studyId,
            studyName: this.studyData.studyName,
            phaseId: this.studyData.phaseId,
            studyAcronym: this.studyData.studyAcronym,
            studyTypeId: this.studyData.studyTypeId,
            studyStatusId: this.studyData.studyStatusId
        });

            $('select[id=\'selectpicker\']').selectpicker('refresh');

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

        this.isComponentloaded = false;
        this.id = '';
        this.pageSubmit = false;
    }
}
