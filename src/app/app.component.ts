import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable , interval } from 'rxjs';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { RequestService, StoreService, LoggerService, LoaderService, MenuConfigService, LayoutUtilsService } from './shared/services';
import { SnackBarComponent } from './shared/components/snack-bar/snack-bar.component';
import { MenuConfig } from './menu.config';
import { ErrorEntityDialogComponent } from './shared/components/modals';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public subscriptions: any[] = <any>[];
    public showLoader: boolean = false;
    public showError: boolean = true;
    private repeatIntervalSeconds: number = 5;
    private dataSeenOnce: boolean = false;
    private messageSeenOnce: boolean = false;
    constructor(private menuConfigService: MenuConfigService, private loaderService: LoaderService, public snackBar: MatSnackBar, private translate: TranslateService, private requestService: RequestService, private logger: LoggerService, private router: Router, private dialog: MatDialog, private layoutUtilsService: LayoutUtilsService, private storeService: StoreService) {
        translate.setDefaultLang('en');
        this.getMe();
    }

    ngOnInit() {
      this.subscriptions.push(
        this.requestService.authenticatedUser.subscribe((event: boolean) => {
          if(event && !this.dataSeenOnce){
            this.dataSeenOnce = true;
            this.getMe();
          }
        }
      ));
      // this.subscriptions.push(interval(1000 * this.repeatIntervalSeconds).subscribe( (x) => {
      //   this.validateMe();
      //
      // }));
      this.subscriptions.push(
      this.requestService.appStatusSubject.subscribe((data: any) =>
        {
          if(data){
            if(data === 'login'){
              this.requestService.logout();
            }
          }
        })
      );
      this.subscriptions.push(
        this.router.events.subscribe( (event: any) => {
            if (event instanceof NavigationStart) {
                // Show loading indicator
                this.loaderService.display(false);
            }

            if (event instanceof NavigationEnd) {
                // Hide loading indicator
            }

            if (event instanceof NavigationError) {
                // Hide loading indicator

                // Present error to user
                console.log('NavigationError:', event.error);
            }
        })
      );
      this.subscriptions.push(
        this.logger.errorObject.subscribe((error) => {
          if (error) {
            // console.log('Global Error: ', error);
            // this.loaderService.display(false);
            if(this.showError){
              this.showError = false;
              this.openAlert('An Error occured:' + error);
            }
          }
        })
      );
      this.menuConfigService.loadConfigs(new MenuConfig().configs);
    }
    ngOnDestroy() {
      this.subscriptions.forEach((s) => s.unsubscribe());
    }
    public getMe() {
      if (localStorage.getItem('currentUser')) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.requestService.currentUser = currentUser;
        // this.requestService.orgId.next(this.storeService.get('orgId'));
      }else {
        this.requestService.logout();
      }
    }
    public validateMe() {
      this.requestService.getMe((data, error) => {
        if (error) {
          this.requestService.logout();
          console.log(error);
        }
        if (data) {
          // valid
        } else {
          this.requestService.logout();
        }
      });
    }
    public openAlert(message, title = 'Error') {
      const _title: string = title;
  		const _description: string = message;

  		const dialogRef = this.layoutUtilsService.errorElement(_title, _description);
  		dialogRef.afterClosed().subscribe(res => {
  			if (!res) {
  				return;
  			}
        window.location.reload();
  		});
    }
}
