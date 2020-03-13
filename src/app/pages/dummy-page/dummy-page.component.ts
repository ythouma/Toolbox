import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { fromEvent, BehaviorSubject, merge, Subscription } from 'rxjs';
import { Router, ActivatedRoute  } from '@angular/router';
import { RequestService, LayoutUtilsService, LoaderService, SubheaderService, StoreService } from '../../shared/services';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-dummy-page',
    templateUrl: './dummy-page.component.html',
    styleUrls: ['./dummy-page.component.scss']
})
export class DummyPageComponent implements OnInit {
  	private subscriptions: Subscription[] = [];

    public loading: boolean = false;
    public returnUrl: string;
    public token: string;

    constructor(
      private router: Router,
      private storeService: StoreService,
      private loaderService: LoaderService,
      private requestService: RequestService,
      private layoutUtilsService: LayoutUtilsService,
      private changeDetectorRefs: ChangeDetectorRef,
      private subheaderService: SubheaderService,
      private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
      this.subheaderService.setTitle('No Access');
      this.subheaderService.setBreadcrumbs([
				{ title: 'No Access', page: undefined },
			]);

      this.loading = false;
      this.loaderService.display(true);
      this.route.queryParams.subscribe(params => {
          if(params.hasOwnProperty('token') && params.hasOwnProperty('orgid')){
            // console.log('params', params);
            // Put an api to get user data
            let userData = { _id: 1234, name: 'Test User', token: params.token, role: {_id: 'admin', name: 'Admin'}};
            localStorage.setItem('currentUser', JSON.stringify(userData));
            this.requestService.currentUser = userData;
            this.requestService.setToken(params.token);
            this.requestService.orgId.next(params.orgid);
            this.storeService.set('orgId', params.orgid);
            this.loaderService.display(false);
            this.router.navigateByUrl(params.returnUrl);
          }else{
            this.reloadPage();
          }
      });
    }
    reloadPage(){
      if(environment.production){
        //window.location.reload();
        parent.location.reload();
      }
    }
    ngOnDestroy() {
     this.subscriptions.forEach(el => el.unsubscribe());
    }
}
