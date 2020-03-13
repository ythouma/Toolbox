import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'questions-block',
    templateUrl: './questions-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './questions-block.component.scss']
})
export class QuestionsBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() questionsView = new EventEmitter<any>();

  answerTypes: any[] = [{ "text": "Text", "value": "text" },
  { "text": "Text with Unknown", "value": "text_na" },
  { "text": "Text with N/A", "value": "text_nil" },
  { "text": "textarea", "value": "Text Area" },
  { "text": "Text Area with Unknown", "value": "textarea_na" },
  { "text": "Text Area with N/A", "value": "textarea_nil" },
  { "text": "Date", "value": "date" },
  { "text": "Date with Unknown", "value": "date_na" },
  { "text": "Date with N/A", "value": "date_nil" },
  { "text": "Date with approximate", "value": "date_approximate" },
  { "text": "Date and Time", "value": "datetime-local" },
  { "text": "Date and Time with Unknown", "value": "datetime-local_na" },
  { "text": "Date and Time with N/A", "value": "datetime-local_nil" },
  { "text": "Date and Time with approximate", "value": "datetime-local_approximate" },
  { "text": "Time Only", "value": "time" },
  { "text": "Time Only with Unknown", "value": "time_na" },
  { "text": "Time Only with N/A", "value": "time_nil" },
  { "text": "Time Only with approximate", "value": "time_approximate" },
  { "text": "Number", "value": "number" },
  { "text": "Number with Unknown", "value": "number_na" },
  { "text": "Number with N/A", "value": "number_nil" }];

  constructor(public utils: Utils, private loaderService: LoaderService) {}

  trackByIndex(index: number, obj: any): any {
    return index;
  };

  addQuestions(e: any) {
    this.block.data.notes.push(false);
    this.block.data.answerTypes.push("text");
    this.block.data.mandatory.push(false);
    this.block.data.questions.push("");
  };
  public onChange(idx, data) {
      this.block.data.popup[idx] = data;
      this.questionsView.emit({'action': 'questionsView', block: this.block});
  }
  public onChangeConfirmation(idx, data) {
      this.block.data.confirmation[idx] = data;
      this.questionsView.emit({'action': 'questionsView', block: this.block});
  }
}
