import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MobileAppPageComponent } from './mobile-app-page.component';
import { PagesPageComponent } from './components/pages-page/pages-page.component';

const routes: Routes = [
    {
        path: '',
        component: MobileAppPageComponent,
        children: [
            { path: '', redirectTo: 'pages', pathMatch: 'full' },
            { path: 'pages', component: PagesPageComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MobileAppPageRoutingModule {}
