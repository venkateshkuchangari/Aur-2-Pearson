export class Dock {
    backgroundcolor = 'black';
    dockControls: DockControl[];
    guid: any;
    constructor() {
        this.dockControls = [];
    }
}

export class DockControl {
    dropDownSettings: Object;
    data: any[];
    selectedItems: any[];
    type: string;
    label: string;
    value: any;
    enable = false;
    key: string;
    controlOptions: KeyValuePair[];
    idKey: string;
    descKey: string;
    constructor() {
        this.controlOptions = [];
        this.type = 'button';
    }
}


export class KeyValuePair {
    id: string;
    name: string;
    ID: number;
    Description: string;

}

export enum ButtonType {
    AddorEdit,
    Delete,
    Saved,
    Cancel,
    Refresh
}

