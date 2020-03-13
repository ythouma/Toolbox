import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'questionnaire-sub-option',
    templateUrl: './questionnaire-sub-option.component.html',
    styleUrls: ['../tileblocks.component.scss', './questionnaire-sub-option.component.scss']
})
export class QuestionnaireSubOptionComponent implements BlockComponent {
  @Input() block: any;

  @Input('subOption') subOption: any;
  @Input('parentIndex') parentIndex: number;
  @Input('currentIndex') currentIndex: number;
  @Input('questionWidth') questionWidth: any;
  @Input('optionWidth') optionWidth: any;
  @Input('levelIndex') levelIndex: number;
  @Input('isLevel') isLevel: boolean;
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

  addOption(e: any) {
    var optionObj = { "option": "" };
    this.subOption.options.push(optionObj);
  };

  addSubOption(e: any, option: any, type: string) {
    e.preventDefault();

    if (!option.hasOwnProperty("subQuestions")) {
      option["subQuestions"] = [];
    }

    if (type === "questions") {
      option["subQuestions"].push({
        "type": "questions",
        "questionText": "",
        "questionType": "single",
        "inputControlType": "radio",
        "options": [{ "option": "" }, { "option": "" }]
      });
    } else if (type === "description") {
      option["subQuestions"].push({
        "type": "description",
        "controlType": "text",
        "questionText": ""
      });
    }
  };

  trackByIndex(index: number, obj: any): any {
    return index;
  };

  getLevelIndex() {
    var idx = "i";

    if (this.levelIndex == 2) {
      idx = idx + "i";
    }

    return idx;
  };

  deleteSubLevel(e: any) {
    var level = { "parentIndex": this.parentIndex, "currentIndex": this.currentIndex };
    this.removeSubLevel.emit(level);
  };

  deleteLevel(level: any) {
    this.subOption.options[level.parentIndex].subQuestions.splice(level.currentIndex, 1);
  };

  removeOption(option: any) {
    let index: number = this.subOption.options.indexOf(option);

    if (index !== -1 && this.subOption.options.length >= 2) {
      this.subOption.options.splice(index, 1);
    }
  };
}
