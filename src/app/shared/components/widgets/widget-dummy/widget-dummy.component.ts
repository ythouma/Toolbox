import { Component, OnInit, Input } from '@angular/core';
import { LoaderService } from '../../../../shared/services';

@Component({
    selector: 'app-widget-dummy',
    templateUrl: './widget-dummy.component.html',
    styleUrls: ['../tileblocks.component.scss', './widget-dummy.component.scss']
})
export class WidgetDummyComponent implements OnInit {
  public subscriptions: any[] = <any>[];
  public Loading: boolean = false;

  @Input() title: string;
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
}
