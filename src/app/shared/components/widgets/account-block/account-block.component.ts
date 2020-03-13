import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';

@Component({
    selector: 'account-block',
    templateUrl: './account-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './account-block.component.scss']
})
export class AccountBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() accountView = new EventEmitter<any>();
  constructor(public utils: Utils, private loaderService: LoaderService) {}

  public onChange(e: any) {
      e.preventDefault();
      this.accountView.emit({'action': 'accountView', block: this.block});
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  };

  addSubMember(e: any, idx: number, memFrom: string) {
    if (e.target.checked) {
      var subMemData = this.connectData();

      if (subMemData.length > 0) {
        this.block.data.submember.push(subMemData)
      }
    } else {
      if (memFrom === "sub") {
        var currIdx = idx + 1;
        var subMemLength = this.block.data.submember.length;

        if (currIdx < subMemLength) {
          this.block.data.submember.length = currIdx;
        }
      } else if (memFrom === "main") {
        this.block.data.submember = [];
      }
    }
  };

  connectData() {
    var profileData = this.block.profileData.length > 0 ? this.block.profileData.map(x => Object.assign({}, x)) : [];

    profileData.push({
      required: false,
      assigned: false,
      name: "Add Family Member ?",
      tag: "addMember",
      type: "addMember"
    });

    if (profileData.length > 0) {
      for (let i = 0; i < profileData.length; i++) {
        var currData = profileData[i];
        profileData[i]["assigned"] = currData.hasOwnProperty("required") && currData.required ? true : false;
      }
    }

    return profileData;
  };
}
