export class PageInfoComponent {
    pageId: any;
    templatedId: any;
    primarykey: any;
    columnDisplay: any;
    tableName: any;

    // returnDate(bPageId?: any,btemplateId?:any,btableName?:any, bprimarykey?: any,bcolumnDisplay?:any) {
    //     this.pageId = bPageId;
    //     this.templatedId = btemplateId;
    //     this.primarykey = bprimarykey;
    //     this.columnDisplay = bcolumnDisplay;
    //     this.tableName = btableName;
    // }
}


export class PageIdComponent {
    pageInfoComponent: PageInfoComponent;
    constructor(  ) {
        this.pageInfoComponent = new PageInfoComponent();
    }

    // pageInfoComponent:PageInfoComponent = new PageInfoComponent();
    public   get testpage_id(): PageInfoComponent {
         this.pageInfoComponent.templatedId = 7;
        this.pageInfoComponent.primarykey  = 'Member ID';
        return this.pageInfoComponent;
    }

    // public static get userspage_id(): PageInfoComponent {
    //     return new PageInfoComponent(1,7,"fr_member_detail", "member_id", "Member ID");
    // }

    public   get userspage_id(): PageInfoComponent {
         this.pageInfoComponent.templatedId = 7;
        this.pageInfoComponent.primarykey  = 'Member ID';
        return this.pageInfoComponent;
    }

    public  get  candidatepage_id(): PageInfoComponent {
        // return new PageInfoComponent(1,46,"fr_candidate", "candidate_id", "ID");
         this.pageInfoComponent.templatedId = 46;
          this.pageInfoComponent.primarykey  = 'ID';
        return this.pageInfoComponent;
    }
    //ui_assignment_grid_candidates

    public get Members(): PageInfoComponent {
        this.pageInfoComponent.templatedId = 134;
        this.pageInfoComponent.primarykey = 'Member ID';
        return this.pageInfoComponent;
    }
}
