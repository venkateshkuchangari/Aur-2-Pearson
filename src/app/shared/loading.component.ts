import { Injectable } from '@angular/core';



@Injectable()
export class LoadingServiceComponent  {
    loading: boolean;
    constructor() {
        this.loading = false;
    }

    loadWheel(flag: boolean) {
         this.loading = flag;
    }
}
