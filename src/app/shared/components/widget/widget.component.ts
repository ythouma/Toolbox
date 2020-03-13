import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoaderService } from '../../../shared/services';

@Component({
    selector: 'app-widget',
    templateUrl: './widget.component.html',
    styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit {
  public subscriptions: any[] = <any>[];
  public Loading: boolean = false;

  @Input() data: any;
  @Input() title: string;
  @Input() type: string;
  @Output() onActionData = new EventEmitter<any>();
  constructor(private loaderService: LoaderService) {}

  ngOnInit() {
    // this.subscriptions.push(
    //   this.loaderService.status.subscribe((val: boolean) => {
    //       this.showLoader = val;
    //   })
    // );
  }
  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }
  setData(block) {
    this.onActionData.emit(block);
  }
}
