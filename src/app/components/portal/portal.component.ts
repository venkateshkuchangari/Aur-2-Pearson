import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/Auth';

@Component({
    selector: 'portal',
    templateUrl: 'portal.component.html',
    styleUrls: ['portal.component.scss']
})

export class PortalComponent {
    constructor(
        private translate: TranslateService, private router: Router, private auth: Auth
      ) {
          debugger;
        this.translate.use('en');
    }
}
