import { Component, OnInit  } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Meta, Title} from '@angular/platform-browser';

import {NavigationEnd, Router} from '@angular/router';
import {AppConfig} from './config/app.config';
import {MatSnackBar} from '@angular/material';

declare const Modernizr;
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

  isOnline = navigator.onLine;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  cities = [];
  items = [];
  constructor(private translateService: TranslateService,
              private title: Title,
              private meta: Meta,
              private snackBar: MatSnackBar,
              private router: Router) {

    this.translateService = translateService;
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');

    this.title.setTitle('Aurora2');
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        switch (event.urlAfterRedirects) {
          case '/':
            this.meta.updateTag({
              name: 'description',
              content: 'Angular Example app with Angular CLI, Angular Material and more'
            });
            break;
          /* case '/' + AppConfig.routes.heroes:
            this.title.setTitle('Heroes list');
            this.meta.updateTag({
              name: 'description',
              content: 'List of super-heroes'
            });
            break; */
        }
      }
    });

    this.checkBrowserFeatures();


  }

  onItemSelect(item: any) {
    console.log(item);
}
onSelectAll(items: any) {
    console.log(items);
}
  ngOnInit() {
    this.cities = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
  ];
  this.selectedItems = [
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' }
  ];
  this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
  };

  // this.router.navigateByUrl('login');
    setTimeout(() => {

       //  $("select[id='selectpicker']").selectpicker();
      // $('.selectpicker').selectpicker({
      //   style: 'btn-info',
      //   size: 4
      // });
    //   $("select[id='testmulti']").multiselect({
    //     header: false,
    //     noneSelectedText: "Select",
    //     enableFiltering: true,
    //     enableCaseInsensitiveFiltering: true,
    // });

   }, 500);

  }



  checkBrowserFeatures() {
    let supported = true;
    for (const feature in Modernizr) {
      if (Modernizr.hasOwnProperty(feature) &&
        typeof Modernizr[feature] === 'boolean' && Modernizr[feature] === false) {
        supported = false;
        break;
      }
    }

    if (!supported) {
      this.translateService.get(['updateBrowser']).subscribe((texts) => {
        this.snackBar.open(texts['updateBrowser'], 'OK');
      });
    }

    return supported;
  }
}
