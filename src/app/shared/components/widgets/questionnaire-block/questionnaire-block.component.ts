import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'questionnaire-block',
    templateUrl: './questionnaire-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './questionnaire-block.component.scss']
})
export class QuestionnaireBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() questionnaireView = new EventEmitter<any>();
  public config = {
      uiColor: '#F0F3F4',
      height: '250',
      allowedContent : true,
      removeButtons : 'Image'
  };
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(idx, data) {
      this.block.data.popup[idx] = data;
      this.questionnaireView.emit({'action': 'questionnaireView', block: this.block});
  }
  public onChangeConfirmation(idx, data) {
      this.block.data.confirmation[idx] = data;
      this.questionnaireView.emit({'action': 'questionnaireView', block: this.block});
  }

  addOption(e: any) {
    e.preventDefault();

    var optData = {
      "option": "",
      "alert": "",
      "confirmation": "",
      "popup": ""
    };

    this.block.data.options.push(optData);

    var popLength = this.block.data.popup.length;
    var alertsLength = this.block.data.alerts.length;
    var confirmLength = this.block.data.confirmation.length;

    if (popLength > 0) {
      this.addPopup("");
    }

    if (alertsLength > 0) {
      this.addAlert("");
    }

    if (confirmLength > 0) {
      this.addConfirm("");
    }
  };

  addSubOption(e: any, data: any, type: string) {
    e.preventDefault();

    if (!data.hasOwnProperty("subQuestions")) {
      data["subQuestions"] = [];
    }

    if (type === "questions") {
      data["subQuestions"].push({
        "type": "questions",
        "questionText": "",
        "questionType": "single",
        "inputControlType": "radio",
        "options": [{ "option": "" }, { "option": "" }]
      });
    } else if (type === "description") {
      data["subQuestions"].push({
        "type": "description",
        "controlType": "text",
        "questionText": ""
      });
    }
  };

  trackByIndex(index: number, obj: any): any {
    return index;
  };

  deleteLevel(level: any) {
    this.block.data.options[level.parentIndex].subQuestions.splice(level.currentIndex, 1);
  };

  removeOption(option: any) {
    let index: number = this.block.data.options.indexOf(option);

    if (index !== -1 && this.block.data.options.length >= 2) {
      this.block.data.options.splice(index, 1);
      this.block.data.popup.splice(index, 1);
      this.block.data.alerts.splice(index, 1);
      this.block.data.confirmation.splice(index, 1);
    }
  };

  addPopup(e: any) {
    var optsLength = this.block.data.options.length;
    var popLength = this.block.data.popup.length;

    if (optsLength > popLength) {
      var popToAppend = optsLength - popLength;
      var contentValue = new String("");

      for (let i = 1; i <= popToAppend; i++) {
        this.block.data.popup.push(contentValue);
      }
    }
  };

  addAlert(e: any) {
    var optsLength = this.block.data.options.length;
    var alertsLength = this.block.data.alerts.length;

    if (optsLength > alertsLength) {
      var alertsToAppend = optsLength - alertsLength;

      for (let i = 1; i <= alertsToAppend; i++) {
        this.block.data.alerts.push("");
      }
    }
  };

  addConfirm(e: any) {
    var optsLength = this.block.data.options.length;
    var confirmLength = this.block.data.confirmation.length;

    if (optsLength > confirmLength) {
      var confirmToAppend = optsLength - confirmLength;

      for (let i = 1; i <= confirmToAppend; i++) {
        this.block.data.confirmation.push("");
      }
    }
  };
}
