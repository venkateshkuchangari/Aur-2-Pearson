import { Component } from '@angular/core';
import { Dock, DockControl, KeyValuePair } from '../../common/dock.controls';
import { ProjectTypeModel } from './projecttype';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProjectModel, ProjectListModel, SavedProject } from './project.model';
import { StatusModel } from './status.model';
import { ApiCallComponent } from '../../../services/apicall.component';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserInfoComponent } from '../../../shared/userinfo.component';
import { ErrorComponent } from '../../../services/error.component';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { ApiEndpoints } from '../../../services/apiendpoints';
import * as buttonconstants from '../../common/app.buttonconstants';
import { LookupModel } from '../../setup/test/testtype.model';
import { MessageComponent } from '../../common/error-message.component';

declare var $: any;

@Component({
    selector: 'project',
    templateUrl: 'project.component.html',
    styleUrls: ['project.component.scss']
})
export class ProjectComponent {
    id: any;
    dock: Dock;
    dockControl: DockControl;
    dloList: KeyValuePair[];
    types: ProjectTypeModel[];
    countries: LookupModel[];
    details: any;
    isComponentloaded: boolean;
    listFormGroup: FormGroup;
    projectModel: ProjectModel;
    projectList: ProjectListModel[];
    pageSubmit: boolean;
    parent_data_col_var_opt_id: KeyValuePair[];
    selectedData: any[];
    dataCollectionVariableId: number;
    statusModel: StatusModel[];
    countryName: string;
    selectedProjectId = 0;
    savedProject: SavedProject;
    headerSelected: boolean;
    countryId:number;
    constructor(private apicall: ApiCallComponent, private router: Router
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
        this.projectModel = new ProjectModel();
        this.projectList = [];
        this.pageSubmit = false;
        this.parent_data_col_var_opt_id = [];
        this.selectedData = [];
        this.dataCollectionVariableId = 0;
        this.countries = [];
    }

    ngOnInit() {
        this.projectModel.countryId = this.userInfo.getCountryId();
        this.listFormGroup = new FormGroup({
            projectId: new FormControl(this.projectModel.projectId),
            projectTypeId: new FormControl(this.projectModel.projectTypeId),
            statusId: new FormControl(this.projectModel.statusId),
            projectName: new FormControl(this.projectModel.projectName, [Validators.required]),
            projectAcronym: new FormControl(this.projectModel.projectAcronym, [Validators.required]),
            projectNumber: new FormControl(this.projectModel.projectNumber),
            countryId: new FormControl(this.projectModel.countryId, [Validators.required]),
            dateDeleted: new FormControl(this.projectModel.dateDeleted),
        });

        this.translate.use('en');
        this.getDloList();
        this.getCountry();
        this.getTypes();
        this.getStatus();
    }

    getCountry() {
        this.getPageDDLs('67/' + this.projectModel.countryId).subscribe((res: any) => {
            this.countries = res;
            this.countryName = res[0].data_col_var_opt_desc;
        });
    }

    getTypes() {
        this.getPageDDLs('62/'+this.projectModel.countryId).subscribe((res: any) => {
            this.types = res;
            setTimeout(function () {
                $('select[id=\'selectpicker\']').selectpicker('refresh');
            }
                , 500);
        });
    }

