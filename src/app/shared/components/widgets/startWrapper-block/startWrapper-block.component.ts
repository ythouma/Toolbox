import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'startWrapper-block',
    templateUrl: './startWrapper-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './startWrapper-block.component.scss']
})
export class StartWrapperBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() startWrapperView = new EventEmitter<any>();
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(e: any) {
      e.preventDefault();
      this.startWrapperView.emit({'action': 'startWrapperView', block: this.block});
  }
}
