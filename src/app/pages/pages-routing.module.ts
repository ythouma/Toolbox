import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AuthGuard } from '../shared/guard';

import { NgxPermissionsGuard } from 'ngx-permissions';
import { PagesComponent } from './pages.component';
import { environment } from '../../environments/environment';

const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard'
            },
            {
                path: 'dashboard',
                loadChildren: './dashboard/dashboard.module#DashboardModule'
            },
            {
                path: 'tiles',
                loadChildren: './tiles-page/tiles-page.module#TilesPageModule'
            },
            {
                path: 'mobile-app',
                loadChildren: './mobile-app-page/mobile-app-page.module#MobileAppPageModule'
            },
            {
                path: 'engine',
                loadChildren: './engine-page/engine-page.module#EnginePageModule'
            },
            {
                path: 'error/:type',
                loadChildren: './error-page/error-page.module#ErrorPageModule'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}
