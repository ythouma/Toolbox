import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DummyPageComponent } from './dummy-page.component';

const routes: Routes = [
    {
        path: '',
        component: DummyPageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DummyPageRoutingModule {}
