import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'endWrapper-block',
    templateUrl: './endWrapper-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './endWrapper-block.component.scss']
})
export class EndWrapperBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() endWrapperView = new EventEmitter<any>();
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(e: any) {
      e.preventDefault();
      this.endWrapperView.emit({'action': 'endWrapperView', block: this.block});
  }
}
