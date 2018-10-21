export class PhaseTypeModel {
    phase_type_id: number;
    phase_type_description: string;
    date_deleted: any;
}


export class PhaseModel {
    phaseId: number;
    projectId: number;
    phaseName: string;
    projectTask: string;
    expenditureType: string;
    expenditureOrg: string;
    phaseTypeId: number;
    statusId: number;
    useAgeAdjustment: string;
    pedCalculationId: number;
    selfEdCalcAge: string;
    censusReference: string;
    dataCollectionStartDate: string;
    dataCollectionEndDate: string;
    lastTestingDate: string;
    dateDeleted: string;
    cooCalculationId: string;
    useCooCalculation: string;
    payRatesPdfPath: string;
    languageCriteriaPdfPath: string;
    projPhaseStudyCriteriaPdfPath: string;
    projPhaseStudyInfoPdfPath: string;
    phaseAssignmentInfoPdfPath: string;
    phaseAcronym: string;
    phaseLanguageId: string;
    useNewPayments: string;
    projPhaseStudyInfoPath: string;
}

export class PhaseListModel {
    phase_id: number;
    status_id: number;
    phase_name: string;
    project_id: number;
    date_deleted?: any;
    project_task: string;
    phase_acronym: string;
    phase_type_id: number;
    expenditure_org: string;
    census_reference: string;
    expenditure_type: string;
    self_ed_calc_age?: any;
    use_new_payments?: any;
    last_testing_date: string;
    phase_language_id?: any;
    coo_calculation_id?: any;
    pay_rates_pdf_path?: any;
    ped_calculation_id: number;
    use_age_adjustment?: any;
    use_coo_calculation?: any;
    data_collection_end_date: string;
    data_collection_start_date: string;
    language_criteria_pdf_path?: any;
    proj_phase_study_info_path?: any;
    phase_assignment_info_pdf_path?: any;
    proj_phase_study_info_pdf_path?: any;
    proj_phase_study_criteria_pdf_path?: any;
}


export class PhaseItemsModel {
    acronym: string;
    testName: String;
    id: number;
    isChecked = false;
    isSaved = false;
}

