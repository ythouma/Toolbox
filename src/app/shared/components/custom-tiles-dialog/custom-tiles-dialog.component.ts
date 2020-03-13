import { Component, Inject, OnInit, ChangeDetectorRef, ElementRef, ViewChild, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { fromEvent, BehaviorSubject, merge, Subscription } from 'rxjs';
import { RequestService, LayoutUtilsService, LoaderService } from '../../../shared/services';
import { urlSafeBase64Encoding } from '../../../shared/helpers';

interface ViewDialogData {
	title: string;
	data: any;
}

@Component({
	selector: 'app-tiles-dialog-modal',
	templateUrl: './custom-tiles-dialog.component.html',
  styleUrls: ['./custom-tiles-dialog.component.scss']
})
export class ModalTilesDialogComponent implements OnInit {
  private subscriptions: Subscription[] = [];
	public errorMessage: string = '';
  public loading: boolean = false;
  public hasFormErrors: boolean = false;
  public dataType: string = 'tile';
  public dataList: any[] = [];
	public searchVal: string = '';

	public paginatorTotal: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	pageSize = 10;
	pageNumber = 1;

	orderDir = 'asc';
	orderBy = '_id'; // uid

	@ViewChild('searchInput') searchInput: ElementRef;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	constructor(private zone: NgZone,
		private requestService: RequestService,
		private changeDetectorRefs: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
		public dialogRef: MatDialogRef<ModalTilesDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ViewDialogData) {
			// console.log('ModalGalleryDialogComponent', data);
	}

	ngOnInit() {
		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			debounceTime(150),
			distinctUntilChanged(),
			tap(() => {
				this.paginatorTotal.next(0);
				this.loadData();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);
		const paginatorSubscriptions = merge(this.paginator.page).pipe(
			tap(() => {
				this.getTableVariables();
				this.loadData();
			})
		)
		.subscribe();
		this.subscriptions.push(paginatorSubscriptions);
		this.loadData();
	}
	public getTableVariables() {
		// this.orderBy = this.sort.active || 'uid';
		// this.orderDir = this.sort.direction || 'asc';
		this.pageNumber = this.paginator.pageIndex + 1;
		this.pageSize = this.paginator.pageSize;
	}
	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}
	public loadData() {
    if (!this.loading) {
      this.loading = true;
      this.errorMessage = '';
			let termConfiguration = this.termConfiguration();
			let filterData = {organizationId: this.requestService.orgId.getValue()};
			let filterObj = { perpage: this.pageSize, page: this.pageNumber, orderBy:this.orderBy, orderDir: this.orderDir, term:termConfiguration, termfields: ['title'] , filter: filterData};
			//, fieldKeys:["title", "art", "isWeight", "Procedure", "hsrRuleEngine", "smart", "notification"] // try decrease fields names
      this.requestService.getDataList(this.dataType, filterObj, (data, error) => {
        if (error) {
          this.errorMessage = error;
          this.layoutUtilsService.showNotification('Error:' + error, 'Dismiss');
        }
        if (data) {
					console.log('dataList', data);
					this.zone.run(() => {
	          this.dataList = data.results;
					});
        }
				this.paginatorTotal.next(data.pagination.total);
        this.loading = false;
      });
    }
  }
	termConfiguration(): any {
		const searchText: string = this.searchInput.nativeElement.value;
		return searchText;
	}
  closeModal(data): void {
		this.zone.run(() => {
		   this.dialogRef.close(data);
		});
  }
}
