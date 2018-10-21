import { Injectable } from '@angular/core';
import { UserInfoComponent } from './userinfo.component';



@Injectable()
export class TimerComponent {
    showRefresh: boolean;
    timeout: number;
    lastApiCallTime: number;
    constructor(private userInfo: UserInfoComponent) {
        this.showRefresh = false;
    }

    public loadRefresh(flag: boolean) {
        this.showRefresh = flag;
    }

    public resetTime() {
        this.timeout = this.userInfo.getTimeput();
        this.lastApiCallTime = new Date().getTime();
        this.showRefresh = false;
    }

}
