import { Component, Inject, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { LayoutUtilsService } from '../../../shared/services';

interface ViewDialogData {
	title: string;
	data: any;
}

@Component({
	selector: 'app-form-media-dialog-modal',
	templateUrl: './custom-form-media-dialog.component.html',
  styleUrls: ['./custom-form-media-dialog.component.scss']
})
export class ModalFormMediaDialogComponent {
	public errorMessage: string = '';
  public loading: boolean = false;
  public hasFormErrors: boolean = false;
	public dataVal: number = 0;
	public type: string = '';
	public mediaName: boolean = false;
	public deleteIcon: boolean = false;

	constructor(private zone: NgZone,
		private layoutUtilsService: LayoutUtilsService,
		public dialogRef: MatDialogRef<ModalFormMediaDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ViewDialogData) {
			// console.log('ModalGalleryDialogComponent', data);
	}
  closeModal(data): void {
		this.zone.run(() => {
		   this.dialogRef.close(data);
		});
  }
  confirmModal(): void {
		if(this.type !== ''){
			this.zone.run(() => {
			   this.dialogRef.close({type: this.type, mediaName: this.mediaName, deleteIcon: this.deleteIcon});
			});
		}else{
			this.layoutUtilsService.showNotification('Error:Please select media type', 'Dismiss');
		}
  }
}
