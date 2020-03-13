import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'survey-block',
    templateUrl: './survey-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './survey-block.component.scss']
})
export class SurveyBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() surveyView = new EventEmitter<any>();
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(idx, data) {
      this.block.data.popup[idx] = data;
      this.surveyView.emit({'action': 'surveyView', block: this.block});
  }
  public onChangeConfirmation(idx, data) {
      this.block.data.confirmation[idx] = data;
      this.surveyView.emit({'action': 'surveyView', block: this.block});
  }
  addOption(e: any) {
    this.block.data.questions.push("");

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

  controlChange(isMultiple: any) {
    if (isMultiple == "true") {
      this.block.data.showInApp = false;
      this.block.data.isNote = false;
    }
  };

  addPopup(e: any) {
    var quesLength = this.block.data.questions.length;
    var popLength = this.block.data.popup.length;


    if (quesLength > popLength) {
      var popToAppend = quesLength - popLength;
      var contentValue = new String("");

      for (let i = 1; i <= popToAppend; i++) {
        this.block.data.popup.push(contentValue);
      }
    }
  };

  addAlert(e: any) {
    var quesLength = this.block.data.questions.length;
    var alertsLength = this.block.data.alerts.length;

    if (quesLength > alertsLength) {
      var alertsToAppend = quesLength - alertsLength;

      for (let i = 1; i <= alertsToAppend; i++) {
        this.block.data.alerts.push("");
      }
    }
  };

  addConfirm(e: any) {
    var quesLength = this.block.data.questions.length;
    var confirmLength = this.block.data.confirmation.length;

    if (quesLength > confirmLength) {
      var confirmToAppend = quesLength - confirmLength;

      for (let i = 1; i <= confirmToAppend; i++) {
        this.block.data.confirmation.push("");
      }
    }
  };

  removeOption(opt: any) {
    let index: number = this.block.data.questions.indexOf(opt);

    if (index !== -1 && this.block.data.questions.length > 1) {
      this.block.data.questions.splice(index, 1);
      this.block.data.popup.splice(index, 1);
      this.block.data.alerts.splice(index, 1);
      this.block.data.confirmation.splice(index, 1);
    }
  };

  trackByIndex(index: number, obj: any): any {
    return index;
  };
}
