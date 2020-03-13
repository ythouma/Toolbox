import { Component, Inject, OnInit, ChangeDetectorRef, ElementRef, ViewChild, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { fromEvent, BehaviorSubject, merge, Subscription, Observable, Observer } from 'rxjs';
import { RequestService, LayoutUtilsService, LoaderService } from '../../../shared/services';
import { urlSafeBase64Encoding } from '../../../shared/helpers';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

interface ViewDialogData {
	title: string;
	data: any;
}

@Component({
	selector: 'app-gallery-dialog-modal',
	templateUrl: './custom-gallery-dialog.component.html',
  styleUrls: ['./custom-gallery-dialog.component.scss']
})
export class ModalGalleryDialogComponent implements OnInit {
  private subscriptions: Subscription[] = [];
	public errorMessage: string = '';
  public loading: boolean = false;
  public hasFormErrors: boolean = false;
  public dataType: string = 'img';
  public dataTypeFolder: string = 'folder';
  public dataTypeDisplay: string = 'Image';
  public dataTypeDisplayFolder: string = 'Folder';
  public dataList: any[] = [];
  public dataListFolder: any[] = [];
	public imageSelected: any = undefined;
	public imageUrlPath: any = undefined;
	public selectedRatio: number = 0;
	public folderSelected: string = '';
	public tabSelected: number = 0;
	public searchVal: string = '';
  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  public allowedExtensions: string[] = ['jpeg', 'jpg', 'bmp', 'png'];

	public paginatorTotal: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	pageSize = 10;
	pageNumber = 1;

	orderDir = 'asc';
	orderBy = '_id'; // uid

	// @ViewChild('searchInput') searchInput: ElementRef;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;
	constructor(private zone: NgZone,
		private requestService: RequestService,
		private cdr: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
		public dialogRef: MatDialogRef<ModalGalleryDialogComponent>,
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
		// this.loadData();
		this.loadFolderData();
	}
	public getTableVariables() {
		// this.orderBy = this.sort.active || 'uid';
		// this.orderDir = this.sort.direction || 'asc';
		this.pageNumber = this.paginator.pageIndex + 1;
		this.pageSize = this.paginator.pageSize;
	}
	public rationChanged(event){
		this.selectedRatio = Number(event.value);
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
			let filter = undefined;
			if(this.folderSelected){
				filter = { 'folder': this.folderSelected};
			}
			let filterObj = { perpage: this.pageSize, page: this.pageNumber, orderBy:this.orderBy, orderDir: this.orderDir, term:termConfiguration, filter: filter};
			//, fieldKeys:["title", "art", "isWeight", "Procedure", "hsrRuleEngine", "smart", "notification"] // try decrease fields names
      this.requestService.getDataListByListByOrg(this.dataType, filterObj, (data, error) => {
        if (error) {
          this.errorMessage = error;
          this.layoutUtilsService.showNotification('Error:' + error, 'Dismiss');
        }
        if (data) {
					console.log('dataList', data);
          this.dataList = data.results;
        }
				this.paginatorTotal.next(data.pagination.total);
        this.loading = false;
      });
    }
  }
	public delete(e, id: any) {
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
				this.realDelete(id);
			});
		}
	}
	public realDelete(id: any) {
		const _deleteMessage = this.dataTypeDisplay + ` has been deleted`;
		this.layoutUtilsService.showNotification(_deleteMessage, 'Dismiss');
		if (!this.loading) {
			this.loading = true;
			this.errorMessage = '';
			this.requestService.deleteImageDataByOrg(this.dataType, id, (data, error) => {
				if (error) {
					this.errorMessage = error;
					this.layoutUtilsService.showNotification('Error:' + error, 'Dismiss');
				}
				this.loading = false;
				if (data) {
					this.layoutUtilsService.showNotification(_deleteMessage, 'Dismiss');
					this.imageSelected = undefined;
					this.imageUrlPath = undefined;
					this.pageNumber = 1;
					this.loadData();
				}
			});
		}
	}
	public setFolderSelected(val) {
    this.folderSelected = val;
		this.loadData();
  }
	public setImageSelected(val) {
    this.imageSelected = val;
		this.getBase64ImageFromURL(val.url).subscribe(base64data => {
		   // this is the image as dataUrl
		   this.imageUrlPath = 'data:image/jpg;base64,' + base64data;
		 });
		// this.getBase64Image(val.url, (blobData)=> {
		// 	this.imageUrlPath = blobData;
		// })
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
	onBrowseFiles(target: any): void {
      this.readFiles(target.files);
  }
  /**
   *  @param files: list of browsed files
   *  @param index: iterator over browsed images
   *
   *  read files browsed by user
   */
  readFiles(files, index = 0 ): void {
    // let reader = new FileReader();
      if (index in files) {
        let currentFile = {error: false, text: files[index].name, id: files[index].id, originalFile: files[index], source_url: null};
        let fileExt = files[index].name.split('.').pop();
        if (this.allowedExtensions.indexOf(fileExt) === -1) {
          currentFile.error = true;
        } else {
          this.requestService.onUploadFiles(currentFile, this.folderSelected, 'tileart')
          .subscribe(
                  (results: any) => {
                    console.log('results', results);
                    if (results['status']) {
                      currentFile.source_url = results;
											this.pageNumber = 1;
											this.loadData();
											this.layoutUtilsService.showNotification(results['message'], 'Dismiss');
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
	public loadFolderData() {
		if (!this.loading) {
			this.loading = true;
	    this.requestService.getDataListByOrgByGet(this.dataTypeFolder, (data, error) => {
	      if (error) {
	        console.log(error);
					this.loading = false;
	      }
	      if (data) {
					console.log('dataListFolder', data);
	        this.dataListFolder = data.results;
					this.loading = false;
					this.loadData();
	      }
	    });
		}
  }
	public createNewFolder() {
		// console.log('folderSelected', this.folderSelected);
		if(!this.dataListFolder.includes(this.folderSelected) && this.folderSelected !== ''){
			if (!this.loading) {
				this.loading = true;
				this.errorMessage = '';
				let objData = {
				  organizationId: this.requestService.orgId.getValue(),
				  name: this.folderSelected
				};
				this.requestService.saveData(this.dataTypeFolder, objData, (data, error) => {
					if (error) {
						this.errorMessage = error;
						this.layoutUtilsService.showNotification('Error:' + error, 'Dismiss');
					}
					this.loading = false;
					if (data) {
						this.loadData();
					}
				});
			}
		}
  }
	// fileChangeEvent(event: any): void {
  //     this.imageChangedEvent = event;
  // }
  cropIt() {
			let croppedImage = this.imageCropper.crop();
		  // console.log('CropIt', this.imageCropper.crop());
			if (!this.loading && this.imageSelected && croppedImage) {
				this.loading = true;
				this.errorMessage = '';
				let objData = {
				  src: this.imageSelected.url,
				  x: croppedImage.cropperPosition.x1 + '',
				  y: croppedImage.cropperPosition.y1 + '',
				  w: croppedImage.width + '',
				  h: croppedImage.height + '',
				  folder: this.folderSelected,
				  uploadedImage: true
				};
				this.requestService.cropImageByOrg(objData, (data, error) => {
					if (error) {
						this.errorMessage = error;
						this.layoutUtilsService.showNotification('Error:' + error, 'Dismiss');
					}
					this.loading = false;
					if (data) {
						this.closeModal(data.results.imageUrl);
					}
				});
			}

  }
  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
  }
  imageHasLoaded(e) {
      console.log('imageHasLoaded', e);
  }
  imageLoaded() {
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }
	// public getBase64Image(imgUrl, callback) {
	//
	//     var img = new Image();
	//
	//     // onload fires when the image is fully loadded, and has width and height
	//
	//     img.onload = function(){
	//
	//       var canvas = document.createElement("canvas");
	//       canvas.width = img.width;
	//       canvas.height = img.height;
	//       var ctx = canvas.getContext("2d");
	//       ctx.drawImage(img, 0, 0);
	//       var dataURL = canvas.toDataURL("image/png"),
	//           dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
	//
	//       callback(dataURL); // the base64 string
	//
	//     };
	//
	//     // set attributes and src
	//     img.setAttribute('crossOrigin', 'anonymous'); //
	//     img.src = imgUrl;
	//
	// }

	getBase64ImageFromURL(url: string) {
   return Observable.create((observer: Observer<string>) => {
	     // create an image object
	     let img = new Image();
	     img.crossOrigin = 'Anonymous';
	     img.src = url;
	     if (!img.complete) {
	         // This will call another method that will create image from url
	         img.onload = () => {
	         observer.next(this.getBase64Image(img));
	         observer.complete();
	       };
	       img.onerror = (err) => {
	          observer.error(err);
	       };
	     } else {
	         observer.next(this.getBase64Image(img));
	         observer.complete();
	     }
	   });
	}
	getBase64Image(img: HTMLImageElement) {
	   // We create a HTML canvas object that will create a 2d image
	   var canvas = document.createElement("canvas");
	   canvas.width = img.width;
	   canvas.height = img.height;
	   var ctx = canvas.getContext("2d");
	   // This will draw image
	   ctx.drawImage(img, 0, 0);
	   // Convert the drawn image to Data URL
	   var dataURL = canvas.toDataURL("image/png");
		 return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
	}
}
