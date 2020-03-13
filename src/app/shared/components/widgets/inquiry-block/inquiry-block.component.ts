import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'inquiry-block',
    templateUrl: './inquiry-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './inquiry-block.component.scss']
})
export class InquiryBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() inquiryView = new EventEmitter<any>();
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(e: any) {
      e.preventDefault();
      this.inquiryView.emit({'action': 'inquiryView', block: this.block});
  }
}
