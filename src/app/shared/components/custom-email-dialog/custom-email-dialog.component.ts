import { Component, Inject, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

interface ViewDialogData {
	title: string;
	data: any;
}

@Component({
	selector: 'app-email-dialog-modal',
	templateUrl: './custom-email-dialog.component.html',
  styleUrls: ['./custom-email-dialog.component.scss']
})
export class ModalEmailDialogComponent {
	public errorMessage: string = '';
  public loading: boolean = false;
  public hasFormErrors: boolean = false;
	public dataVal: string = '';

	constructor(private zone: NgZone,
		public dialogRef: MatDialogRef<ModalEmailDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ViewDialogData) {
			// console.log('ModalGalleryDialogComponent', data);
	}
  closeModal(data): void {
		this.zone.run(() => {
		   this.dialogRef.close(data);
		});
  }
}
