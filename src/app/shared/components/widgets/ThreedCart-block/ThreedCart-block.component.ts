import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'ThreedCart-block',
    templateUrl: './ThreedCart-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './ThreedCart-block.component.scss']
})
export class ThreedCartBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() threedCartView = new EventEmitter<any>();
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(e: any) {
      e.preventDefault();
      this.threedCartView.emit({'action': 'threedCartView', block: this.block});
  }
  checkThreedCartPriority(opt: string) {
    if (opt === "window") {
      this.block.data.iphonewindow = this.block.data.window ? false : true;
    }

    if (opt === "iphonewindow") {
      this.block.data.window = this.block.data.iphonewindow ? false : true;
    }
  };
}
