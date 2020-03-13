import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component } from '@angular/core';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss']
})
export class NavComponent {
    public title = environment.serverName;
    isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(
        Breakpoints.Handset
    );
    constructor(private breakpointObserver: BreakpointObserver) {}
}
