import {Component, Inject} from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material';

@Component({
  selector: 'your-snack-bar',
  templateUrl: './snack-bar.component.html',
  styles: [`
      .example-pizza-party { color: hotpink; float:left;}
      .dismiss{
        float:right;
        cursor: pointer;
      }
    `]
})
export class SnackBarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
  private _snackRef: MatSnackBarRef<SnackBarComponent>) { }

  dismiss(){
    this._snackRef.dismiss();
  }
}
