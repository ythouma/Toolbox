// Angular
import { Component, Inject, OnInit, NgZone } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'kt-error-entity-dialog',
	templateUrl: './error-entity-dialog.component.html',
  styleUrls: ['../modal.scss']
})
export class ErrorEntityDialogComponent implements OnInit {
	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<DeleteEntityDialogComponent>
	 * @param data: any
	 */
	constructor(private zone: NgZone,
		public dialogRef: MatDialogRef<ErrorEntityDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

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
		this.zone.run(() => {
		   this.dialogRef.close();
		});
	}

	/**
	 * Close dialog with true result
	 */
	onYesClick(): void {
		this.zone.run(() => {
		   this.dialogRef.close(true);
		});
	}
}
