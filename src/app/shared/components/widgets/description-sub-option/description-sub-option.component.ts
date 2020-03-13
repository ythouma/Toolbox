import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'description-sub-option',
    templateUrl: './description-sub-option.component.html',
    styleUrls: ['../tileblocks.component.scss', './description-sub-option.component.scss']
})
export class DescriptionSubOptionComponent implements BlockComponent {
  @Input() block: any;

  @Input('subOption') subOption: any;
  @Input('parentIndex') parentIndex: number;
  @Input('currentIndex') currentIndex: number;
  @Input('selectWidth') selectWidth: any;
  @Input('descriptionWidth') descriptionWidth: any;
  @Input('levelIndex') levelIndex: number;
  @Output() removeSubLevel = new EventEmitter<any>();
  public config = {
      uiColor: '#F0F3F4',
      height: '250',
      allowedContent : true,
      removeButtons : 'Image'
  };
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(e: any) {
      e.preventDefault();
      this.removeSubLevel.emit({'action': 'removeSubLevel', block: this.block});
  }


  getAlphaLetter(i: number) {
    return (i >= 26 ? this.getAlphaLetter((i / 26 >> 0) - 1) : '') + 'abcdefghijklmnopqrstuvwxyz'[i % 26 >> 0];
  };

  trackByIndex(index: number, obj: any): any {
    return index;
  };

  getLevelIndex() {
    var idx = "i";

    return this.levelIndex == 2 ? idx = idx + "i" : idx;
  };

  deleteSubLevel(e: any) {
    var level = { "parentIndex": this.parentIndex, "currentIndex": this.currentIndex };
    this.removeSubLevel.emit(level);
  };
}
