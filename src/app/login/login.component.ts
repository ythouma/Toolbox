import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { RequestService, LayoutUtilsService } from '../shared/services';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    public errorMessage: string = '';
    public loading: boolean = false;
    public title = environment.serverName;
    public subTitle = environment.subServerName;
    public email = '';
    public password = '';
    public returnUrl: string;
    constructor(private cookieService: CookieService, private layoutUtilsService: LayoutUtilsService, private requestService: RequestService, private router: Router, private route: ActivatedRoute) {
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    ngOnInit() {}

    onLogin() {
        if (this.email !== '' && this.password !== '') {
            this.loadUser();
        } else {
          this.layoutUtilsService.showNotification('Fill in email and password!!', 'Dismiss');
        }
    }
    public loadUser() {
        if (!this.loading) {
          // this.cookieService.set( 'pageUpdated', (new Date()).toUTCString() );
          this.loading = true;
          this.errorMessage = '';
          this.requestService.requestLogin(this.email, this.password, (data, error) => {
            if (error) {
              // this.errorMessage = error;
              // this.layoutUtilsService.showNotification('Error:' + error, 'Dismiss');
              this.layoutUtilsService.showNotification('Wrong Login!!', 'Dismiss');
              this.requestService.authenticatedUser.next(false);
            }
            if (data) {
              console.log('currentUser' , data);
              let userData = data;
              localStorage.setItem('currentUser', JSON.stringify(userData));
              this.requestService.currentUser = userData;
              this.loading = false;
              this.requestService.authenticatedUser.next(true);
              this.router.navigateByUrl(this.returnUrl);
            } else {
              this.layoutUtilsService.showNotification('Wrong Login!!', 'Dismiss');
              this.requestService.authenticatedUser.next(false);
            }
            this.loading = false;
          });
       }
    }
}
