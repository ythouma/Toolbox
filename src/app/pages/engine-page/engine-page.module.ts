import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { EnginePageRoutingModule } from './engine-page-routing.module';
import { EnginePageComponent } from './engine-page.component';
import { SharedModule } from '../../shared/shared.module';
import { LayoutComponentModule } from '../../shared/layout.module';
import { WorkflowsPageComponent } from './components/workflows-page/workflows-page.component';

@NgModule({
    imports: [
      CommonModule,
      LayoutComponentModule,
      SharedModule,
      EnginePageRoutingModule,
      FlexLayoutModule.withConfig({addFlexToParent: false})
    ],
    declarations: [EnginePageComponent, WorkflowsPageComponent]
})
export class EnginePageModule {}
