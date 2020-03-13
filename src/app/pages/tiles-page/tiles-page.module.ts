import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TilesPageRoutingModule } from './tiles-page-routing.module';
import { TilesPageComponent } from './tiles-page.component';
import { SharedModule } from '../../shared/shared.module';
import { LayoutComponentModule } from '../../shared/layout.module';
import { WidgetsPageComponent } from './components/widgets-page/widgets-page.component';

@NgModule({
    imports: [
      CommonModule,
      LayoutComponentModule,
      SharedModule,
      TilesPageRoutingModule,
      FlexLayoutModule.withConfig({addFlexToParent: false})
    ],
    declarations: [TilesPageComponent, WidgetsPageComponent]
})
export class TilesPageModule {}
