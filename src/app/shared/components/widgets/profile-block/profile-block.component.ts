import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'profile-block',
    templateUrl: './profile-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './profile-block.component.scss']
})
export class ProfileBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() profileView = new EventEmitter<any>();
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(e: any) {
      e.preventDefault();
      this.profileView.emit({'action': 'profileView', block: this.block});
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  };
}
