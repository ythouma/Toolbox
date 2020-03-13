import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { RequestService, LayoutUtilsService, LoaderService } from '../../../shared/services';
import { urlSafeBase64Encoding } from '../../../shared/helpers';

export interface ViewDialogData {
	dataType: string;
	title: string;
	data: any;
	modalSetting: any;
	confirmData: any;
}

@Component({
	selector: 'app-view-dialog-modal',
	templateUrl: './custom-view-dialog.component.html',
  styleUrls: ['./custom-view-dialog.component.scss']
})
export class ModalViewDialogComponent implements OnInit {
	public errorMessage: string = '';
  public loading: boolean = false;
  public hasFormErrors: boolean = false;
	constructor(
		private requestService: RequestService,
    private layoutUtilsService: LayoutUtilsService,
		public dialogRef: MatDialogRef<ModalViewDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ViewDialogData) {
			console.log('ViewDialogData', data);
	}

	ngOnInit() {
		this.buildSetting();
	}
	private buildSetting() {
		if (!this.loading) {
			this.loading = true;
			this.errorMessage = '';
			this.requestService.getMetaData(this.data.dataType, undefined, (data, error) => {
				if (error) {
					this.errorMessage = error;
					this.layoutUtilsService.showNotification('Error:' + error, 'Dismiss');
				}
				this.loading = false;
				if (data) {
					this.data.modalSetting = data.results;
					if(this.data.data.hasOwnProperty('_id')){
						this.loadData();
					}
				} else {
					this.layoutUtilsService.showNotification('Something is Wrong', 'Dismiss');
				}
			});
		}
	}
	public loadData() {
    if (!this.loading) {
      this.loading = true;
      this.errorMessage = '';
      this.requestService.getSingleData(this.data.dataType, this.data.data['_id'], (data, error) => {
        if (error) {
          this.errorMessage = error;
          this.layoutUtilsService.showNotification('Error:' + error, 'Dismiss');
        }
        if (data) {
          this.data.data = data.results;
        }
        this.loading = false;
      });
    }
  }
  closeModal(data): void {
    this.dialogRef.close(data);
  }
}
