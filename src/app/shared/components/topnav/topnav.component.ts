import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { RequestService, StoreService } from '../../../shared/services';
import { CustomSelectAutocompleteComponent } from '../../../shared/components/custom-select-autocomplete/custom-select-autocomplete.component';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';

@Component({
    selector: 'app-topnav',
    templateUrl: './topnav.component.html',
    styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent implements OnInit {
    private subscriptions: Subscription[] = [];
    public selectedUser: any;
    public title = environment.serverName;
    public subTitle = environment.subServerName;
    public pushRightClass: string;
    public selectedOrganization: string = '';
    public userType: string = 'default';
    public dataType: string = 'organization';
    public dataTypeDisplay: string = 'Organization';

    @ViewChild('customselectautocomplete') customselectautocomplete: CustomSelectAutocompleteComponent;
    constructor(private requestService: RequestService,
    private storeService: StoreService, public router: Router, private translate: TranslateService,
    public dialog: MatDialog) {
        this.router.events.subscribe(val => {
            if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
                this.toggleSidebar();
            }
        });
        this.userType = this.requestService.getUserType();
    }

    ngOnInit() {
        this.pushRightClass = 'push-right';
        this.subscriptions.push(
          this.requestService.currentUserSubject.subscribe((data) => {
            if (data) {
              this.selectedUser = data;
            }
          })
        );
        this.subscriptions.push(
          this.requestService.orgId.subscribe((data) => {
            if (data) {
              this.selectedOrganization = data;
            }
          })
        );
    }

    setSelectedOrganization(e) {
        console.log('setSelectedOrganization', e);
        this.requestService.orgId.next(e._id);
        this.storeService.set('orgId', e._id);
        window.location.reload();
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    onLoggedout() {
        this.requestService.logout();
        this.router.navigate(['/login']); // we might need to remove it from here and put it in the requestService.logout
    }

    changeLang(language: string) {
        this.translate.use(language);
    }
    viewProfile() {

    }

}
