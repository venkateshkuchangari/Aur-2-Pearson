export class ProjectModel {
    projectId: number;
    projectTypeId: number;
    statusId: number;
    projectName: string;
    projectAcronym: string;
    projectNumber = 0;
    dateDeleted = '';
    countryId: string;
    project_name: string;
}


export class ProjectListModel {
    project_id: number;
    project_acronym: string;
    project_name: string;
}


export class SavedProject {
    status_id: number;
    country_id: number;
    project_id: number;
    project_type_id: number;
    project_number: string;
    project_name: string;
    project_acronym: string;
    date_deleted: string;
}
