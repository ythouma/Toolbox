import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';

@Component({
    selector: 'formTitle-block',
    templateUrl: './formTitle-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './formTitle-block.component.scss']
})
export class FormTitleBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() formTitleView = new EventEmitter<any>();
  constructor(private loaderService: LoaderService) {}

  public onChange(e: any) {
      // e.preventDefault();
      this.formTitleView.emit({'action': 'formTitleView', block: this.block});
  }
}
