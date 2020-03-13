import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'contactus-block',
    templateUrl: './contactus-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './contactus-block.component.scss']
})
export class ContactUsBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() contactusView = new EventEmitter<any>();
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(e: any) {
      e.preventDefault();
      this.contactusView.emit({'action': 'contactusView', block: this.block});
  }
}
