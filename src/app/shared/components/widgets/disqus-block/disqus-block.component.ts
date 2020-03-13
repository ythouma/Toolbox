import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'disqus-block',
    templateUrl: './disqus-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './disqus-block.component.scss']
})
export class DisqusBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() disqusView = new EventEmitter<any>();
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(e: any) {
      // e.preventDefault();
      this.disqusView.emit({'action': 'disqusView', block: this.block});
  }
}
