import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'pushpay-block',
    templateUrl: './pushpay-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './pushpay-block.component.scss']
})
export class PushpayBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() pushPayView = new EventEmitter<any>();
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(e: any) {
      e.preventDefault();
      this.pushPayView.emit({'action': 'pushPayView', block: this.block});
  }
  checkPushPayPriority(opt: string) {
    if (opt === "window") {
      this.block.data.iphonewindow = this.block.data.window ? false : true;
    }

    if (opt === "iphonewindow") {
      this.block.data.window = this.block.data.iphonewindow ? false : true;
    }
  };
}
