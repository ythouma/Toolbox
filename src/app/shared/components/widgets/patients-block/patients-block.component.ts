import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';

@Component({
    selector: 'patients-block',
    templateUrl: './patients-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './patients-block.component.scss']
})
export class PatientsBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() patientsView = new EventEmitter<any>();
  constructor(private loaderService: LoaderService) {}

  public onChange(e: any) {
      // e.preventDefault();
      this.patientsView.emit({'action': 'patientsView', block: this.block});
  }
}
