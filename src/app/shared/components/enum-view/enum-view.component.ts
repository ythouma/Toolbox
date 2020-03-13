import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-enum-view',
    templateUrl: './enum-view.component.html',
    styleUrls: ['./enum-view.component.scss']
})
export class EnumViewComponent implements OnInit {
    public enumListObj: any = {};
    public _enumList: any = [];
    @Input() enumValue: string;
    @Input()
    set enumList(enumList: any[]) {
      this._enumList = enumList;
      let newEnumListObj = {};
      for (let enm of enumList) {
        newEnumListObj[enm.value] = enm.displayName;
      }
      this.enumListObj = newEnumListObj;
    }
    get enumList(): any[] {
      return this._enumList;
    }
    constructor() {
    }
    ngOnInit() {}
}
