import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MobileAppPageRoutingModule } from './mobile-app-page-routing.module';
import { MobileAppPageComponent } from './mobile-app-page.component';
import { SharedModule } from '../../shared/shared.module';
import { LayoutComponentModule } from '../../shared/layout.module';
import { PagesPageComponent } from './components/pages-page/pages-page.component';

@NgModule({
    imports: [
      CommonModule,
      LayoutComponentModule,
      SharedModule,
      MobileAppPageRoutingModule,
      FlexLayoutModule.withConfig({addFlexToParent: false})
    ],
    declarations: [MobileAppPageComponent, PagesPageComponent]
})
export class MobileAppPageModule {}
