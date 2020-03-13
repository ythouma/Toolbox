import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';

@Component({
    selector: 'text-block',
    templateUrl: './text-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './text-block.component.scss']
})
export class TextBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() textView = new EventEmitter<any>();
  widget_Buttons_map = ['tile_open', 'tile_close', 'dial', 'email'];
  constructor(private loaderService: LoaderService) {

  }
  public onChange( data ) {
      // const data = editor.getData();
      this.block.data.text = data;
      this.textView.emit({'action': 'textView', block: this.block});
  }
}
