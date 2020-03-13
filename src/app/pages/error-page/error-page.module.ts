import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorPageRoutingModule } from './error-page-routing.module';
import { ErrorPageComponent } from './error-page.component';
import { SharedModule } from '../../shared/shared.module';
import { LayoutComponentModule } from '../../shared/layout.module';

@NgModule({
    imports: [CommonModule, LayoutComponentModule, SharedModule, ErrorPageRoutingModule],
    declarations: [ErrorPageComponent]
})
export class ErrorPageModule {}
