import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RequestService, MenuConfigService } from '../../../shared/services';
import { environment } from '../../../../environments/environment';
// Object path
import * as objectPath from 'object-path';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    private subscriptions: Subscription[] = [];
    public selectedUser: any;
    public showMenu: string;
    public menuConfigs: any[] = [];
    constructor(private requestService: RequestService, private menuConfigService: MenuConfigService) {
        this.menuConfigs = objectPath.get(this.menuConfigService.getMenus(), 'aside.items');
    }

    ngOnInit() {
      this.subscriptions.push(
        this.requestService.currentUserSubject.subscribe((data) => {
          if (data) {
            this.selectedUser = data;
          }
        })
      );
      this.showMenu = '';
    }
    /**
     * On Destroy
     */
    ngOnDestroy() {
      this.subscriptions.forEach(el => el.unsubscribe());
    }
    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }
}
