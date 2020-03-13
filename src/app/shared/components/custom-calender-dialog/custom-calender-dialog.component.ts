import { Component, Inject, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

interface ViewDialogData {
	title: string;
	data: any;
}

@Component({
	selector: 'app-calender-dialog-modal',
	templateUrl: './custom-calender-dialog.component.html',
  styleUrls: ['./custom-calender-dialog.component.scss']
})
export class ModalCalenderDialogComponent {
	public errorMessage: string = '';
  public loading: boolean = false;
  public hasFormErrors: boolean = false;
	public enddatetime: Date;
	public location: string = '';
	public subject: string = '';
	public remainder: string = '';
	public startdatetime: Date;

	constructor(private zone: NgZone,
		public dialogRef: MatDialogRef<ModalCalenderDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ViewDialogData) {
			// console.log('ModalGalleryDialogComponent', data);
	}
	closeModal(data): void {
		this.zone.run(() => {
		   this.dialogRef.close(data);
		});
  }
  confirmModal(): void {
		let startDate = '';
		let endDate = '';
		if(this.startdatetime){
			startDate = (new Date(this.startdatetime)).toUTCString();
		}
		if(this.enddatetime){
			endDate = (new Date(this.enddatetime)).toUTCString();
		}
		this.zone.run(() => {
		   this.dialogRef.close({subject: this.subject, enddatetime: endDate, location: this.location, remainder: this.remainder, startdatetime: startDate});
		});
  }
}
