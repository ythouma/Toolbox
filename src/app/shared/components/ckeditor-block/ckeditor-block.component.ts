import { Component, Input, EventEmitter, Output, ViewChild, ChangeDetectorRef, ElementRef} from '@angular/core';
import { LoaderService } from '../../../shared/services';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { CKEditorComponent } from 'ngx-ckeditor';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ModalTilesDialogComponent } from '../../../shared/components/custom-tiles-dialog/custom-tiles-dialog.component';
import { ModalCalenderDialogComponent } from '../../../shared/components/custom-calender-dialog/custom-calender-dialog.component';
import { ModalGalleryDialogComponent } from '../../../shared/components/custom-gallery-dialog/custom-gallery-dialog.component';
import { ModalDialDialogComponent } from '../../../shared/components/custom-dial-dialog/custom-dial-dialog.component';
import { ModalEmailDialogComponent } from '../../../shared/components/custom-email-dialog/custom-email-dialog.component';
import { ModalVideoDialogComponent } from '../../../shared/components/custom-video-dialog/custom-video-dialog.component';
import { ModalPagesDialogComponent } from '../../../shared/components/custom-pages-dialog/custom-pages-dialog.component';
import { ModalTileCloseDialogComponent } from '../../../shared/components/custom-tile-close-dialog/custom-tile-close-dialog.component';
import { ModalEventMediaDialogComponent } from '../../../shared/components/custom-event-media-dialog/custom-event-media-dialog.component';
import { ModalFormMediaDialogComponent } from '../../../shared/components/custom-form-media-dialog/custom-form-media-dialog.component';
import { ModalEventDocumentDialogComponent } from '../../../shared/components/custom-event-document-dialog/custom-event-document-dialog.component';


@Component({
    selector: 'ckeditor-block',
    templateUrl: './ckeditor-block.component.html',
    styleUrls: ['./ckeditor-block.component.scss']
})
export class CkeditorBlockComponent {
  public subscriptions: any[] = <any>[];
  @Input() value: any;
  @Input() widget_Buttons_map: string[] = [];
  @Output() textView = new EventEmitter<any>();
  public actionCall: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
  // public Editor = ClassicEditor;
  public config = undefined;
  // @ViewChild( 'currentEditor' ) editor;
  @ViewChild('ckEditor') ckEditor: CKEditorComponent;
  constructor(private loaderService: LoaderService,
  private changeDetectorRefs: ChangeDetectorRef,
  public dialog: MatDialog) {
    let conf = {
        uiColor: '#F0F3F4',
        height: '250',
        allowedContent : true,
        // toolbar:[],
        // extraPlugins: 'justify,colorbutton,font,divarea,preview,bidi,smiley,embed',
        removeButtons : 'Image'
    }
    // Toolbar configuration generated automatically by the editor based on config.toolbarGroups.
    // conf['toolbar'] = [
  	// 	{ name: 'document', items: [ 'Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates' ] },
  	// 	{ name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
  	// 	{ name: 'editing', items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
  	// 	{ name: 'forms', items: [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
  	// 	'/',
  	// 	{ name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
  	// 	{ name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ] },
  	// 	{ name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
  	// 	{ name: 'insert', items: [ 'picture_Button' , 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ] },
  	// 	'/',
  	// 	{ name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
  	// 	{ name: 'colors', items: [ 'TextColor', 'BGColor' ] },
  	// 	{ name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] },
  	// 	{ name: 'about', items: ['About' ] }
  	// ];
    this.config = conf;

  }
  ngOnInit() {
  }
  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
  public onChange( data: any ) {
    //let data = editor.getData();
    // this.value = data;
    this.textView.emit(data);
  }

