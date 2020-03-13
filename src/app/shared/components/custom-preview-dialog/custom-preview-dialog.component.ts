import { Component, Inject, NgZone, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { environment } from '../../../../environments/environment';

interface ViewDialogData {
	title: string;
	data: any;
}

@Component({
	selector: 'app-preview-dialog-modal',
	templateUrl: './custom-preview-dialog.component.html',
  styleUrls: ['./custom-preview-dialog.component.scss']
})
export class ModalPreviewDialogComponent {
	public errorMessage: string = '';
  public loading: boolean = false;
  public hasFormErrors: boolean = false;
  public isTab: boolean = false;

	public iframe_html: SafeResourceUrl;
	public iframeHeight: string = '100%';
	el: HTMLFrameElement;
	@ViewChild('iframeMain') iframeMain: ElementRef;

	constructor(private zone: NgZone,
		private sanitizer: DomSanitizer,
		public dialogRef: MatDialogRef<ModalPreviewDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ViewDialogData) {
			// console.log('ModalGalleryDialogComponent', data);
	}
	ngOnInit() {
		this.iframe_html = this.transform(environment.serverMainUrl + this.data.data);
	}
  closeModal(data): void {
		   this.dialogRef.close(data);
  }
	onload(ev: Event) {
		// this.el = <HTMLFrameElement>ev.srcElement;
		this.resizeIframe();
		this.loading = false;
	}
	public pageY(elem) {
			return elem.offsetParent ? (elem.offsetTop + this.pageY(elem.offsetParent)) : elem.offsetTop;
	}
	public resizeIframe() {
			let height = document.documentElement.clientHeight;
			height -= this.pageY(this.iframeMain.nativeElement) + 20 ;
			height = (height < 0) ? 0 : height;
			this.iframeHeight = height + 'px';
			if (height < 400){
				this.iframeHeight = '400px';
			}
	}
	transform(url) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}
}
