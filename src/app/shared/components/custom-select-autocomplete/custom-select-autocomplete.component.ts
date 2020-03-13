import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { RequestService, LayoutUtilsService, LoaderService } from '../../../shared/services';
import { FormControl, FormGroupDirective, NgForm, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-custom-select-autocomplete',
  templateUrl: './custom-select-autocomplete.component.html',
  styleUrls: ['./custom-select-autocomplete.component.scss']
})
export class CustomSelectAutocompleteComponent implements OnInit {
  public errorMessage: string = '';
  public loading: boolean = false;
  public dataText: string = '';
  stateCtrl = new FormControl();
  includedData: Array<any> = [];
  selectData: Array<any> = [];
  filteredData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  /* pagination Info */
  pageSize = 10;
  pageNumber = 1;
  orderDir = 'asc';
  orderBy = 'name';
  searchText = '';

  @Input() clearable: boolean = false;
  @Input() canDelete: boolean = false;
  @Input() filters: any;
  @Input() displayName: string[] = ['name', 'text'];
  @Input() dataTypeFields: string[] = ['name'];
  @Input() placeholder: string = '';
  @Input() dataType: string;
  @Input() dataTypeDisplay: string;
  public _value: any = undefined;
  @Input()
  set value(value: any) {
    this._value = value;
    this.loadData();
  }
  get value(): any {
    return this._value;
  }
  @Output() onSelectReturn = new EventEmitter<any>();
  constructor(
    private requestService: RequestService,
    private layoutUtilsService: LayoutUtilsService
  ) { }

  ngOnInit() {
    // this.loadData();
  }
  private getSelectedItem(val){
    for(let itm of this.selectData){
      if(val === itm.uid){
        return itm
      }
    }
    return '';
  }
  displayFn(data?: any): string | undefined {
    return data ? data.text : undefined;
  }
  public clearData() {
    this.dataText = '';
  }
  public loadData() {
    this.loadDataSearch();
  }
  public loadDataSearch() {
    // console.log('value', this.value);
    if (!this.loading) {
      this.loading = true;
      this.errorMessage = '';
      let filterConfiguration = this.filters;
      this.requestService.getDataListSummary(this.dataType, {page: this.pageNumber , term: this.searchText, orderDir:this.orderDir, orderBy: this.orderBy, perpage: this.pageSize, filter: filterConfiguration, termfields: this.dataTypeFields, include: [this.value]}, (data, error) => {
        if (error) {
          this.errorMessage = error;
          this.layoutUtilsService.showNotification('Error:' + error, 'Dismiss');
        }
        if (data) {
          this.selectData = data.results;
          if(data.hasOwnProperty('include')){
            this.includedData = data.include;
          }
          if(this.value){
            this.dataText = this.getDataByID(JSON.parse(JSON.stringify(this.value)));
          }else{
            this.dataText = '';
          }
        } else {
          this.selectData = [];
          this.dataText = '';
        }
        this.filteredData.next(this.selectData);
        this.loading = false;
      });
    }
  }
  getDataByID(id): any{
    for(let lst of this.includedData){
      if(lst._id === id){
        return lst.text;
      }
    }
    return '';
  }
  termSearch(term): any {
    this.searchText = term;
    // this.onSelectReturn.emit({_id: undefined, text: term});
    this.loadDataSearch();
	}
  onBlurMethod(term): any {
    this.dataText = this.getDataByID(JSON.parse(JSON.stringify(this.value)));
    this.stateCtrl.setValue({ _id: this.value, text: this.dataText });
	}
  public setAttribute(val) {
    this.onSelectReturn.emit(val);
  }
  public deleteItem(e, val) {
    if(e){
      e.stopPropagation();
      e.preventDefault();
    }
    if (!this.loading) {
  		const _title: string = this.dataTypeDisplay + ' Delete';
  		const _description: string = 'Are you sure to permanently delete this ' + this.dataTypeDisplay + '?';
  		const _waitDesciption: string = 'Deleting...';

  		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
  		dialogRef.afterClosed().subscribe(res => {
  			if (!res) {
  				return;
  			}
        this.realDelete(val.uid);
  		});
    }
	}
  public realDelete(id: any) {
    const _deleteMessage = this.dataTypeDisplay + ` has been deleted`;
    if (!this.loading) {
      this.loading = true;
      this.errorMessage = '';
      this.requestService.deleteSingleData(this.dataType, id, (data, error) => {
        if (error) {
          this.errorMessage = error;
          this.layoutUtilsService.showNotification('Error:' + error, 'Dismiss');
        }
        this.loading = false;
        if (data) {
    			this.layoutUtilsService.showNotification(_deleteMessage, 'Dismiss');
          this.loadData();
        }
      });
    }
  }
}
