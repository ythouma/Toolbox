import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'exclusiveurl-block',
    templateUrl: './exclusiveurl-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './exclusiveurl-block.component.scss']
})
export class ExclusiveUrlBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() exclusiveUrlView = new EventEmitter<any>();
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(e: any) {
      e.preventDefault();
      this.exclusiveUrlView.emit({'action': 'exclusiveUrlView', block: this.block});
  }
  checkUrlPriority(opt: string) {
    if (opt === "window") {
      this.block.data.iphonewindow = this.block.data.window ? false : true;
    }

    if (opt === "iphonewindow") {
      this.block.data.window = this.block.data.iphonewindow ? false : true;
    }
  };
}
