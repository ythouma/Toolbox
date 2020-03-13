import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { DummyPageRoutingModule } from './dummy-page-routing.module';
import { DummyPageComponent } from './dummy-page.component';
import { SharedModule } from '../../shared/shared.module';
import { LayoutComponentModule } from '../../shared/layout.module';

@NgModule({
    imports: [
      CommonModule,
      LayoutComponentModule,
      SharedModule,
      DummyPageRoutingModule,
      FlexLayoutModule.withConfig({addFlexToParent: false})
    ],
    declarations: [DummyPageComponent]
})
export class DummyPageModule {}
