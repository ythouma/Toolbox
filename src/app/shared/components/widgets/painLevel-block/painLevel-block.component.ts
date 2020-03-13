import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'painLevel-block',
    templateUrl: './painLevel-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './painLevel-block.component.scss']
})
export class PainLevelComponent implements BlockComponent {
  @Input() block: any;
  @Output() painLevelView = new EventEmitter<any>();
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(e: any) {
      e.preventDefault();
      this.painLevelView.emit({'action': 'painLevelView', block: this.block});
  }
}
