// Angular
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'kt-alert-action-entity-dialog',
	templateUrl: './alert-action-entity-dialog.component.html'
})
export class AlertActionEntityDialogComponent implements OnInit {
	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<AlertEntityDialogComponent>
	 * @param data: any
	 */
	constructor(
		public dialogRef: MatDialogRef<AlertActionEntityDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		console.log('AlertActionEntityDialogComponent', data);
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
	}

	/**
	 * Close dialog with false result
	 */
	onNoClick(): void {
		this.dialogRef.close();
	}
	onYesClick(action, value): void {
			this.dialogRef.close({action, value});
	}
}
