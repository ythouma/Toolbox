import { LayoutModule } from '@angular/cdk/layout';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
// NGX Permissions
import { NgxPermissionsModule } from 'ngx-permissions';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthGuard, RequestService, StoreService, LoggerService, GlobalErrorHandler, LoaderService  } from './shared';
import { LayoutUtilsService, MenuConfigService, SubheaderService, VimeoUploadService } from './shared/services';
import { HttpModule } from '@angular/http';
import { SharedModule } from './shared/shared.module';
import { LayoutComponentModule } from './shared/layout.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CookieService } from 'ngx-cookie-service';
import { CKEditorModule } from 'ngx-ckeditor';
import { ImageCropperModule } from 'ngx-image-cropper';
// AoT requires an exported function for factories
export const createTranslateLoader = (http: HttpClient) => {
    /* for development
    return new TranslateHttpLoader(
        http,
        '/start-javascript/sb-admin-material/master/dist/assets/i18n/',
        '.json'
    );*/
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        LayoutModule,
        OverlayModule,
        HttpModule,
        SharedModule,
        LayoutComponentModule,
        HttpClientModule,
        CKEditorModule,
        ImageCropperModule,
    		NgxPermissionsModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        })
    ],
    providers: [
      AuthGuard,
      RequestService,
      LoaderService,
      StoreService,
      VimeoUploadService,
      LayoutUtilsService,
      MenuConfigService,
      SubheaderService,
      LoggerService,
      CookieService,
      {
        provide: ErrorHandler,
        useClass: GlobalErrorHandler
      }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
