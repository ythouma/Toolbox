import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot  } from '@angular/router';
import { StoreService } from '../../shared/services';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private storeService: StoreService) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let queryParam = Object.assign({}, route.queryParamMap['params']);
        if (localStorage.getItem('currentUser')) {
            // logged in so return true
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            let orgId = this.storeService.get('orgId');
            if(queryParam.hasOwnProperty('token') && queryParam.hasOwnProperty('orgid')){
              let orgId = queryParam.orgid;
              let token = queryParam.token;
              currentUser.token = token;
              localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            // console.log(currentUser);
            if (this.legitUser(currentUser)) {
              return true;
            }
        }
        // not logged in so redirect to login page with the return url
        queryParam['returnUrl'] = state.url;
        if(queryParam.hasOwnProperty('token') && queryParam.hasOwnProperty('orgid')){
          this.router.navigate(['/noaccess'], { queryParams: queryParam});
        }else{
          this.router.navigate(['/login'], { queryParams: queryParam});
        }
        return false;
    }
    private legitUser(user): boolean {
      if (user.hasOwnProperty('_id') && user.hasOwnProperty('token')) {
        return true;
      } else {
        return false;
      }
    }
}
