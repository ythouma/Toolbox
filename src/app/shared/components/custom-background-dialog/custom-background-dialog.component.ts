import { Component, Inject, OnInit, ChangeDetectorRef, ElementRef, ViewChild, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, BehaviorSubject, merge, Subscription } from 'rxjs';
import { RequestService, LayoutUtilsService, LoaderService } from '../../../shared/services';
import { urlSafeBase64Encoding } from '../../../shared/helpers';

interface ViewDialogData {
	title: string;
	data: any;
}

@Component({
	selector: 'app-background-dialog-modal',
	templateUrl: './custom-background-dialog.component.html',
  styleUrls: ['./custom-background-dialog.component.scss']
})
export class ModalBackgroundDialogComponent implements OnInit {
  private subscriptions: Subscription[] = [];
	public errorMessage: string = '';
  public loading: boolean = false;
  public hasFormErrors: boolean = false;
  public dataType: string = 'tile';
  public dataList: any[] = [];
	public searchVal: string = '';
	public tileBackgroundPortrait: string = undefined;
	public tileBackgroundLandscape: string = undefined;
	public tileId: string = undefined;
  public allowedExtensions: string[] = ['jpeg', 'jpg', 'bmp', 'png'];

	public paginatorTotal: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	pageSize = 10;
	pageNumber = 1;

	orderDir = 'asc';
	orderBy = '_id'; // uid

	constructor(private zone: NgZone,
		private requestService: RequestService,
    private layoutUtilsService: LayoutUtilsService,
		private cdr: ChangeDetectorRef,
		public dialogRef: MatDialogRef<ModalBackgroundDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ViewDialogData) {
			// console.log('ModalGalleryDialogComponent', data);
	}

	ngOnInit() {
		// this.loadData();
		this.tileBackgroundPortrait = this.data.data.tileBackgroundPortrait;
		this.tileBackgroundLandscape = this.data.data.tileBackgroundLandscape;
		this.tileId = this.data.data._id;
	}
	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}
  closeModal(data): void {
		 this.dialogRef.close(data);
  }
  imageDelete(type, imageUrl): void {
		this.realDelete(type, imageUrl);
  }
	public realDelete(type: any, imageUrl: string) {
		const _deleteMessage = `Image has been deleted`;
		if (!this.loading) {
			this.loading = true;
			this.errorMessage = '';
			this.requestService.deleteBackgroundImageData(type, this.tileId, imageUrl, (data, error) => {
				if (error) {
					this.errorMessage = error;
					this.layoutUtilsService.showNotification('Error:' + error, 'Dismiss');
				}
				if (data) {
						if(type === 'portrait'){
							this.tileBackgroundPortrait = undefined;
						}else if (type === 'landscape'){
							this.tileBackgroundLandscape = undefined;
						}
						this.closeModal({tileBackgroundPortrait: this.tileBackgroundPortrait, tileBackgroundLandscape: this.tileBackgroundLandscape});
						this.layoutUtilsService.showNotification('Image Deleted', 'Dismiss');
				}
				this.loading = false;
			});
		}
	}
  onBrowseFiles(target: any, type: string): void {
      this.readFiles(target.files, type);
  }
  /**
   *  @param files: list of browsed files
   *  @param index: iterator over browsed images
   *
   *  read files browsed by user
   */
  readFiles(files, type, index = 0 ): void {
    // let reader = new FileReader();
      if (index in files) {
        let currentFile = {error: false, text: files[index].name, id: files[index].id, originalFile: files[index], source_url: null};
        let fileExt = files[index].name.split('.').pop();
        if (this.allowedExtensions.indexOf(fileExt) === -1) {
          currentFile.error = true;
        } else {
          this.requestService.onUploadBackgroundFiles( this.tileId, type,currentFile)
          .subscribe(
                  (results: any) => {
                    console.log('results', results);
                    if (results['status']) {
                      currentFile.source_url = results;
											if(type === 'portrait'){
												this.tileBackgroundPortrait = results.results.imageUrl;
											}else if (type === 'landscape'){
												this.tileBackgroundLandscape = results.results.imageUrl;
											}
											this.closeModal({tileBackgroundPortrait: this.tileBackgroundPortrait, tileBackgroundLandscape: this.tileBackgroundLandscape});
											this.layoutUtilsService.showNotification( 'Background image uploaded!', 'Dismiss');
                    }else {
                      currentFile.error = true;
											this.layoutUtilsService.showNotification('Error:' + results['message'], 'Dismiss');
                    }
										// this.myInputVariable.nativeElement.value = "";
										this.cdr.detectChanges();
                    // this.currentFile = currentFile;
                  },
                  error => {
                    console.log('Error uploading file.', error);
                    currentFile.error = true;
                    // this.currentFile = currentFile;
										this.layoutUtilsService.showNotification('Error: Error uploading file.' , 'Dismiss');
										// this.myInputVariable.nativeElement.value = "";
										this.cdr.detectChanges();
                    // this.loaderService.display(false);
                  }
          );
        }
      } else {
        this.cdr.detectChanges();
      }
  }
}
