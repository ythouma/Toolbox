import { Component, Inject, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

interface ViewDialogData {
	title: string;
	data: any;
}

@Component({
	selector: 'app-tile-close-dialog-modal',
	templateUrl: './custom-tile-close-dialog.component.html',
  styleUrls: ['./custom-tile-close-dialog.component.scss']
})
export class ModalTileCloseDialogComponent {
	public errorMessage: string = '';
  public loading: boolean = false;
  public hasFormErrors: boolean = false;
	public dataVal: number = 0;
	public type: string = '';

	constructor(private zone: NgZone,
		public dialogRef: MatDialogRef<ModalTileCloseDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ViewDialogData) {
			// console.log('ModalGalleryDialogComponent', data);
	}
  closeModal(data): void {
		this.zone.run(() => {
		   this.dialogRef.close(data);
		});
  }
  confirmModal(): void {
		this.zone.run(() => {
		   this.dialogRef.close({type: this.type, sec: this.dataVal});
		});
  }
}
