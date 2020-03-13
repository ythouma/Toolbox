import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'share-block',
    templateUrl: './share-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './share-block.component.scss']
})
export class ShareBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() shareView = new EventEmitter<any>();
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(e: any) {
      // e.preventDefault();
      this.shareView.emit({'action': 'shareView', block: this.block});
  }
  imageLibrary(e: any, target: string) {
    e.preventDefault();

    var blk = { "target": target };
    this.shareView.emit({'action': 'imageLibrary', block: blk});
  };

  videoLibrary(e: any, target: string) {
    e.preventDefault();

    var blk = { "target": target }
    this.shareView.emit({'action': 'videoLibrary', block: blk});
  };
}
