import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'password-block',
    templateUrl: './password-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './password-block.component.scss']
})
export class PasswordBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() passwordView = new EventEmitter<any>();
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(e: any) {
      e.preventDefault();
      this.passwordView.emit({'action': 'passwordView', block: this.block});
  }
}
