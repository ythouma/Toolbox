import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'confirmation-block',
    templateUrl: './confirmation-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './confirmation-block.component.scss']
})
export class ConfirmationBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() confirmationView = new EventEmitter<any>();
  widget_Buttons_map = ['dial', 'email'];
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(data) {
      this.block.data.text = data;
      this.confirmationView.emit({'action': 'confirmationView', block: this.block});
  }
}
