import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'blogs-block',
    templateUrl: './blogs-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './blogs-block.component.scss']
})
export class BlogsBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() blogsView = new EventEmitter<any>();
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(data) {
      this.block.data.wordPressContent = data;
      this.blogsView.emit({'action': 'blogsView', block: this.block});
  }

  openWordPress(e: any) {
  };
}
