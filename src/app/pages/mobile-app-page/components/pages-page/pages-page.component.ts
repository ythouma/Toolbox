import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
// import { ModalVideoViewDialogComponent } from '../../../../shared/components/custom-video-view-dialog/custom-video-view-dialog.component';
import { RequestService, SubheaderService, LayoutUtilsService } from '../../../../shared/services';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';

@Component({
    selector: 'app-pages-page',
    templateUrl: './pages-page.component.html',
    styleUrls: ['./pages-page.component.scss']
})
export class PagesPageComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    public selectedUser: any;
    public loading: boolean = false;
    public tableSetting: any = undefined;
    public errorMessage: string = '';

    constructor( private requestService: RequestService, private router: Router,
		private activatedRoute: ActivatedRoute,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    public dialog: MatDialog) {}

    ngOnInit() {
  		this.subscriptions.push(
        this.requestService.currentUserSubject.subscribe((data) => {
          if (data) {
            this.selectedUser = data;
          }
        })
      );
      this.subheaderService.setTitle('Pages');
      this.subheaderService.setBreadcrumbs([
				{ title: 'Mobile App', page: undefined },
				{ title: 'Pages', page: undefined },
			]);
    }

    /**
  	 * On Destroy
  	 */
  	ngOnDestroy() {
  		this.subscriptions.forEach(el => el.unsubscribe());
  	}
}
