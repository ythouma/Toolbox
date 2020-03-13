import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { fromEvent, BehaviorSubject, merge, Subscription } from 'rxjs';
import { RequestService } from '../shared/services';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-pages',
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  	private subscriptions: Subscription[] = [];
    public hideOuter: boolean = environment.production;
    public hideInner: boolean = true;
    constructor(private route: ActivatedRoute,
    private requestService: RequestService) {}

    ngOnInit() {
      this.subscriptions.push(
      this.route.queryParams.subscribe(params => {
          if(params.hasOwnProperty('token') && params.hasOwnProperty('orgid')){
            this.hideOuter = true;
          }
        })
      );
      this.subscriptions.push(
        this.requestService.orgId.subscribe((data) => {
          console.log('orgId', data);
          if (data) {
            this.hideInner = false;
          }else{
            this.hideInner = true;
          }
        })
      );
    }
    ngOnDestroy() {
     this.subscriptions.forEach(el => el.unsubscribe());
    }
}
