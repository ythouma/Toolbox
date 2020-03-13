import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'formDocument-block',
    templateUrl: './formDocument-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './formDocument-block.component.scss']
})
export class FormDocumentComponent implements BlockComponent {
  @Input() block: any;
  @Output() formDocumentView = new EventEmitter<any>();
  widget_Buttons_map = ['event_document'];
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(data) {
      this.block.data.text = data;
      this.formDocumentView.emit({'action': 'formDocumentView', block: this.block});
  }
}
