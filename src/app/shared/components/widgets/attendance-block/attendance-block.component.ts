import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'attendance-block',
    templateUrl: './attendance-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './attendance-block.component.scss']
})
export class AttendanceBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() attendanceView = new EventEmitter<any>();
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(e: any) {
      e.preventDefault();
      this.attendanceView.emit({'action': 'attendanceView', block: this.block});
  }
  addOption(e: any) {
    this.block.data.options.push("");
  };
  trackByIndex(index: number, obj: any): any {
    return index;
  };
}
