import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnginePageComponent } from './engine-page.component';
import { WorkflowsPageComponent } from './components/workflows-page/workflows-page.component';

const routes: Routes = [
    {
        path: '',
        component: EnginePageComponent,
        children: [
            { path: '', redirectTo: 'workflows', pathMatch: 'full' },
            { path: 'workflows', component: WorkflowsPageComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EnginePageRoutingModule {}
