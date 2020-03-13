import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgxPaginationModule } from 'ngx-pagination';
// import { LeafletModule } from '@asymmetrik/ngx-leaflet';
// import { AgmCoreModule } from '@agm/core';
import { JsonpModule } from '@angular/http';
import { NgxPermissionsModule } from 'ngx-permissions';

import { NgSelectModule } from '@ng-select/ng-select';
import {
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCardModule,
    MatChipsModule,
    MatTableModule,
    MatTabsModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
  	MatProgressBarModule,
    MatPaginatorModule,
    MatDialogModule,
  	MatProgressSpinnerModule,
    MatSortModule,
    MatExpansionModule
} from '@angular/material';
// import {MatExpansionModule} from '@angular/material/expansion';
import { FormsModule as FormModule } from '@angular/forms';

import { FromNowPipe } from './pipes/from-now.pipe';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { SafePipe } from './pipes/safe.pipe';
/* components */
// import { CardComponent } from './components/card/card.component';
// import { TodolistComponent } from './components/todolist/todolist.component';
// import { TabsetComponent } from './components/tabset/tabset.component';
// import { TabContentComponent } from './components/tabset/tab-content/tab-content.component';
// import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
// import { FileTreeComponent } from './components/file-tree/file-tree.component';
// import { SwitchComponent } from './components/switch/switch.component';
// import { PellEditorComponent } from './components/pell-editor/pell-editor.component';
// import { AlertComponent } from './components/alert/alert.component';
// import { WeatherComponent } from './components/weather/weather.component';
// import { ProfileComponent } from './components/profile/profile.component';
// import { CustomFormComponent } from './components/custom-form/custom-form.component';
// import { CustomTableComponent } from './components/custom-table/custom-table.component';
// import { CustomSelectComponent } from './components/custom-select/custom-select.component';
// import { CustomModalComponent } from './components/custom-modal/custom-modal.component';
// import { RolesModalComponent } from './components/roles-modal/roles-modal.component';
// import { LocationsModalComponent } from './components/locations-modal/locations-modal.component';
// import { ServiceTypesModalComponent } from './components/service-types-modal/service-types-modal.component';
// import { CustomMapComponent } from './components/custom-map/custom-map.component';
// import { CustomListComponent } from './components/custom-list/custom-list.component';
// import { ChatUIComponent } from './components/chat-ui/chat-ui.component';
// import { ModalModule } from 'ngx-modal';
//
// import { FromNowPipe } from 'app/pipes/from-now.pipe';
// import { CapitalizePipe } from 'app/pipes/capitalize.pipe';
// import { SafePipe } from 'app/pipes/safe.pipe';
// import { KeysPipe } from 'app/pipes/keys.pipe';
//
// import {DndModule} from 'ng2-dnd';

@NgModule({
  imports: [
    CommonModule,
    // NgxPaginationModule,
    // LeafletModule,
    // AgmCoreModule,
    FormsModule,
    ReactiveFormsModule,
    JsonpModule,
    // ModalModule,
    // DndModule.forRoot()
  ],
  declarations: [
    // CardComponent,
    // FileTreeComponent,
    // TodolistComponent,
    // TabsetComponent,
    // TabContentComponent,
    // ProgressBarComponent,
    // SwitchComponent,
    // PellEditorComponent,
    // AlertComponent,
    // WeatherComponent,
    // ProfileComponent,
    // CustomFormComponent,
    // CustomTableComponent,
    // CustomSelectComponent,
    // CustomModalComponent,
    // RolesModalComponent,
    // LocationsModalComponent,
    // ServiceTypesModalComponent,
    // CustomListComponent,
    // ChatUIComponent,
    // CustomMapComponent,
    FromNowPipe,
    CapitalizePipe,
    SafePipe,
    // KeysPipe
  ],
  exports: [
    // CardComponent,
    // FileTreeComponent,
    // TodolistComponent,
    // TabsetComponent,
    // TabContentComponent,
    // ProgressBarComponent,
    // SwitchComponent,
    // PellEditorComponent,
    // AlertComponent,
    // WeatherComponent,
    // ProfileComponent,
    // FormsModule,
    // ReactiveFormsModule,
    // CustomFormComponent,
    // CustomTableComponent,
    // CustomSelectComponent,
    // CustomModalComponent,
    // RolesModalComponent,
    // LocationsModalComponent,
    // ServiceTypesModalComponent,
    // CustomListComponent,
    // ChatUIComponent,
    // CustomMapComponent,
    FromNowPipe,
    CapitalizePipe,
    SafePipe,
    // KeysPipe
    FormModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCardModule,
    MatChipsModule,
    MatTableModule,
    MatTabsModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
  	MatProgressBarModule,
    MatPaginatorModule,
    MatDialogModule,
  	MatProgressSpinnerModule,
    MatSortModule,
    NgxPermissionsModule,
    NgSelectModule,
    MatExpansionModule
  ]
})
export class SharedModule { }
