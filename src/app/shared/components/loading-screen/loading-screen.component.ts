import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../shared/services';

@Component({
    selector: 'app-loading-screen',
    templateUrl: './loading-screen.component.html',
    styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit {
  public subscriptions: any[] = <any>[];
  public showLoader: boolean = false;

  constructor(private loaderService: LoaderService) {}

  ngOnInit() {
    this.subscriptions.push(
      this.loaderService.status.subscribe((val: boolean) => {
          this.showLoader = val;
      })
    );
  }
  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }
}
