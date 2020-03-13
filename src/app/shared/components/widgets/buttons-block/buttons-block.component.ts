import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'buttons-block',
    templateUrl: './buttons-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './buttons-block.component.scss']
})
export class ButtonsBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() buttonsView = new EventEmitter<any>();
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(idx, data) {
      this.block.data[idx].confirmation = data;
      this.buttonsView.emit({'action': 'buttonsView', block: this.block});
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  };

  addButton(e: any) {
    var btnData = { "beforeText": "", "afterText": "" };
    this.block.data.push(btnData);
  };

  addConfirmation(btnData: any) {
    btnData["confirmation"] = new String("");
  };

  checkDisabled(btnData: any, opt: string) {
    var result = false;

    if (opt === "afterText") {
      result = btnData.hasOwnProperty("confirmation") ? true : false;
    } else if (opt === "confirm") {
      result = !this.utils.isNullOrEmpty(btnData["afterText"]) ? true : false;
    }

    return result
  };

  addAlert(e: any) {
    var alertsIndx = this.block.data.length;

    for (let i = 1; i <= alertsIndx; i++) {
      this.block.alerts.push("");
    }
  };
}
