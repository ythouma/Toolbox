import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'notes-block',
    templateUrl: './notes-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './notes-block.component.scss']
})
export class NotesBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() notesView = new EventEmitter<any>();

  isNotes: boolean = false;
  isAllnotes: boolean = false;
  isJournal: boolean = false;
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(e: any) {
      // e.preventDefault();
      this.notesView.emit({'action': 'notesView', block: this.block});
  }

  notesAssign(e: any, type: string) {
    if (type === "allNotes") {
      this.block.data.notes = false
      this.block.data.journal = false
    }

    if (type === "notes") {
      this.block.data.allNotes = false;
      this.block.data.journal = false;
    }

    if (type === "journal") {
      this.block.data.notes = false;
      this.block.data.allNotes = false;
    }

    this.isNotes = this.block.data.notes;
    this.isAllnotes = this.block.data.allNotes;
    this.isJournal = this.block.data.journal;
  };
}
