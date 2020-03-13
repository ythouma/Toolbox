import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';

@Component({
    selector: 'calendar-block',
    templateUrl: './calendar-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './calendar-block.component.scss']
})
export class CalendarBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() calendarView = new EventEmitter<any>();
  widget_Buttons_map = ['calendar', 'dial', 'email'];
  constructor(private loaderService: LoaderService) {}
  public onChange( data) {
      this.block.data.text = data;
      this.calendarView.emit({'action': 'calendarView', block: this.block});
  }
}
