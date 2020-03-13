import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'addtocart-block',
    templateUrl: './addtocart-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './addtocart-block.component.scss']
})
export class AddToCartBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() addToCartView = new EventEmitter<any>();
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(e: any) {
      e.preventDefault();
      this.addToCartView.emit({'action': 'addToCartView', block: this.block});
  }
}
