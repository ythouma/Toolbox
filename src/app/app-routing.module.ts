import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/guard/auth.guard';

const routes: Routes = [
    // {
    //     path: '',
    //     loadChildren: './layout/layout.module#LayoutModule',
    //     canActivate: [AuthGuard]
    // },
    {
        path: '',
        loadChildren: './pages/pages.module#PagesModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'noaccess',
        loadChildren: './pages/dummy-page/dummy-page.module#DummyPageModule'
    },
    {
        path: 'login',
        loadChildren: './login/login.module#LoginModule'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {}
