import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { BehaviorSubject, Subscription } from 'rxjs';
import { RequestService, LayoutUtilsService, LoaderService, SubheaderService } from '../../shared/services';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  	private subscriptions: Subscription[] = [];
    public loading: boolean = false;
    public title = environment.serverName;
    public subTitle = environment.subServerName;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    constructor(private router: Router,
      private loaderService: LoaderService,
      private requestService: RequestService,
      public dialog: MatDialog,
      public snackBar: MatSnackBar,
      private layoutUtilsService: LayoutUtilsService,
      private changeDetectorRefs: ChangeDetectorRef,
      private subheaderService: SubheaderService
    ) {}
    ngOnInit() {
      this.subheaderService.setTitle('Dashboard');
      this.subheaderService.setBreadcrumbs([
				{ title: 'Dashboard', page: undefined },
			]);
      // this.loaderService.display(true);

    }
    ngOnDestroy() {
     this.subscriptions.forEach(el => el.unsubscribe());
    }
    goTo(path) {
      this.router.navigate([path]);
    }
}