    getStatus() {
        this.getPageDDLs('63/1').subscribe((res: any) => {
            this.statusModel = res;
            setTimeout(function () {
                $('select[id=\'selectpicker\']').selectpicker('refresh');
            }
                , 500);
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
        this.dloList = [];
        this.apicall.get(ApiEndpoints.getdetails, '60/'+this.projectModel.countryId).subscribe(
            res => {
                if (res.json().ack == 'success') {
                    this.projectList = res.json().Data;

                    for (const data of this.projectList) {
                        const info = new KeyValuePair();
                        info.ID = data.project_id;
                        info.Description = data.project_name;
                        this.dloList.push(info);
                    }
                    this.setDockControls();
                } else {
                    this.snackBar.open(res.json().error_description, 'Error', {
                        duration: 2000,
                    });

                    this.dock.dockControls = [];
                    this.dock.backgroundcolor = '#343a40';
                    this.addButtonToList(buttonconstants.AddorEdit, true);
                    this.addButtonToList(buttonconstants.Delete, false);
                    this.addButtonToList(buttonconstants.Refresh, false);
                    this.addSelectToList(buttonconstants.Select, []);
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
        this.addButtonToList(buttonconstants.Delete, true);
        this.addButtonToList(buttonconstants.AddProject, true);
        this.addButtonToList(buttonconstants.AddPhase, this.selectedProjectId > 0 ? true : false);
        this.addButtonToList(buttonconstants.Refresh, true);
        this.addSelectToList(buttonconstants.Select, this.dloList);
    }

    addButtonToList(buttonType: any, enable: boolean) {
        this.dockControl = new DockControl();
        this.dockControl.type = 'button';
        this.dockControl.label = buttonType;
        this.dockControl.enable = enable;
        this.dock.dockControls.push(this.dockControl);
    }

    addSelectToList(buttonType: any, options: any[]) {
        this.dockControl = new DockControl();
        this.dockControl.type = 'select';
        this.dockControl.label = buttonType;
        this.dockControl.enable = true;
        this.dockControl.value = this.selectedProjectId;
        this.dockControl.key = 'project';
        this.dockControl.controlOptions = options;
        this.dock.dockControls.push(this.dockControl);
    }

    deleteTemplate() {

        if (this.selectedProjectId > 0) {
            if (confirm('Are you sure you want to delete ?')) {
                this.apicall.put(ApiEndpoints.deleteProject + '/' + this.selectedProjectId, null).subscribe(
                    res => {
                        // // this.loader.loading = false;
                        if (res.status == '200') {
                            this.snackBar.open(MessageComponent.msg_deletesuccess, 'Success', {
                                duration: 2000,
                            });
                            this.selectedProjectId = 0;
                            this.clearFormGroup();
                            this.getDloList();
                        } else {
                            this.errorComponent.handleCustomError(MessageComponent.msg_deletefail);
                        }
                    },
                    err => {
                        // // this.loader.loading = false;
                        this.errorComponent.handleError(err);
                    });
            }
        } else {
            this.snackBar.open(MessageComponent.error_selectfordelete, 'Error', {
                duration: 2000,
            });
        }
    }

    saveTemplateData() {

        this.pageSubmit = true;
        this.projectModel.countryId = this.userInfo.getCountryId();
        this.listFormGroup.get('countryId').setValue(this.projectModel.countryId);
        if (this.listFormGroup.valid) {
            // // this.loader.loading = true;
            const saveURL = ApiEndpoints.saveProject;
            this.projectModel = this.listFormGroup.value;
            if (this.projectModel.projectId != null && this.projectModel.projectId > 0) {
                this.updateProject();
            } else {
                this.apicall.post(saveURL, this.projectModel).subscribe(
                    res => {
                        // // this.loader.loading = false;
                        if (res.status == '201') {
                            this.snackBar.open(MessageComponent.msg_savesuccess, 'Success', {
                                duration: 2000,
                            });
                            this.setDockControls();
                            //this.clearFormGroup();
                            this.getDloList();
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
            this.snackBar.open(MessageComponent.msg_selectrequired, 'Error', {
                duration: 2000,
            });
        }
    }

    updateProject() {
        let saveURL = ApiEndpoints.saveProject;
        this.projectModel = this.listFormGroup.value;
        saveURL = ApiEndpoints.updateProject;

        this.apicall.put(saveURL, this.projectModel).subscribe(
            res => {
                // // this.loader.loading = false;
                if (res.status == '200') {
                    this.snackBar.open(MessageComponent.msg_savesuccess, 'Success', {
                        duration: 2000,
                    });
                    this.getDloList();
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
            case 'add project':
                this.selectedProjectId = 0;
                this.setDockControls();
                this.clearFormGroup();
                this.cancelEvent();
                setTimeout(function () {
                    $('select[id=\'selectpicker\']').selectpicker('refresh');
                }
                    , 500);
                break;
            case 'save':
                this.saveTemplateData();
                //this.selectedProjectId=this.savedProject;
                //this.id=this.savedProject;
                break;
            case 'delete':
                this.deleteTemplate();
                break;
            case 'refresh':
                if (this.selectedProjectId > 0) {
                    this.getTemplateData(this.selectedProjectId);
                }
                break;
            case 'cancel':
                this.id = null;
                this.clearFormGroup();
                this.cancelEvent();
                break;
            case 'project':
                this.selectedProjectId = event.value;
                this.setDockControls();
                this.getTemplateData(event.value);
                break;
            case 'add phase':
                this.router.navigate(['./home/setup/phase',this.selectedProjectId]);
                break;
            default:
                this.errorComponent.handleCustomError(MessageComponent.msg_notimplemented);
                break;
        }
    }

    clearFormGroup() {
        this.listFormGroup.reset();
        this.listFormGroup.get('projectId').setValue('');
        this.listFormGroup.get('projectTypeId').setValue('');
        this.listFormGroup.get('statusId').setValue('');
        this.listFormGroup.get('projectName').setValue('');
        this.listFormGroup.get('projectAcronym').setValue('');
        this.listFormGroup.get('projectNumber').setValue('0');
        $('select[id=\'selectpicker\']').selectpicker('refresh');
    }

    getTemplateData(id: any) {
        this.dataCollectionVariableId = id;
        if (id == '' || id == null || id == 0) {
            this.details = false;
        } else {
            // //  this.loader.loading = true;
            this.apicall.get(ApiEndpoints.getdetails, '75/' + id).subscribe(
                res => {
                    // //   this.loader.loading = false;
                    this.projectModel.countryId = this.userInfo.getCountryId();
                    if (res.json().ack == 'success') {
                        this.savedProject = res.json().Data[0];
                        this.listFormGroup.setValue({
                            projectId: this.savedProject.project_id,
                            projectTypeId: this.savedProject.project_type_id,
                            statusId: this.savedProject.status_id,
                            projectName: this.savedProject.project_name,
                            projectAcronym: this.savedProject.project_acronym,
                            projectNumber: Number(this.savedProject.project_number),
                            dateDeleted: this.savedProject.date_deleted == null ? '' : this.savedProject.date_deleted,
                            // countryId: this.savedProject.country_id,
                            countryId: this.projectModel.countryId,
                        });

                        setTimeout(function () {
                            $('select[id=\'selectpicker\']').selectpicker('refresh');
                        }
                            , 500);
                    } else {
                        // //   this.loader.loading = false;
                        this.errorComponent.handleCustomError(MessageComponent.error_get);
                    }
                },
                err => {
                    // // this.loader.loading = false;
                    this.errorComponent.handleError(err);
                });
        }
    }

    cancelEvent() {
        $('#example tr.selected').removeClass('selected');

        $('input:checkbox').prop('checked', false);
        if (this.isComponentloaded) {
            // this.toggleClick(1);
        }

        this.getDloList();
        this.id = '';
        this.pageSubmit = false;
    }
}
