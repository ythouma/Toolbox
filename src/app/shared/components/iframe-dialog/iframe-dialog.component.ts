import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { RequestService, LayoutUtilsService, LoaderService } from '../../../shared/services';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { urlSafeBase64Encoding } from '../../../shared/helpers';

interface ViewDialogData {
	title: string;
	data: any;
	confirmData: any;
}

@Component({
	selector: 'app-iframe-dialog-modal',
	templateUrl: './iframe-dialog.component.html',
  styleUrls: ['./iframe-dialog.component.scss']
})
export class ModalIframeDialogComponent implements OnInit {
	public errorMessage: string = '';
  public loading: boolean = false;
	public iframe_html: SafeResourceUrl;
	public iframeHeight: string = '100%';
	@ViewChild('iframeMain') iframeMain: ElementRef;
	constructor(
		private requestService: RequestService, private sanitizer: DomSanitizer,
    private layoutUtilsService: LayoutUtilsService, private loaderService: LoaderService,
		public dialogRef: MatDialogRef<ModalIframeDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ViewDialogData) {
			console.log('ViewDialogData', data);
			this.iframe_html = undefined;
	}

	ngOnInit() {
		this.loadData();
	}
	public loadData() {
		this.iframe_html = this.transform(this.data.data['url']);
		this.loading = true;
  }
	onload(ev: Event) {
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
  closeModal(data): void {
    this.dialogRef.close(data);
  }
}
