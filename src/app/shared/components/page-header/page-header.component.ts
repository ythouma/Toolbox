import { Component, OnInit, Input } from '@angular/core';
// RxJS
import { Subscription } from 'rxjs';
import { SubheaderService } from '../../../shared/services';
import { Breadcrumb } from '../../../shared/services/utils/subheader.service';

@Component({
    selector: 'app-page-header',
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {
    private subscriptions: Subscription[] = [];
  	today: number = Date.now();
  	title: string = '';
  	desc: string = '';
  	breadcrumbs: Breadcrumb[] = [];
    constructor(private subheaderService: SubheaderService) {
    }
    ngOnInit() {}
    ngAfterViewInit(): void {
  		this.subscriptions.push(this.subheaderService.title$.subscribe(bt => {
  			// breadcrumbs title sometimes can be undefined
  			if (bt) {
  				Promise.resolve(null).then(() => {
  					this.title = bt.title;
  					this.desc = bt.desc;
  				});
  			}
  		}));

  		this.subscriptions.push(this.subheaderService.breadcrumbs$.subscribe(bc => {
  			Promise.resolve(null).then(() => {
  				this.breadcrumbs = bc;
  			});
  		}));
  	}
    /**
  	 * On destroy
  	 */
  	ngOnDestroy(): void {
  		this.subscriptions.forEach(sb => sb.unsubscribe());
  	}
}
