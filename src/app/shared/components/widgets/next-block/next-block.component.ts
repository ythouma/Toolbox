import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'next-block',
    templateUrl: './next-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './next-block.component.scss']
})
export class NextBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() nextView = new EventEmitter<any>();
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(e: any) {
      e.preventDefault();
      this.nextView.emit({'action': 'nextView', block: this.block});
  }
}
