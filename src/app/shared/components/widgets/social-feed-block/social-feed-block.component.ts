import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';

@Component({
    selector: 'social-feed-block',
    templateUrl: './social-feed-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './social-feed-block.component.scss']
})
export class SocialFeedBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() feedView = new EventEmitter<any>();
  constructor(private loaderService: LoaderService) {}

  public onChange(e: any) {
      e.preventDefault();
      this.feedView.emit({'action': 'feedView', block: this.block});
  }
}
