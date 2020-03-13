import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'drawTool-block',
    templateUrl: './drawTool-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './drawTool-block.component.scss']
})
export class DrawToolBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() drawToolView = new EventEmitter<any>();
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(e: any) {
      e.preventDefault();
      this.drawToolView.emit({'action': 'drawToolView', block: this.block});
  }
}
