import {InjectionToken} from '@angular/core';

import {IAppConfig} from './iapp.config';

export let APP_CONFIG = new InjectionToken('app.config');

export const AppConfig: IAppConfig = {
  routes: {
    error404: '404'
  },
  endpoints: {
  },
  snackBarDuration: 3000,
  repositoryURL: ''
};
