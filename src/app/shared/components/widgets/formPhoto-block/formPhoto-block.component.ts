import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'formPhoto-block',
    templateUrl: './formPhoto-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './formPhoto-block.component.scss']
})
export class FormPhotoComponent implements BlockComponent {
  @Input() block: any;
  @Output() formPhotoView = new EventEmitter<any>();
  widget_Buttons_map = ['form_media'];
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(data) {
      this.block.data.text = data;
      this.formPhotoView.emit({'action': 'formPhotoView', block: this.block});
  }
}