  // public action_Button_new(e, action, title = undefined) {
  //   setTimeout(()=>{
  //     this.actionCall.next(action);
  //   }, 300);
  //   // this.actionView.emit({action: action, title: title});
  // }
  public inAppStreaming(editor) {
      let data = editor.getData();
      data = data + '<p><a href="javascript:void(0);" onclick="iliInterface.record()" target="" type="inAppStreaming">Record</a></p>' ;
      editor.setData(data);
  }
  public galleryLibrary(editor) {
    const dialogRef = this.dialog.open(ModalGalleryDialogComponent, {
        width: '1600px',
        disableClose: false,
        autoFocus: false,
        data: {
          title: 'Upload image',
          data: [],
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          let data = editor.getData();
          data = data + '<p><img alt="" src="' + result + '" /></p>' ;
          editor.setData(data);
      }
    });
  }
  public video_Button(editor) {
    const dialogRef = this.dialog.open(ModalVideoDialogComponent, {
        width: '600px',
        disableClose: false,
        data: {
          title: 'Insert Video',
          data: [],
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let data = editor.getData();
        data = data + '<p><iframe height="180" src="' + result + '" width="320"></iframe></p>' ;
        editor.setData(data);
      }
    });
  }
  public tilesLibrary(editor) {
    const dialogRef = this.dialog.open(ModalTilesDialogComponent, {
        width: '1600px',
        disableClose: false,
        data: {
          title: 'Link to Tile',
          data: [],
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('result', result);
        let data = editor.getData();
        let dataImg = '<p><a class="tiles-link" href="' + result._id +'">' + result.title + '</a></p>';
        data = data + dataImg ;
        editor.setData(data);
      }
    });
  }
  public closeTilesLibrary(editor) {
    const dialogRef = this.dialog.open(ModalTileCloseDialogComponent, {
        width: '600px',
        disableClose: false,
        data: {
          title: 'Insert Close Tile Button',
          data: [],
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('result', result);
        let data = editor.getData();
        let dataImg = '<p><a class="sn-close-tile-link" href="javascript:void(0);" onclick="redirectBackToApp()" sec="' + result.sec +'">Close Tile</a></p>';
        if( result.type === 'button'){
          dataImg = '<p><button class="sn-close-tile-link" onclick="redirectBackToApp()" sec="' + result.sec +'">Close Tile</button></p>';
        }else if (result.type === 'image'){
          dataImg = '<p><a class="sn-close-tile-link" href="javascript:void(0);" onclick="redirectBackToApp()" sec="' + result.sec +'">Close Tile</a></p>';
        }
        data = data + dataImg ;
        editor.setData(data);
      }
    });
  }
  public pagesLibrary(editor) {
    const dialogRef = this.dialog.open(ModalPagesDialogComponent, {
        width: '1600px',
        disableClose: false,
        data: {
          title: 'Link to Page',
          data: [],
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('result', result);
        let data = editor.getData();
        let dataImg = '<p><a class="square-link" href="javascript:void(0)" onclick="iliInterface.openLinkInApp("menu", "' + result._id +'")">' + result.title + '</a></p>';
        data = data + dataImg ;
        editor.setData(data);
      }
    });
  }
  public dailCall(editor) {
    const dialogRef = this.dialog.open(ModalDialDialogComponent, {
        width: '600px',
        disableClose: false,
        data: {
          title: 'Insert phone no.',
          data: [],
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('result', result);
        let data = editor.getData();
        let dataImg = '<p><a class="cke-link" href="tel:' + result + '">Dial</a></p>';
        data = data + dataImg ;
        editor.setData(data);
      }
    });
  }
  public emailAction(editor) {
    const dialogRef = this.dialog.open(ModalEmailDialogComponent, {
        width: '600px',
        disableClose: false,
        data: {
          title: 'Insert Email',
          data: [],
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('result', result);
        let data = editor.getData();
        let dataImg = '<p><a class="cke-link" href="mailto:' + result + '">Email</a>';
        data = data + dataImg ;
        editor.setData(data);
      }
    });
  }
  public event_media(editor) {
    const dialogRef = this.dialog.open(ModalEventMediaDialogComponent, {
        width: '600px',
        disableClose: false,
        data: {
          title: 'Insert Event Media',
          data: [],
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('result', result);
        let data = editor.getData();
        let dataImg = '';
        if(result.type === 'picture'){
          dataImg = '<p><a bgcolor="' + result.bgcolor + '" delete="' + result.delete + '" floatingbottom="' + result.floatingbottom + '" floatingiconsrc="' + result.floatingiconsrc + '" href="javascript:void(0);" moderated="' + result.moderated + '" name="' + result.name + '" onclick="imageVideoUploadProcess(this)" picture="true" rate="' + result.rate + '" showvote="' + result.showvote + '" sort="' + result.sort + '" target="" type="eventPhoto" uploadbutton="' + result.uploadbutton + '" views="' + result.views + '" vote="' + result.vote + '">Event Photo</a></p>';
        } else if(result.type === 'video'){
          dataImg = '<p><a bgcolor="' + result.bgcolor + '" delete="' + result.delete + '" floatingbottom="' + result.floatingbottom + '" floatingiconsrc="' + result.floatingiconsrc + '" href="javascript:void(0);" moderated="' + result.moderated + '" name="' + result.name + '" onclick="imageVideoUploadProcess(this)" video="true" chat="' + result.chat + '" showvote="' + result.showvote + '" sort="' + result.sort + '" target="" type="eventVideo" uploadbutton="' + result.uploadbutton + '" views="' + result.views + '" vote="' + result.vote + '" privatechat="' + result.privatechat + '">Event Video</a></p>';
        }

        data = data + dataImg ;
        editor.setData(data);
      }
    });
  }
  public form_media(editor) {
    const dialogRef = this.dialog.open(ModalFormMediaDialogComponent, {
        width: '1600px',
        disableClose: false,
        data: {
          title: 'Insert Form Media',
          data: [],
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let data = editor.getData();
        let dataImg = '<p><a class="' + result.type + '" delete="' + result.deleteIcon + '" href="javascript:void(0);" name="' + result.mediaName  + '" onclick="imageVideoUploadProcess(this)" photo="true" target="" type="' + result.type + '">Attach Photo</a></p>';
        data = data + dataImg ;
        editor.setData(data);
      }
    });
  }
  public event_document(editor) {
    const dialogRef = this.dialog.open(ModalEventDocumentDialogComponent, {
        width: '600px',
        disableClose: false,
        data: {
          title: 'Form Document Upload',
          data: [],
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('result', result);
        let data = editor.getData();
        let dataImg = '<p><a class="formDoc" delete="true" href="javascript:void(0);" name="true" onclick="uploadDocumentProcess(this)" target="" type="' + result.type + '">Attach Document</a></p>';
        data = data + dataImg ;
        editor.setData(data);
      }
    });
  }
  public event_calendar(editor) {
    const dialogRef = this.dialog.open(ModalCalenderDialogComponent, {
        width: '600px',
        disableClose: false,
        data: {
          title: 'Calendar',
          data: [],
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('result', result);
        let data = editor.getData();
        let dataImg = '<p><a enddatetime="' + result.enddatetime + '" href="javascript:void(0)" location="' + result.location + '" onclick="calendarScriptProcess(this)" remainder="' + result.remainder + '" startdatetime="' + result.startdatetime + '" subject="' + result.subject + '" target="" type="calendar">Calendar</a></p>';
        data = data + dataImg ;
        editor.setData(data);
      }
    });
  }
  public ckeditorReady(e): void {
    // console.log('ckeditorReady', e);
    //this._addImageUploadBtn();
  }
  public ngAfterViewInit(): void {
    this._addImageUploadBtn();
  }
  _addImageUploadBtn() {
    const editor = this.ckEditor && this.ckEditor.instance;
    if (!editor) {
      return;
    }
    // console.log('editor', editor);
    editor.addCommand('picture_Button', this.action_Button('picture_Button'));
    editor.ui.addButton('picture_Button', {
      icon: '/assets/img/imageupload.png',
      label: 'Upload image',
      command: 'picture_Button',
      toolbar: 'insert,3'
    });
    editor.addCommand('video_Button', this.action_Button('video_Button'));
    editor.ui.addButton('video_Button', {
      icon: '/assets/img/insertvideo.png',
      label: 'Embed Video URL',
      command: 'video_Button',
      toolbar: 'insert,4'
    });
    if(this.widget_Buttons_map.indexOf('event_media') > -1){
      editor.addCommand('event_media', this.action_Button('event_media'));
      editor.ui.addButton('event_media', {
        icon: '/assets/img/ck_event_media.png',
        label: 'Choose Event Media',
        command: 'event_media',
        toolbar: 'insert,9'
      });
    }
    if(this.widget_Buttons_map.indexOf('event_document') > -1){
      editor.addCommand('event_document', this.action_Button('event_document'));
      editor.ui.addButton('event_document', {
        icon: '/assets/img/fileupload.png',
        label: 'Form Document Upload',
        command: 'event_document',
        toolbar: 'insert,9'
      });
    }
    if(this.widget_Buttons_map.indexOf('calendar') > -1){
      editor.addCommand('calendar', this.action_Button('calendar'));
      editor.ui.addButton('calendar', {
        icon: '/assets/img/ckcalendar.png',
        label: 'Calendar',
        command: 'calendar',
        toolbar: 'insert,9'
      });
    }
    if(this.widget_Buttons_map.indexOf('form_media') > -1){
      editor.addCommand('form_media', this.action_Button('form_media'));
      editor.ui.addButton('form_media', {
        icon: '/assets/img/ckform_photo.png',
        label: 'Form Media',
        command: 'form_media',
        toolbar: 'insert,9'
      });
    }
    editor.addCommand('tile_open', this.action_Button('tile_open'));
    editor.ui.addButton('tile_open', {
      icon: '/assets/img/linktile.png',
      label: 'Choose From Tile Library',
      command: 'tile_open',
      toolbar: 'insert,5'
    });
    editor.addCommand('tile_close', this.action_Button('tile_close'));
    editor.ui.addButton('tile_close', {
      icon: '/assets/img/closetile.png',
      label: 'Close Tile',
      command: 'tile_close',
      toolbar: 'insert,7'
    });
    editor.addCommand('dial', this.action_Button('dial'));
    editor.ui.addButton('dial', {
      icon: '/assets/img/dial-16.png',
      label: 'Dial',
      command: 'dial',
      toolbar: 'insert,1'
    });
    editor.addCommand('email', this.action_Button('email'));
    editor.ui.addButton('email', {
      icon: '/assets/img/email-16.png',
      label: 'Send Email',
      command: 'email',
      toolbar: 'insert,2'
    });
    editor.addCommand('In-App-Streaming', this.action_Button('In-App-Streaming'));
    editor.ui.addButton('In-App-Streaming', {
      icon: '/assets/img/rec_button.png',
      label: 'In-App Streaming',
      command: 'In-App-Streaming',
      toolbar: 'insert,8'
    });
    editor.addCommand('Link-to-Page', this.action_Button('Link-to-Page'));
    editor.ui.addButton('Link-to-Page', {
      icon: '/assets/img/linkpage.png',
      label: 'Link to Page',
      command: 'Link-to-Page',
      toolbar: 'insert,6'
    });
  }
  public action_Button(action) {
      return {
        exec: (editor: any) => {
          // Remove img input.
          if(action === 'picture_Button'){
            this.galleryLibrary(editor);
          }else if(action === 'video_Button'){
            this.video_Button(editor);
          }else if(action === 'email'){
            this.emailAction(editor);
          }else if(action === 'dial'){
            this.dailCall(editor);
          }else if(action === 'tile_open'){
            this.tilesLibrary(editor);
          }else if(action === 'tile_close'){
            this.closeTilesLibrary(editor);
          }else if(action === 'Link-to-Page'){
            this.pagesLibrary(editor);
          }else if(action === 'event_media'){
            this.event_media(editor);
          }else if(action === 'form_media'){
            this.form_media(editor);
          }else if(action === 'calendar'){
            this.event_calendar(editor);
          }else if(action === 'event_document'){
            this.event_document(editor);
          }else if(action === 'In-App-Streaming'){
            this.inAppStreaming(editor);
          }else{
            alert('need to handle this ' + action);
          }
        }
      };
  }
}
