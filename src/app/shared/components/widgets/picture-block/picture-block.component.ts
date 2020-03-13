import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';

@Component({
    selector: 'picture-block',
    templateUrl: './picture-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './picture-block.component.scss']
})
export class PictureBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() pictureView = new EventEmitter<any>();
  widget_Buttons_map = ['event_media'];
  constructor(private loaderService: LoaderService) {}
  public onChange(data ) {
      // const data = editor.getData();
      this.block.data.text = data;
      this.pictureView.emit({'action': 'pictureView', block: this.block});
  }
}
