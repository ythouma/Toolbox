import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'add-space-block',
    templateUrl: './add-space-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './add-space-block.component.scss']
})
export class AddSpaceComponent implements BlockComponent {
  @Input() block: any;
  @Output() addSpaceView = new EventEmitter<any>();
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(e: any) {
      e.preventDefault();
      this.addSpaceView.emit({'action': 'addSpaceView', block: this.block});
  }
  deleteBlankView(e: any, opt: string) {
    e.preventDefault();
    var blk = { "opt": opt };
    this.addSpaceView.emit({'action': 'deleteBlankView', block: blk});
  }
}
