import { Component, Inject, OnInit, ChangeDetectorRef, ElementRef, ViewChild, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { fromEvent, BehaviorSubject, merge, Subscription } from 'rxjs';
import { RequestService, LayoutUtilsService, LoaderService } from '../../../shared/services';
import { urlSafeBase64Encoding } from '../../../shared/helpers';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
interface ViewDialogData {
	title: string;
	data: any;
}

@Component({
	selector: 'app-videos-dialog-modal',
	templateUrl: './custom-videos-dialog.component.html',
  styleUrls: ['./custom-videos-dialog.component.scss']
})
export class ModalVideosDialogComponent implements OnInit {
  private subscriptions: Subscription[] = [];
	public errorMessage: string = '';
  public loading: boolean = false;
  public hasFormErrors: boolean = false;
  public dataType: string = 'video';
  public dataTypeDisplay: string = 'Video';
  public dataList: any[] = [];
	public searchVal: string = '';
	public vimeoUrl: string = environment.vimeoUrl;

	public paginatorTotal: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	pageSize = 10;
	pageNumber = 1;

	orderDir = 'asc';
	orderBy = '_id'; // uid

	// @ViewChild('searchInput') searchInput: ElementRef;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	constructor(private zone: NgZone,
		private requestService: RequestService,
		private changeDetectorRefs: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private layoutUtilsService: LayoutUtilsService,
		public dialogRef: MatDialogRef<ModalVideosDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ViewDialogData) {
			// console.log('ModalGalleryDialogComponent', data);
	}

	ngOnInit() {
		// const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
		// 	debounceTime(150),
		// 	distinctUntilChanged(),
		// 	tap(() => {
		// 		this.paginatorTotal.next(0);
		// 		this.loadData();
		// 	})
		// )
		// .subscribe();
		// this.subscriptions.push(searchSubscription);
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
			let termConfiguration = '';
			let filterData = {organizationId: this.requestService.orgId.getValue()};
			let filterObj = { perpage: this.pageSize, page: this.pageNumber, orderBy:this.orderBy, orderDir: this.orderDir, term:termConfiguration, filter: filterData};
			//, fieldKeys:["title", "art", "isWeight", "Procedure", "hsrRuleEngine", "smart", "notification"] // try decrease fields names
      this.requestService.getDataList(this.dataType, filterObj, (data, error) => {
        if (error) {
          this.errorMessage = error;
          this.layoutUtilsService.showNotification('Error:' + error, 'Dismiss');
        }
        if (data) {
					this.zone.run(() => {
						let dataList = [];
						for(let dt of data.results){
							let vidUrlArray: string[] = [''];
							if(dt.hasOwnProperty('vimeoId')){
								let vidUrl = dt.vimeoId;
								vidUrlArray = vidUrl.split(":");
								dt['secureUrl'] = this.transform(this.vimeoUrl + vidUrlArray[0]);
							}else if (dt.hasOwnProperty('complete_uri')){
								vidUrlArray[0] = dt.complete_uri;
								dt['secureUrl'] = this.transform(vidUrlArray[0]);
							}else{
								dt['secureUrl'] = this.transform(this.vimeoUrl + vidUrlArray[0]);
							}
							dataList.push(dt);

						}
	          this.dataList = data.results;
					});
        }
				this.paginatorTotal.next(data.pagination.total);
        this.loading = false;
      });
    }
  }
	// termConfiguration(): any {
	// 	const searchText: string = this.searchInput.nativeElement.value;
	// 	return searchText;
	// }
  closeModal(data): void {
		this.zone.run(() => {
		   this.dialogRef.close(data);
		});
  }
	transform(url) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}
	public delete(e, id: any, vimeoId: string) {
		if(e){
			e.stopImmediatePropagation();
			e.preventDefault();
	  	// e.stopPropagation();
		}
		if (!this.loading) {
			const _title: string = this.dataTypeDisplay + ' Delete';
			const _description: string = 'Are you sure to permanently delete this ' + this.dataTypeDisplay + '?';
			const _waitDesciption: string = 'Deleting...';

			const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
			dialogRef.afterClosed().subscribe(res => {
				if (!res) {
					return;
				}
				this.realDelete(id, vimeoId);
			});
		}
	}
	public realDelete(id: any, vimeoId: string) {
		const _deleteMessage = this.dataTypeDisplay + ` has been deleted`;
		this.layoutUtilsService.showNotification(_deleteMessage, 'Dismiss');
		if (!this.loading) {
			this.loading = true;
			this.errorMessage = '';
			this.requestService.deleteSingleData(this.dataType, id + '/' + vimeoId, (data, error) => {
				if (error) {
					this.errorMessage = error;
					this.layoutUtilsService.showNotification('Error:' + error, 'Dismiss');
				}
				this.loading = false;
				if (data) {
					this.layoutUtilsService.showNotification(_deleteMessage, 'Dismiss');
					this.pageNumber = 1;
					this.loadData();
				}
			});
		}
	}
}
