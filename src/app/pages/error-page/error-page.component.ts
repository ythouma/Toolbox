import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RequestService, SubheaderService } from '../../shared/services';

@Component({
    selector: 'app-error-page',
    templateUrl: './error-page.component.html',
    styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {
	  private subscriptions: Subscription[] = [];
    private selectedUser: any;
    public errorType: string = '';
    public errorTypeString: string = '';
    constructor(private requestService: RequestService,
      public dialog: MatDialog,
      private subheaderService: SubheaderService,
  		private activatedRoute: ActivatedRoute,) {}

    ngOnInit() {
      this.subscriptions.push(
        this.requestService.currentUserSubject.subscribe((val: any) => {
            this.selectedUser = val;
        })
      );
      const routeSubscription =  this.activatedRoute.params.subscribe(params => {
        if(params.hasOwnProperty('type')){
          this.errorType = params['type'];
          if(this.errorType === '401'){
            this.errorTypeString = 'UNAUTHORIZED';
          }
        }
        this.subheaderService.setTitle('Error');
        this.subheaderService.setBreadcrumbs([
  				{ title: 'Error', page: `/error` },
  			]);
      });

    }
    ngOnDestroy() {
      this.subscriptions.forEach((s) => s.unsubscribe());
    }
}
