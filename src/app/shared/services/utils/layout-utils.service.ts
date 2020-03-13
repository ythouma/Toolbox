// Angular
import { Injectable } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
// Partials for CRUD
import { ActionNotificationComponent,
	DeleteEntityDialogComponent,
	FetchEntityDialogComponent,
	UpdateStatusDialogComponent,
	AlertEntityDialogComponent,
	AlertActionEntityDialogComponent,
	ErrorEntityDialogComponent
} from '../../../shared/components/modals';

export enum MessageType {
	Create,
	Read,
	Update,
	Delete
}

@Injectable()
export class LayoutUtilsService {
	/**
	 * Service constructor
	 *
	 * @param snackBar: MatSnackBar
	 * @param dialog: MatDialog
	 */
	constructor(private snackBar: MatSnackBar,
		private dialog: MatDialog) { }

	/**
	 * Showing (Mat-Snackbar) Notification
	 *
	 * @param message: string
	 * @param type: MessageType
	 * @param duration: number
	 * @param showCloseButton: boolean
	 * @param showUndoButton: boolean
	 * @param undoButtonDuration: number
	 * @param verticalPosition: 'top' | 'bottom' = 'top'
	 */
	showActionNotification(
		_message: string,
		_type: MessageType = MessageType.Create,
		_duration: number = 10000,
		_showCloseButton: boolean = true,
		_showUndoButton: boolean = false,
		_undoButtonDuration: number = 3000,
		_verticalPosition: 'top' | 'bottom' = 'bottom'
	) {
		const _data = {
			message: _message,
			snackBar: this.snackBar,
			showCloseButton: _showCloseButton,
			showUndoButton: _showUndoButton,
			undoButtonDuration: _undoButtonDuration,
			verticalPosition: _verticalPosition,
			type: _type,
			action: 'Undo'
		};
		return this.snackBar.openFromComponent(ActionNotificationComponent, {
			duration: _duration,
			data: _data,
			verticalPosition: _verticalPosition
		});
	}

	showNotification(message: string, action: string) {
		this.snackBar.open(message, action, {
			duration: 6000,
		});
	}

	/**
	 * Showing
	 *
	 * @param title: stirng
	 * @param description: stirng
	 */
	alertElement(title: string = '', description: string = '') {
		return this.dialog.open(AlertEntityDialogComponent, {
			data: { title, description },
			width: '440px'
		});
	}
	/**
	 * Showing
	 *
	 * @param title: stirng
	 * @param description: stirng
	 * @param alertSetting: any
	 */
	alertActionElement(title: string = '', description: string = '', alertSetting: any) {
		return this.dialog.open(AlertActionEntityDialogComponent, {
			data: { title, description, alertSetting },
			width: '600px',
			disableClose: alertSetting.overlayClickToClose
		});
	}
	/**
	 * Showing Confirmation (Mat-Dialog) before Entity Removing
	 *
	 * @param title: stirng
	 * @param description: stirng
	 * @param waitDesciption: string
	 */
	deleteElement(title: string = '', description: string = '', waitDesciption: string = '') {
		return this.dialog.open(DeleteEntityDialogComponent, {
			data: { title, description, waitDesciption },
			width: '440px'
		});
	}

	/**
	 * Showing Confirmation (Mat-Dialog) before Entity error
	 *
	 * @param title: stirng
	 * @param description: stirng
	 */
	errorElement(title: string = '', description: string = '') {
		return this.dialog.open(ErrorEntityDialogComponent, {
			data: { title, description },
			width: '440px'
		});
	}

	/**
	 * Showing Fetching Window(Mat-Dialog)
	 *
	 * @param _data: any
	 */
	fetchElements(_data) {
		return this.dialog.open(FetchEntityDialogComponent, {
			data: _data,
			width: '400px'
		});
	}

	/**
	 * Showing Update Status for Entites Window
	 *
	 * @param title: string
	 * @param statuses: string[]
	 * @param messages: string[]
	 */
	updateStatusForEntities(title, statuses, messages) {
		return this.dialog.open(UpdateStatusDialogComponent, {
			data: { title, statuses, messages },
			width: '480px'
		});
	}
}
