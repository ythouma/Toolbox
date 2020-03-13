import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, BehaviorSubject, merge, Subscription } from 'rxjs';
// import { ModalVideoViewDialogComponent } from '../../../../shared/components/custom-video-view-dialog/custom-video-view-dialog.component';
import { RequestService, SubheaderService, LayoutUtilsService, LoaderService } from '../../../../shared/services';
import { Utils } from '../../../../shared/helpers/utils';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { BlockOrganizer, BlockComponent, BlockItem, GetBlocks } from '../../../../shared/components/widgets/block-organizer';
import { ModalPreviewDialogComponent } from '../../../../shared/components/custom-preview-dialog/custom-preview-dialog.component';
import { ModalBackgroundDialogComponent } from '../../../../shared/components/custom-background-dialog/custom-background-dialog.component';
import { ModalGalleryDialogComponent } from '../../../../shared/components/custom-gallery-dialog/custom-gallery-dialog.component';
import { ModalVideosDialogComponent } from '../../../../shared/components/custom-videos-dialog/custom-videos-dialog.component';
import { environment } from '../../../../../environments/environment';

class MyUserErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
    selector: 'app-widgets-page',
    templateUrl: './widgets-page.component.html',
    styleUrls: ['./widgets-page.component.scss']
})
export class WidgetsPageComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    public selectedUser: any;
    public loading: boolean = false;
    public tableSetting: any = undefined;
    public errorMessage: string = '';
    public selectedOrganization: string = "-1";
    public selectedLanguage: string = "en";
    public organizations: any[] = [];
    public blocks: any[] = [];
    public originalBlocks: any[] = [];
    public tileIdsDelete: string[] = [];
    public tileIdsUpdate: Object = {};
    public tileBlocks: any[] = [];
    public profileDatas: any[] = [];
    public tileCategories: any[] = [];
    public widgetCategories: any[] = [];
    public languageList: any[] = [];
    public tileThemes: any[] = [];
    public widgetRights: any[] = [];
    public rtl: boolean = false;
    public defaultThemeId: string = "-1";
    public orgTileCategory: string = "-1";
    public template: string = "-1";
    public startWrapper: boolean = false;
    public esMatcher = new MyUserErrorStateMatcher();

    public dataTypeDisplay: string = 'Tile';
    public dataType: string = 'tile';

    public dataList: any []= [];

    public paginatorTotal: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    public selectedDataEmpty:any = {
      title: '',
      notes: '',
      language: 'en',
      category: '-1',
      type: 'content',
      template: this.defaultThemeId,
      rtl: false,
      requiresLogin: false,
      enableZoom: false,
      showAsTabs: false,
      blocksData: [],
      blocks: [],
      organizationId: [],
      createdOrg: undefined,
      isRoleBased: false,
      userName: '',
      lastUpdatedUser: '',
      art: '/assets/img/tile_default.jpg'
    };
    public selectedDataKeysType:any = {
      title: {name: 'title', displayName: 'title', type: 'string', valueType: 'string', check: true},
      notes: {name: 'notes', displayName: 'Notes',type: 'string', valueType: 'string', check: true},
      language: {name: 'language', displayName: 'Language',type: 'list', valueType: 'id', check: true},
      category: {name: 'category', displayName: 'Category',type: 'list', valueType: 'id', check: true},
      type: {name: 'type', displayName: 'Yype',type: 'string', valueType: 'string', check: true},
      template: {name: 'template', displayName: 'Template',type: 'list', valueType: 'id', check: true},
      rtl: {name: 'rtl', displayName: 'Rtl',type: 'boolean', valueType: 'boolean', check: true},
      requiresLogin: {name: 'requiresLogin', displayName: 'Requires Login',type: 'boolean', valueType: 'boolean', check: true},
      enableZoom: {name: 'enableZoom', displayName: 'Enable Zoom',type: 'boolean', valueType: 'boolean', check: true},
      showAsTabs: {name: 'showAsTabs', displayName: 'show As Tabs',type: 'boolean', valueType: 'boolean', check: true},
      blocksData: {name: 'blocksData', displayName: 'Blocks Data',type: 'array', valueType: 'array', check: false},
      blocks: {name: 'blocks', displayName: 'Blocks',type: 'array', valueType: 'array', check: true},
      organizationId: {name: 'organizationId', displayName: 'Organization Id', type: 'array', valueType: 'array', check: true},
      createdOrg: {name: 'createdOrg', displayName: 'Created Org', type: 'id', valueType: 'id', check: true},
      art: {name: 'art', displayName: 'Art', type: 'image', valueType: 'string', check: true},
      userName: {name: 'userName', displayName: 'User Name', type: 'string', valueType: 'string', check: true},
      lastUpdatedUser: {name: 'lastUpdatedUser', displayName: 'LastUpdatedUser', type: 'string', valueType: 'string', check: true},
    };
    public selectedDataKeysTypeList = Object.keys(this.selectedDataKeysType);

    public selectedOriginalData: any = JSON.parse(JSON.stringify(this.selectedDataEmpty));
    public selectedData: any = JSON.parse(JSON.stringify(this.selectedDataEmpty));


    pageSize = 10;
    pageNumber = 1;

    orderDir = 'desc';
    orderBy = 'dateCreated'; // uid

    public searchVal: string = '';
    @ViewChild('searchInput') searchInput: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    constructor( private requestService: RequestService, private router: Router,
		private activatedRoute: ActivatedRoute,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private utils: Utils,
    public dialog: MatDialog, private loaderService: LoaderService) {}

    ngOnInit() {
  		this.subscriptions.push(
        this.requestService.currentUserSubject.subscribe((data) => {
          if (data) {
            this.selectedUser = data;
            this.selectedOrganization = this.requestService.orgId.getValue();
            this.selectedDataEmpty['organizationId'] = [this.selectedOrganization];
            this.selectedDataEmpty['createdOrg'] = this.selectedOrganization;
            // this.getOrgProfileDatas();
            this.getWidgetCategories();
            this.getTileCategory();
            this.getLanguages();
            this.getThemes();
            this.setWidgetRights();
            this.loadData(); // rmove when uncommmeting above
          }
        })
      );
      this.subheaderService.setTitle('Tiles');
      this.subheaderService.setBreadcrumbs([
				{ title: 'Tiles', page: undefined },
				{ title: 'Widgets', page: undefined },
			]);

      const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
  			// tslint:disable-next-line:max-line-length
  			debounceTime(150), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
  			distinctUntilChanged(), // This operator will eliminate duplicate values
  			tap(() => {
  				this.paginatorTotal.next(0);
          this.loadData();
  			})
  		)
  		.subscribe();
  		this.subscriptions.push(searchSubscription);
      const paginatorSubscriptions = merge(this.paginator.page).pipe(
  			tap(() => {
          this.getTableVariables();
  				this.loadData();
  			})
  		)
  		.subscribe();
  		this.subscriptions.push(paginatorSubscriptions);
    }
    public getTableVariables() {
      // this.orderBy = this.sort.active || 'uid';
      // this.orderDir = this.sort.direction || 'asc';
      this.pageNumber = this.paginator.pageIndex + 1;
      this.pageSize = this.paginator.pageSize;
    }
    /**
  	 * On Destroy
  	 */
  	ngOnDestroy() {
  		this.subscriptions.forEach(el => el.unsubscribe());
  	}
  	toggleClick(action) {
      if(action === 'new'){
        this.newData(true);
      }else if (action === 'delete'){
        this.delete(undefined, this.selectedData['_id']);
      }else if (action === 'duplicate'){
        this.duplicate();
      }else if (action === 'save'){
        this.save();
      }else if (action === 'preview'){
        this.preview();
      }else if (action === 'background'){
        this.background();
      }else if (action === 'icon'){
        this.icon();
      }
  	}
    widgetTileReset(isNew?: boolean, isBlocks?: boolean, isUpdate?: boolean) {
      if (isNew) {
        this.selectedData = JSON.parse(JSON.stringify(this.selectedDataEmpty));
        this.selectedOriginalData = JSON.parse(JSON.stringify(this.selectedData));
        this.originalBlocks = [];
      }

      if (isBlocks) {
        this.blocks = [];
      }

      this.selectedLanguage = "en";
      this.template = this.defaultThemeId;
      this.rtl = false;
      this.orgTileCategory = "-1";
      this.startWrapper = false;

      if (!isUpdate) {
        this.tileIdsUpdate = {};
      }

      this.tileIdsDelete = [];
    };
  	dataChanged() {
      for(let ky of this.selectedDataKeysTypeList){
        if(this.selectedDataKeysType[ky].check === true){
          let val1 = this.selectedOriginalData[ky];
          let val2 = this.selectedData[ky];
          if(this.selectedDataKeysType[ky].valueType === 'array'){
            if(val1.length !== val2.length){
              return true;
            }
          }else{
            if(val1 !== val2){
              return true;
            }
          }
        }
      }
      return false;
  	}
  	newData(reset = false, langChange?: boolean) {
      // if (!langChange) {
      //   this.selectedData = JSON.parse(JSON.stringify(this.selectedDataEmpty));
      // }
      if (this.dataChanged()) {
        this.newTile('Would you like to save your previous work?', 'Save', 'Discard', (action) => {
          if (action === 'confirmText') {
            this.tileSave("", true, false, false, this.selectedData);
          } else {
            this.widgetTileReset(true, true);
          }
        });
      } else {
        this.widgetTileReset(true, true);
      }
  	}
  	duplicate() {
  		let selectedData = JSON.parse(JSON.stringify(this.selectedData));
      delete selectedData._id;
    	this.selectedData = JSON.parse(JSON.stringify(selectedData));
      this.blocks = [];
      if (this.selectedData.blocksData.length > 0) {
        for (let i = 0; i < this.selectedData.blocksData.length; i++) {
          let currentBlock: any = this.selectedData.blocksData[i];
          delete currentBlock._id;
          this.selectedData.blocksData[i] = JSON.parse(JSON.stringify(currentBlock));
          let type: string = this.selectedData.blocksData[i].hasOwnProperty("type") ? this.selectedData.blocksData[i].type : "";
          this.loadWidgets("", type, currentBlock, "");
        }
      }
      this.selectedOriginalData = JSON.parse(JSON.stringify(this.selectedData));
      this.originalBlocks = JSON.parse(JSON.stringify(this.selectedData.blocksData));
  	}
  	selectItem(data) {
  		this.selectedData = JSON.parse(JSON.stringify(data));
      if(this.selectedData['organizationId'].indexOf(this.selectedOrganization) === -1){
        this.selectedData['organizationId'] = [this.selectedData['organizationId']];
      }
      this.blocks = [];
      if (this.selectedData.blocksData.length > 0) {
        for (let i = 0; i < this.selectedData.blocksData.length; i++) {
          let currentBlock: any = this.selectedData.blocksData[i];
          let type: string = this.selectedData.blocksData[i].hasOwnProperty("type") ? this.selectedData.blocksData[i].type : "";
          this.loadWidgets("", type, currentBlock, "");
        }
      }
  		this.selectedOriginalData = JSON.parse(JSON.stringify(data));
  		this.originalBlocks = JSON.parse(JSON.stringify(this.selectedData.blocksData));
      console.log('selectedData', this.selectedData);
      console.log('originalBlocks', this.originalBlocks);
      console.log('blocks', this.blocks);
      // Prepare Data
  	}
    termConfiguration(): any {
  		const searchText: string = this.searchInput.nativeElement.value;
  		return searchText;
  	}
  	loadData() {
      if (!this.loading) {
        this.loading = true;
        this.errorMessage = '';
        let termConfiguration = this.termConfiguration();
        let filterData =  { organizationId: this.selectedOrganization};
        let filterObj = { perpage: this.pageSize, page: this.pageNumber, orderBy:this.orderBy, orderDir: this.orderDir, term:termConfiguration, termfields: ['title'], filter:  filterData};
``
        this.requestService.getDataList(this.dataType, filterObj, (data, error) => {
          if (error) {
            this.errorMessage = error;
            this.layoutUtilsService.showNotification('Error:' + error, 'Dismiss');
          }
          this.loading = false;
          if (data) {
            this.dataList = data.results;
          }
          this.paginatorTotal.next(data.pagination.total);
        });
      }
  	}
    public delete(e, id: any) {
      if(e){
        e.stopImmediatePropagation();
        e.preventDefault();
      }
      if (!this.loading) {
    		const _title: string = this.dataTypeDisplay + ' Delete';
    		const _description: string = 'Are you sure to permanently delete this ' + this.dataTypeDisplay + '?';
    		const _waitDesciption: string = 'Deleting...';

    		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    		dialogRef.afterClosed().subscribe(res => {
    			if (!res) {
    				return;
    			}
          this.realDelete(id);
    		});
      }
  	}
    public realDelete(id: any) {
      const _deleteMessage = this.dataTypeDisplay + ` has been deleted`;
      this.layoutUtilsService.showNotification(_deleteMessage, 'Dismiss');
      if (!this.loading) {
        this.loading = true;
        this.errorMessage = '';
        this.requestService.deleteSingleData(this.dataType, id, (data, error) => {
          if (error) {
            this.errorMessage = error;
            this.layoutUtilsService.showNotification('Error:' + error, 'Dismiss');
          }
          this.loading = false;
          if (data) {
      			this.layoutUtilsService.showNotification(_deleteMessage, 'Dismiss');
            this.loadData();
          }
        });
      }
    }
    public removeWidget(idx: any) {
      this.blocks.splice(idx, 1) ;
  	}
    public deleteWidget(idx: any) {
      this.blocks[idx]['activate'] = false;
  	}
    public unDeleteWidget(idx: any) {
      this.blocks[idx]['activate'] = true;
  	}
    public isValid() {
      // need to add validation
      return true;
    }
    public save() {
      // console.log('this.selectedData', this.selectedData);
      // console.log('this.blocks', this.blocks);
      this.selectedData.blocksData = this.blocks;
      if(this.isValid()){

        this.tileSave("", true, false, false, this.selectedData);
      }else{
        this.layoutUtilsService.showNotification('Fill all required fields', 'Dismiss');
      }
    }
    public preview() {
      const dialogRef = this.dialog.open(ModalPreviewDialogComponent, {
          disableClose: false,
          panelClass: 'myPreviewClass',
          data: {
            title: 'Preview',
            data: 'app/tile/' + this.selectedData._id,
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // nothing to do
        }
      });
    }
    public background() {
      const dialogRef = this.dialog.open(ModalBackgroundDialogComponent, {
          disableClose: false,
          panelClass: 'myBackroundClass',
          data: {
            title: 'TILE BACKGROUNDS',
            data: this.selectedData,
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // nothing to do
          this.selectedData.tileBackgroundPortrait = result.tileBackgroundPortrait;
          this.selectedData.tileBackgroundLandscape = result.tileBackgroundLandscape;
        }
      });
    }
    public icon() {
      const dialogRef = this.dialog.open(ModalGalleryDialogComponent, {
          width: '1600px',
          disableClose: false,
          panelClass: 'myBackroundClass',
          autoFocus: false,
          data: {
            title: 'Image Library',
            data: this.selectedData,
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.selectedData.art = result;
        }
      });
    }
    public checkStartWrapper(type: string) {
      if (type === "startwrapper") {
        this.startWrapper = true;
      }

      return true;
    };
    newTile(message: any, yesBtn: any, noBtn: any, cb: any) {
        this.utils.iAlertConfirm("confirm", "Confirm", message, yesBtn, noBtn, (res) => {
          cb(res["action"]);
        });
    };
    languageChange(langCode: string, saved?: boolean) {
      if (!saved) {
        this.loaderService.display(true);

        this.newTile('Would you like to save your previous work?', 'Save', 'Discard', (action) => {
          if (action === 'confirmText') {
            this.tileSave("", false, false, false, {}, true, langCode);
          } else {
            this.langReset(langCode, true);
          }
        });
      } else {
        if (saved) {
          this.loaderService.display(false);
        }

        this.langReset(langCode);
      }
    };

    langReset(langCode: string, isSpinner?: boolean) {
      this.selectedLanguage = langCode;
      // this.resetTile("", true);

      this.blocks = [];
      if (this.selectedData.blocksData.length > 0) {
        for (let i = 0; i < this.selectedData.blocksData.length; i++) {
          var currentBlock = this.selectedData.blocksData[i];
          var type = this.selectedData.blocksData[i].hasOwnProperty("type") ? this.selectedData.blocksData[i].type : "";
          this.loadWidgets("", type, currentBlock, "");
        }
      }

      if (isSpinner) {
        this.loaderService.display(true);
      }
    };
    public loadWidgets(e, type, blockData, blkName) {
      if (!this.utils.isNullOrEmpty(e)) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
      let viewName = '';
      var result = !this.utils.isNullOrEmpty(blkName) && this.blocks.length > 0 ? this.manageWidgets(type, blkName) : this.checkStartWrapper(type);
      if (type === "text") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "textView";
      }

      if (type === "video") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "videoView";
      }

      if (type === "picture") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "pictureView";
      }

      if (type === "disqus") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "disqusView";
      }

      if (type === "feed") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "feedView";
      }

      if (type === "calendar") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "calendarView";
      }

      if (type === "share") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "shareView";
      }

      if (type === "patients") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "patientsView";
      }

      if (type === "inquiry") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "inquiryView";
      }

      if (type === "survey") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], this.widgetCategories, this.utils, this.selectedOrganization));
        viewName = "surveyView";
      }

      if (type === "questionnaire") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], this.widgetCategories, this.utils, this.selectedOrganization));
        viewName = "questionnaireView";
      }

      if (type === "startwrapper") {
        this.blocks.push( new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "startWrapperView";
      }

      if (type === "title") {
        this.blocks.push( new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "formTitleView";
      }

      if (type === "questions") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], this.widgetCategories, this.utils, this.selectedOrganization));
        viewName = "questionsView";
      }

      if (type === "attendance") {
        this.blocks.push( new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "attendanceView";
      }

      if (type === "confirmation") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "confirmationView";
      }

      if (type === "password") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "passwordView";
      }

      if (type === "next") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));

        viewName = "nextView";
      }

      if (type === "formphoto") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "formPhotoView";
      }

      if (type === "formdocument") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "formDocumentView";
      }

      if (type === "painlevel") {
        this.blocks.push( new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "painLevelView";
      }

      if (type === "drawtool") {
        this.blocks.push( new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "drawToolView";
      }

      if (type === "physician") {
        this.blocks.push( new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "physicianView";
      }

      if (type === "endwrapper") {
        this.blocks.push( new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "endWrapperView";
      }

      if (type === "fill") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "fillView";
      }

      if (type === "notes") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "notesView";
      }

      if (type === "buttons") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "buttonsView";
      }

      if (type === "contactus") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "contactusView";
      }

      if (type === "placefull") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));

        viewName = "placefullView";
      }

      if (type === "addtocart") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "addToCartView";
      }

      if (type === "cart") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "cartView";
      }

      if (type === "blanksform") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "blanksFormView";
      }

      if (type === "exclusiveurl") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "exclusiveUrlView";
      }

      if (type === "fileupload") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "fileUploadView";
      }

      if (type === "pushpay") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "pushPayView";
      }

      if (type === "threedcart") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "threedCartView";
      }

      if (type === "blogs") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "blogsView";
      }

      if (type === "chat") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, [], [], this.utils, this.selectedOrganization));
        viewName = "chatView";
      }

      if (type === "account") {
        this.blocks.push( new BlockOrganizer(blockData, type, this.selectedLanguage, this.profileDatas, [], this.utils, this.selectedOrganization));
        viewName = "accountView";
      }

      if (type === "profile") {
        this.blocks.push(new BlockOrganizer(blockData, type, this.selectedLanguage, this.profileDatas, [], this.utils, this.selectedOrganization));
        viewName = "profileView";
      }
      // console.log('loadWidgets', this.blocks);
  	}
    public moveSubData(isUp, idx) {
      let blocks = JSON.parse(JSON.stringify(this.blocks));
      let newIdx = idx;
      let currentItem = blocks.splice(idx, 1);
  		if(isUp){
        newIdx = newIdx - 1;
      }
      blocks.splice(newIdx, 0 , currentItem[0]);
      this.blocks = JSON.parse(JSON.stringify(blocks));
  	}
    public actionData(idx, dataObject) {
      console.log('clickWidget', idx, dataObject);
      if(dataObject.action === 'imageLibrary'){
        this.galleryLibrary(idx, dataObject);
      }else if(dataObject.action === 'videoLibrary'){
        this.videoLibrary(idx, dataObject);
      }else if(dataObject.action === 'videoThumb'){
        // add thumb upload
      }else{

      }
      // we ,ight need to reset the block this.blocks[idx]=dataObject.block
      console.log('this.blocks', this.blocks[idx]);
  	}

    public galleryLibrary(idx, dataObject) {
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
          let blocks = JSON.parse(JSON.stringify(this.blocks));
          blocks[idx]['data'][dataObject['block']['target']] = result;
          this.blocks = JSON.parse(JSON.stringify(blocks));
        }
      });
    }
    public videoLibrary(idx, dataObject) {
      const dialogRef = this.dialog.open(ModalVideosDialogComponent, {
          width: '1600px',
          disableClose: false,
          panelClass: 'myBackroundClass',
          data: {
            title: 'Video Library',
            data: '',
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if(result.hasOwnProperty('vimeoId')){
            let blocks = JSON.parse(JSON.stringify(this.blocks));
            blocks[idx]['data'][dataObject['block']['target']] = environment.vimeoUrl + result.vimeoId;
            this.blocks = JSON.parse(JSON.stringify(blocks));
          }
        }
      });
    }
    /*   Get Organization profile datas    */
    getOrgProfileDatas() {
        if (!this.loading) {
          this.loading = true;
          this.errorMessage = '';
          this.requestService.getDataLByOrg('tileblock/getprofile', (data, error) => {
            this.loading = false;
            if (error) {
              console.log(error);
            }
            if (data) {
        			this.profileDatas = data.results;
              this.loadData();
            }
          }, true);
        }
    };

    /* Get widget categories */
    getWidgetCategories() {
      this.requestService.getDataLByOrgType('category', 'tileblock' , (data, error) => {
        if (error) {
          console.log(error);
        }
        if (data) {
          this.widgetCategories = data.results;
        }
      }, true);
    };
    getTileCategory() {
      this.requestService.getDataLByOrgType('category', 'tile', (data, error) => {
        if (error) {
          console.log(error);
        }
        if (data) {
          this.tileCategories = data.results;
        }
      }, true);
    };
    getLanguages() {
      this.requestService.getDataL('language', (data, error) => {
        if (error) {
          console.log(error);
        }
        if (data) {
          this.languageList = data.results;
        }
      }, true);
    };

    getThemes() {
      this.requestService.getDataL('template', (data, error) => {
        if (error) {
          console.log(error);
        }
        if (data) {
          this.tileThemes = data.results;
          this.getWhiteTheme();
        }
      }, true);
    };

    getWhiteTheme() {
      this.defaultThemeId = "-1";

      if (this.utils.isArray(this.tileThemes) && this.tileThemes.length > 0) {
        for (let i = 0; i < this.tileThemes.length; i++) {
          var themeObj = this.tileThemes[i];

          if (themeObj.hasOwnProperty("name") && !this.utils.isNullOrEmpty(themeObj["name"]) && this.utils.trim(themeObj["name"].toLowerCase()) === "white") {
            this.defaultThemeId = themeObj["_id"];
            break;
          }
        }
      }

      this.template = this.defaultThemeId;
    };
    setWidgetRights() {
      this.requestService.getSingleData('organization/package', this.selectedOrganization, (data, error) => {
        if (error) {
          console.log(error);
        }
        if (data) {
          if (data && data.length > 0) {
            var packageRights = data[0].hasOwnProperty('rights') && data[0].rights.length > 0 ? data[0].rights : [];

            if (this.utils.isArray(packageRights) && packageRights.length > 0) {
              for (let i = 0; i < packageRights.length; i++) {
                this.widgetRights.push(packageRights[i].toLowerCase().replace(/ /g, ''))
              }
            }
          }
        }
      });
    };
    manageWidgets(currentWidget: string, widgetName: string) {
      if (this.widgetRights.length > 0) {
        var widgetBlockName = widgetName.toLowerCase().replace(/\s+/g, '');
        var rightIndex = this.widgetRights.indexOf(widgetBlockName);

        if (rightIndex == -1) {
          var orgIndex = this.organizations.map(b => {
            return b['_id'];
          }).indexOf(this.selectedOrganization);

          var orgName = orgIndex !== -1 ? this.organizations[orgIndex]["name"] : "";
          this.utils.iAlert('info', 'Information', orgName + ' does not have access to this widget');
          return false;
        }
      }

      var formGroupCheck = 0;
      var formOneCheck = 0;
      var exclusiveCheck = 0;
      var displayCheck = 0;
      var forms = ['title', 'account', 'attendance', 'survey', 'questionnaire', 'questions', 'confirmation', 'inquiry', 'profile', 'password', 'next', 'user', 'formphoto', 'mobilevideo', 'physician'];
      var formsOne = ['fill', 'notes', 'buttons', 'contactus', 'placefull', 'addtocart', 'cart', 'blanksform'];
      var displayWigets = ['text', 'video', 'image', 'url', 'picture', 'disqus', 'feed', 'calendar'];
      var exclusiveWidgets = ['exclusiveurl', 'fileupload', 'pushpay', 'threedcart', 'blogs', 'chat'];
      var formIndex = forms.indexOf(currentWidget);
      var formsOneIndex = formsOne.indexOf(currentWidget);
      var displayIndex = displayWigets.indexOf(currentWidget);
      var exclusiveIndex = exclusiveWidgets.indexOf(currentWidget);
      var blogsChk = false;

      if (currentWidget == 'startwrapper') {
        if (!this.startWrapper) {
          this.startWrapper = true

          return true;
        } else {
          this.utils.iAlert("info", "Information", "Start wrapper already added");
        }

        return false;
      }

      var currentBlock = this.blocks[this.blocks.length - 1];
      var lastBlock = currentBlock;
      var lastType = lastBlock["type"];

      if (!this.startWrapper && currentWidget === "confirmation") {
        if (lastType === "survey" || lastType === "questionnaire") {
          var isSingle = false;

          if (lastType === "survey") {
            isSingle = lastBlock["data"]["multiple"] === "false" ? true : false;
          }

          if (lastType === "questionnaire") {
            isSingle = lastBlock["data"]["questionType"] === "single" ? true : false;
          }

          if (isSingle) {
            if (lastType === "survey") {
              for (let i = 0; i < lastBlock["data"]["questions"].length; i++) {
                lastBlock["data"]["confirmation"].push("");
              }
            }

            if (lastType === "questionnaire") {
              for (let i = 0; i < lastBlock["data"]["options"].length; i++) {
                lastBlock["data"]["confirmation"].push("");
              }
            }
          }

          return false;
        }
      }

      if (currentWidget == "endwrapper" && lastType == "startwrapper") {
        this.utils.iAlert("info", "Information", "No forms inside this group. Add form to close this group");

        return false;
      }

      if (currentWidget == "confirmation" && lastType == "next") {
        this.utils.iAlert("info", "Information", "Next Tile already added in this group!!!");
        return false;
      }

      if (currentWidget == "next" && lastType == "confirmation") {
        this.utils.iAlert("info", "Information", "Confirmation already added in this group!!!");
        return false;
      }

      var linkForm = this.blocks.filter(b => {
        return b["type"] === "title";
      });

      if (currentWidget === "next" && this.startWrapper && linkForm.length > 0) {
        var linkBlock = linkForm[0];

        if (linkBlock[0]["data"]["title"]) {
          this.utils.iAlert("info", "Information", "Next Widget cannot combine with linkable forms!!!");
          return false;
        }
      }

      if (currentWidget == 'endwrapper') {
        if (this.startWrapper) {
          this.startWrapper = false

          return true;
        } else {
          this.utils.iAlert("info", "Information", "No Start wrapper added!! Click start to end wrapper !!");
        }

        return false;
      }

      if (lastType === "next" && currentWidget == 'next') {
        this.utils.iAlert("info", "Information", "You cannot add Next widget after Next widget");

        return false;
      }

      if (lastType === "next" && lastBlock["data"]["type"] === "tile") {
        this.utils.iAlert("info", "Information", "You cannot add widget after Next widget");
        return false;
      }

      if (this.startWrapper && (currentWidget === "title" || currentWidget === "confirmation" || currentWidget === "next")) {
        var grpIdx = -1;
        var confirmIndex = -1;
        var nextIndex = -1;
        var nextWidgetIndex = -1;
        var titleIndex = -1;

        for (let i = this.blocks.length - 1; 0 <= i; i--) {
          if (this.blocks[i]["type"] === "title") {
            titleIndex = i;
          }

          if (this.blocks[i]["type"] === "confirmation") {
            confirmIndex = i;
          }

          if (this.blocks[i]["type"] === "next") {
            nextIndex = i;
          }

          if (this.blocks[i]["type"] === "startwrapper") {
            grpIdx = i;
            break;
          }
        }

        nextWidgetIndex = this.blocks.length - 1 > grpIdx ? grpIdx + 1 : -1;

        if (currentWidget == "next" && nextIndex !== -1) {
          this.utils.iAlert("info", "Information", "Next Tile already added in this group. Please end wrapper to close this group");
          return false;
        }

        if (currentWidget == "confirmation" && nextIndex !== -1) {
          this.utils.iAlert("info", "Information", "Confirmation already added in this group. Please end wrapper to close this group");
          return false;
        }

        if (lastType === "confirmation" || lastType === "next") {
          this.utils.iAlert("info", "Information", "Please end wrapper to close this group for adding this widget");

          return false;
        }

        if (nextWidgetIndex !== -1 && (currentWidget != "confirmation" && currentWidget != "next") && lastType != "startwrapper") {
          var nextType = this.blocks[nextWidgetIndex]["type"];

          if (nextType == "title" && titleIndex !== -1) {
            this.utils.iAlert("info", "Information", "One title is allowed inside the group");
          } else {
            this.utils.iAlert("info", "Information", "Title will be in the top inside the group");
          }

          return false;
        }
      }

      if (formsOneIndex !== -1 && this.startWrapper) {
        this.utils.iAlert("info", "Information", "A restricted widget cannot be combined with a form widget");
        return false;
      }

      if (displayIndex !== -1 && this.startWrapper) {
        this.utils.iAlert("info", "Information", "This widget cannot be used inside of a Form Wrapper");
        return false;
      }

      for (let i = 0; i < forms.length; i++) {
        var formIndx = this.blocks.map(b => {
          return b['type'];
        }).indexOf(forms[i]);

        if (formIndx !== -1) {
          formGroupCheck++;
        }
      }

      for (let i = 0; i < formsOne.length; i++) {
        var formOneIndx = this.blocks.map(b => {
          return b['type'];
        }).indexOf(formsOne[i]);

        if (formOneIndx !== -1) {
          formOneCheck++;
        }
      }

      for (let i = 0; i < exclusiveWidgets.length; i++) {
        var exclusiveWidgetsIndx = this.blocks.map(b => {
          return b['type'];
        }).indexOf(exclusiveWidgets[i]);

        if (exclusiveWidgetsIndx !== -1) {
          exclusiveCheck++;
        }
      }

      for (let i = 0; i < displayWigets.length; i++) {
        var displayWigetsIndx = this.blocks.map(b => {
          return b['type'];
        }).indexOf(displayWigets[i]);

        if (displayWigetsIndx !== -1) {
          displayCheck++;

          if (displayWigets[i] === "blogs") {
            blogsChk = true;
          }
        }
      }

      if ((formGroupCheck > 0 && formsOneIndex !== -1) || (formsOneIndex !== -1 && formOneCheck > 0) || (formOneCheck > 0 && formIndex !== -1)) {
        if ((formGroupCheck > 0 && formsOneIndex !== -1)) {
          this.utils.iAlert("info", "Information", "A Restricted widget cannot be combined with a Form widget");
          return false;
        }

        if (formOneCheck > 0 && formIndex !== -1) {
          this.utils.iAlert("info", "Information", "A Form widget cannot be added in the same Tile with Restricted widgets");
          return false;
        }
      }

      if (exclusiveIndex !== -1 || exclusiveCheck > 0) {
        if ((formGroupCheck > 0 || formOneCheck > 0 || displayCheck > 0) || (formIndex !== -1 || formsOneIndex !== -1 || displayIndex !== -1)) {
          this.utils.iAlert("info", "Information", "An exclusive widget cannot be combined with other widgets");
          return false;
        }

        if (exclusiveCheck > 0) {
          this.utils.iAlert("info", "Information", "An exclusive widget cannot be added with same exclusive widgets");
          return false;
        }
      }

      if (blogsChk && currentWidget === "blogs") {
        this.utils.iAlert("info", "Information", "Blog already exists");
        return false;
      }

      if (this.startWrapper && currentWidget === 'profile') {
        var startIdx = -1;

        for (let i = this.blocks.length - 1; 0 <= i; i--) {
          if (this.blocks[i]["type"] === "startwrapper") {
            startIdx = i;
            break;
          }
        }

        if (startIdx !== -1) {
          var clearEnabled = this.blocks[startIdx]["data"]["refresh"];

          if (clearEnabled) {
            this.utils.iAlert("info", "Information", "Unable to add profile widget with clear fields");
            return false;
          }
        }
      }

      return true;
    };

    startEndWrapperCheck() {
      let currentBlocks: any = this.blocks;
      let wrapper: any = {
        "startWrapper": 0,
        "endWrapper": 0,
        "passed": 0,
        "failed": 0
      }

      for (let i = 0; i < currentBlocks.length; i++) {
        if (currentBlocks[i].hasOwnProperty("block") && currentBlocks[i].hasOwnProperty("type")) {
          var type = currentBlocks[i]["type"];

          if (type === "startwrapper") {
            wrapper["startWrapper"] = wrapper["startWrapper"] + 1;
          } else if (type === "endwrapper") {
            wrapper["endWrapper"] = wrapper["endWrapper"] + 1;
          }

          if (wrapper["startWrapper"] === 1 && wrapper["endWrapper"] == 1 && type === "endwrapper") {
            wrapper["startWrapper"] = 0;
            wrapper["endWrapper"] = 0;

            wrapper["passed"] = wrapper["passed"] + 1;
          }


          if ((wrapper["startWrapper"] > 1 || wrapper["endWrapper"] > 1) || (wrapper["startWrapper"] === 1 && wrapper["endWrapper"] == 1 && type === "startWrapper") || (i === currentBlocks.length - 1 && (wrapper["startWrapper"] === 1 || wrapper["endWrapper"] === 1))) {
            wrapper["failed"] = 1;
            break;
          }
        }
      }


      return wrapper["failed"] === 1 ? false : true;
    };
    assignExistsLanguage(langCode?: string) {
      if (langCode) {
        let currLang: string = this.selectedLanguage;
        this.selectedLanguage = langCode;

        setTimeout(() => {
          this.selectedLanguage = currLang;
        });
      }
    };
    tileSave(e: any, isUpdate?: boolean, isDuplicate?: boolean, updated?: boolean, newTileObj?: Object, langSave?: boolean, langCode?: string) {
      if (!this.utils.isNullOrEmpty(e)) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.loaderService.display(true);

      let updateId: string = "-1";
      let tileObj: any = this.selectedData;

      if (!isUpdate && isDuplicate) {
        if (updated) {
          updateId = tileObj["_id"];
        }

        tileObj["title"] = "Copy of " + tileObj["title"];
        delete tileObj["_id"];
      }

      if (this.utils.isNullOrEmpty(tileObj["title"])) {
        this.utils.iAlert('error', 'Information', 'You must at least enter a Tile title');
        this.assignExistsLanguage(langCode);
        this.loaderService.display(false);
        return false;
      }

      if (tileObj["category"] === "-1") {
        this.utils.iAlert('error', 'Information', 'Please select a category for the Tile');
        this.assignExistsLanguage(langCode);
        this.loaderService.display(false);
        return false;
      }
      this.checkTileOrgs(tileObj, (currTileObj: any, deleteId: any) => {
        let isBlk: boolean = currTileObj.hasOwnProperty("_id") ? false : true;

        // this.saveBlocks(isBlk, (blks: any, isChat: any) => {
        //   currTileObj["blocks"] = blks.length > 0 ? blks.map(b => b["_id"]) : [];
        //   currTileObj["isChat"] = isChat;
        //
        //   let selectedLanguage: string = this.selectedLanguage;
        //
        //   if (selectedLanguage !== "en") {
        //     currTileObj[selectedLanguage] = {};
        //     currTileObj[selectedLanguage]["title"] = this.selectedData.title;
        //     currTileObj[selectedLanguage]["notes"] = this.selectedData.notes;
        //     currTileObj[selectedLanguage]["rtl"] = this.rtl;
        //
        //     if (currTileObj.hasOwnProperty("_id")) {
        //       delete currTileObj["title"];
        //       delete currTileObj["notes"];
        //       delete currTileObj["rtl"];
        //     }
        //   }
        //   this.saveTile(currTileObj, deleteId, blks, isUpdate, isDuplicate, updateId, newTileObj, langSave, langCode);
        // });
        // we need to check the chat thing
        this.saveTile(currTileObj, deleteId, [], isUpdate, isDuplicate, updateId, newTileObj, langSave, langCode);
      });
    };
    checkTileOrgs(tile: any, cb: any) {
      let deleteId: string = "-1";

      if (tile.hasOwnProperty("_id")) {
        let id: any = tile["_id"];
        let orgs: any = tile["organizationId"];
        let createdOrg: any = tile["createdOrg"];

        if (orgs.length > 0) {
          this.organizationCheck(createdOrg, orgs, (result1: any, result2: any) => {
            if ((result1 === 0 && result2 === 0) || (result1 === 2 && result2 === 2)) {
              let obj2: any = !this.utils.isEmptyObject(this.selectedData) ? Object.assign({}, this.selectedData) : {};
              let title: string = this.selectedData.title;

              if (title === obj2["title"]) {
                this.utils.iAlert('error', 'Error', 'Please Modify the Tile name');
                return false;
              }

              tile["createdOrg"] = this.selectedOrganization;
              tile["organizationId"] = [this.selectedOrganization];
              delete tile["_id"];

            } else if (result1 === 1 && result2 === 0) {
              let tileId: string = tile["_id"];
              deleteId = tileId;
              let currOrgs: any = tile["organizationId"];
              let orgIdx: number = currOrgs.indexOf(this.selectedOrganization);
              currOrgs.splice(orgIdx, 1);
              let updateData: any = { "organizationId": currOrgs };
              if (!this.loading) {
                this.loading = true;
                this.errorMessage = '';
                this.requestService.saveData(this.dataType, updateData, (data, error) => {
                  if (error) {
                    this.errorMessage = error;
                    this.layoutUtilsService.showNotification('Error:' + error, 'Dismiss');
                  }
                  if (data) {
          						this.layoutUtilsService.showNotification('Profile Updated', 'Dismiss');
                  }
                  this.loading = false;
                });
              }
              // this.requestService.tileUpdate(tileId, updateData);
              tile["createdOrg"] = this.selectedOrganization;
              tile["organizationId"] = [this.selectedOrganization];
              delete tile["_id"];
            }

            cb(tile, deleteId);
          });
        }
      } else {
        cb(tile, deleteId);
      }
    };
    saveBlocks(isNewBlock: boolean, cb: any) {
      // let currentBlocks: any = this.blocks;
      // let blckObj: any = new GetBlocks(currentBlocks, this.selectedLanguage, isNewBlock, this.utils);
      // let blkDataObjs: any = blckObj.getBlockDatas();
      // blkDataObjs["blocks"] = this.assignIndexes(blkDataObjs["blocks"]);
      // let savedBlocks: any[] = [];
      //
      // if (blkDataObjs["blocks"].length > 0) {
      //   this.tileService.saveTileBlocks(blkDataObjs["blocks"])
      //     .then(resBlks => {
      //       if (this.utils.isArray(resBlks) && resBlks.length > 0) {
      //         resBlks = this.arrangeBlocks(resBlks);
      //         cb(resBlks, blkDataObjs["isChat"]);
      //       }
      //     });
      // } else {
      //   cb([], false);
      // }
    };
    assignIndexes(blks: any[]) {
      for (let i = 0; i < blks.length; i++) {
        blks[i]["index"] = i;
      }

      return blks;
    };
    arrangeBlocks(currBlks: any[]) {
      let arrangedBlocks: any[] = this.utils.sortArray(currBlks, true, "index");

      for (let i = 0; i < arrangedBlocks.length; i++) {
        delete arrangedBlocks[i]["index"];
      }

      return arrangedBlocks;
    };
    saveTile(tileObj: Object, deleteId?: string, savedBlocks?: any[], isUpdate?: boolean, isDuplicate?: boolean, updatedId?: string, newTileObj?: Object, langSave?: boolean, langCode?: string) {
      console.log('saveTile', tileObj);
      this.loaderService.display(false);
      // if (!this.utils.isEmptyObject(tileObj)) {
      //   this.tileService.saveTile(tileObj)
      //     .then(resTile => {
      //       if (!this.utils.isEmptyObject(resTile) && resTile.hasOwnProperty("_id") && !this.utils.isNullOrEmpty(resTile["_id"])) {
      //         if (!isUpdate && !isDuplicate && !langSave) {
      //           let isNew: boolean = tileObj.hasOwnProperty("_id") ? false : true;
      //           this.tileIdsUpdate = {};
      //           this.tileIdsDelete = [];
      //           //var obj = {};
      //           //obj[resTile["_id"]] = isNew;
      //           this.tileIdsUpdate[resTile["_id"]] = isNew;
      //
      //           if (!this.utils.isNullOrEmpty(deleteId) && deleteId !== "-1") {
      //             this.tileIdsDelete = [deleteId];
      //           }
      //
      //           let tileMessage: string = tileObj.hasOwnProperty("_id") ? "updated" : "saved";
      //           this.loaderShared.showSpinner(false);
      //           this.utils.iAlert('success', '', 'Tile ' + tileMessage + ' successfully');
      //           this.assignBlockData(savedBlocks);
      //         } else if (!isUpdate && isDuplicate) {
      //           this.tileIdsUpdate = {};
      //           this.tileIdsDelete = [];
      //           this.tileIdsUpdate[resTile["_id"]] = true;
      //
      //           if (updatedId !== "-1") {
      //             this.tileIdsUpdate[updatedId] = false;
      //           }
      //
      //           this.loaderShared.showSpinner(false);
      //           this.utils.iAlert('success', '', 'Tile duplicated successfully');
      //           this.assignBlockData(savedBlocks);
      //         } else if (isUpdate && isDuplicate) {
      //           this.tileSave("", false, true, true);
      //         } else if (isUpdate && !isDuplicate) {
      //           let isNew: boolean = tileObj.hasOwnProperty("_id") ? false : true;
      //           this.tileIdsUpdate = {};
      //           this.tileIdsUpdate = { "noEmit": true };
      //           this.tileIdsUpdate[resTile["_id"]] = isNew;
      //           this.setTileContent(newTileObj, true);
      //         } else if (langSave) {
      //           let isNew: boolean = tileObj.hasOwnProperty("_id") ? false : true;
      //           this.tileIdsUpdate = {};
      //           this.tileIdsUpdate = { "isLang": true };
      //           this.tileIdsUpdate[resTile["_id"]] = isNew;
      //           this.assignBlockData(savedBlocks);
      //
      //           this.languageChange(langCode, true);
      //         }
      //       }
      //     });
      // }
    };
    organizationCheck(createdOrg: string, orgs: any[], cb) {
      var orgsMatchChk = orgs.indexOf(this.selectedOrganization);
      if (orgsMatchChk === -1) {
        var html = '';
        var orgNames = this.getOrganizationName(orgs).split(',');
        html += "<ul style='text-align: left;'>";

        for (let i = 0; i < orgNames.length; i++) {
          html += '<li>' + orgNames[i] + '</li>';
        }

        html += "</ul>";

        this.utils.iQuestions("question", "Warning", "This tile was assigned to the organizations : " + html + ".<br>If you choose to modify it, it will create a new copy in this organization.", "Save as new copy", "Cancel", "", (r) => {
          if (r["resolved"] === 0) {
            cb(0, 0);
          }
        });
      } else if (typeof orgs !== 'string' && orgs[0] !== this.selectedOrganization) {
        this.utils.iQuestions("question", "Warning", "This tile was linked originally to <b>" + this.getOrganizationName(orgs[0].split(',')) + "</b>.<br>If you choose to modify it, it will create a new copy.<br>If the original tile is used in one of your Events or Pages, it will be removed. You may use the newly created copy in the Event or page.", "Save and delete original", "Cancel", "", (r) => {
          if (r["resolved"] === 0) {
            cb(1, 0);
          }
        });
      } else if (typeof orgs !== 'string' && orgs.length > 1 && orgs[0] === this.selectedOrganization) {
        var html = '';
        var orgNames = this.getOrganizationName(orgs).split(',');
        html += "<ul style='text-align: left;'>";

        for (let i = 0; i < orgNames.length; i++) {
          html += '<li>' + orgNames[i] + '</li>';
        }

        html += "</ul>";

        this.utils.iQuestions("question", "Warning", "Saving this Tile will modify the content in the following organizations:" + html, "Continue", "Cancel", "Save as a copy", (r) => {
          if (r["resolved"] === 0 || r["resolved"] === 2) {
            cb(2, r["resolved"]);
          }
        });
      } else {

        cb(2, 1);
      }
    };
    getOrganizationName(orgs: string[], currentOrg?: string) {
      let orgNames: any[] = [];

      for (let i = 0; i < this.organizations.length; i++) {
        let currOrg: any = this.organizations[i];
        let orgId: string = currOrg["_id"];
        let orgIdx: number = orgs.indexOf(orgId);

        if (orgIdx !== -1 && (this.utils.isNullOrEmpty(currentOrg) || (currOrg._id !== currentOrg))) {
          orgNames.push(currOrg["name"]);
        }
      }

      return orgNames.join(",");
    };
}
