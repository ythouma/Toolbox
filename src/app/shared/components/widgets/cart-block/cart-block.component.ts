import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'cart-block',
    templateUrl: './cart-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './cart-block.component.scss']
})
export class CartBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() cartView = new EventEmitter<any>();
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(e: any) {
      e.preventDefault();
      this.cartView.emit({'action': 'cartView', block: this.block});
  }
}
