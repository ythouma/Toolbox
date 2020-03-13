import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'blanksForm-block',
    templateUrl: './blanksForm-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './blanksForm-block.component.scss']
})
export class BlanksFormBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() blanksFormView = new EventEmitter<any>();
  widget_Buttons_map = ['tile_open','tile_close', 'dial', 'email'];
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(data) {
      this.block.data.text = data;
      this.blanksFormView.emit({'action': 'blanksFormView', block: this.block});
  }
}
