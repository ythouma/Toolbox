import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'physician-block',
    templateUrl: './physician-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './physician-block.component.scss']
})
export class PhysicianBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() physicianView = new EventEmitter<any>();
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(e: any) {
      e.preventDefault();
      this.physicianView.emit({'action': 'physicianView', block: this.block});
  }
}
