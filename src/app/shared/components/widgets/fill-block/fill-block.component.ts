import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'fill-block',
    templateUrl: './fill-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './fill-block.component.scss']
})
export class FillBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() fillView = new EventEmitter<any>();
  widget_Buttons_map = ['dial', 'email'];
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(data) {
      this.block.data.text = data;
      this.fillView.emit({'action': 'fillView', block: this.block});
  }
}
