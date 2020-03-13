import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'placefull-block',
    templateUrl: './placefull-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './placefull-block.component.scss']
})
export class PlacefullBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() placefullView = new EventEmitter<any>();
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(e: any) {
      e.preventDefault();
      this.placefullView.emit({'action': 'placefullView', block: this.block});
  }
}
