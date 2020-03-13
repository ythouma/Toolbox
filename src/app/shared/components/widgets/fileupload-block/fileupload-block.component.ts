import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'fileupload-block',
    templateUrl: './fileupload-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './fileupload-block.component.scss']
})
export class FileUploadBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() fileUploadView = new EventEmitter<any>();
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(e: any) {
      e.preventDefault();
      this.fileUploadView.emit({'action': 'fileUploadView', block: this.block});
  }
}
