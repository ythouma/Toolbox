import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TilesPageComponent } from './tiles-page.component';
import { WidgetsPageComponent } from './components/widgets-page/widgets-page.component';

const routes: Routes = [
    {
        path: '',
        component: TilesPageComponent,
        children: [
            { path: '', redirectTo: 'widgets', pathMatch: 'full' },
            { path: 'widgets', component: WidgetsPageComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TilesPageRoutingModule {}
