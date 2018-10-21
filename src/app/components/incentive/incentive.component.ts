import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/Auth';

@Component({
    selector: 'incentive',
    templateUrl: 'incentive.component.html',
    styleUrls: ['incentive.component.scss']
})
export class IncentiveComponent {
    constructor(
        private translate: TranslateService, private router: Router, private auth: Auth
      ) {
        debugger;
        this.translate.use('en');
      }
}
