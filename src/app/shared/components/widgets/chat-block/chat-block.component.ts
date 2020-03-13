import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'chat-block',
    templateUrl: './chat-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './chat-block.component.scss']
})
export class ChatBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() chatView = new EventEmitter<any>();
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(e: any) {
      e.preventDefault();
      this.chatView.emit({'action': 'chatView', block: this.block});
  }
}
