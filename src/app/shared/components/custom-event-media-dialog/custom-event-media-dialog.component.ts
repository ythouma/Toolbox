import { Component, Inject, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

interface ViewDialogData {
	title: string;
	data: any;
}

@Component({
	selector: 'app-event-media-dialog-modal',
	templateUrl: './custom-event-media-dialog.component.html',
  styleUrls: ['./custom-event-media-dialog.component.scss']
})
export class ModalEventMediaDialogComponent {
	public errorMessage: string = '';
  public loading: boolean = false;
  public hasFormErrors: boolean = false;
	public type: string = 'picture';
	public rate: boolean = false;
	public bgcolor: string = '';
	public delete: boolean = false;
	public floatingbottom: boolean = false;
	public floatingiconsrc: string = '';
	public moderated: boolean = false;
	public name: boolean = false;
	public showvote: boolean = false;
	public sort: boolean = false;
	public uploadbutton: boolean = false;
	public views: boolean = false;
	public vote: boolean = false;
	public chat: boolean = false;
	public privatechat: boolean = false;


	constructor(private zone: NgZone,
		public dialogRef: MatDialogRef<ModalEventMediaDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ViewDialogData) {
			// console.log('ModalGalleryDialogComponent', data);
	}
  selectType(data): void {
		this.zone.run(() => {
			this.type = data;
			if(data === 'video'){
				this.rate = false;
			}else{
				this.chat = false;
				this.privatechat = false;
			}
		});
  }
  selectColor(data): void {
		console.log('selectColor');
		this.zone.run(() => {
			this.bgcolor = data;
		});
  }
  closeModal(data): void {
		this.zone.run(() => {
		   this.dialogRef.close(data);
		});
  }
  confirmModal(): void {
		this.zone.run(() => {
		   this.dialogRef.close({type: this.type, rate: this.rate, bgcolor: this.bgcolor, delete: this.delete, floatingbottom: this.floatingbottom, floatingiconsrc: this.floatingiconsrc, moderated: this.moderated, name: this.name, showvote: this.showvote, sort: this.sort, uploadbutton: this.uploadbutton, views: this.views, vote: this.vote, chat: this.chat, privatechat: this.privatechat});
		});
  }
}
