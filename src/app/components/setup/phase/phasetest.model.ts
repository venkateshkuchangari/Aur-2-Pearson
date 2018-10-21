export class PhaseTestModel {
    phaseId: number;
    testId: number;
    phaseTestId: number;
    reviewRequired: string;
    billingProjectId: number;
    billingProjectTask: string;
    billingExpenditureType: string;
    billingExpenditureOrg: string;
    dateDeleted: string;
    scoringState: string;
    parentTestId: string;
    testOrder: string;
}

export class PhaseTestData {
    id: number;
    Test: string;
    test_id: number;
    phase_id: number;
    test_order?: any;
    date_deleted?: any;
    parent_testID: number;
    phase_test_id: number;
    scoring_state: string;
    review_required = false;
    billing_project_task: string;
    billing_project_id: number;
    billing_expenditure_type: string;
    billing_expenditure_org: string;
    isEdit = false;
    isChecked = false;
}

