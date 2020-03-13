import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BlockComponent } from '../block-organizer';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { LoaderService } from '../../../../shared/services';
import { DomSanitizer } from '@angular/platform-browser';
import { Utils } from '../../../../shared/helpers/utils';
import { ModalVideosDialogComponent } from '../../../../shared/components/custom-videos-dialog/custom-videos-dialog.component';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'video-block',
    templateUrl: './video-block.component.html',
    styleUrls: ['../tileblocks.component.scss', './video-block.component.scss']
})
export class VideoBlockComponent implements BlockComponent {
  @Input() block: any;
  @Output() videoView = new EventEmitter<any>();
  constructor(public sanitizer: DomSanitizer, public utils: Utils, private loaderService: LoaderService,
  public dialog: MatDialog) {}

  getVideo(view: any) {
    this.videoView.emit(view);
  };


  // videoLibrary(e: any, target: string) {
  //   e.preventDefault();
  //   var blk = { "target": target };
  //   this.videoView.emit({'action': 'videoLibrary', block: blk});
  // }

  videoThumb(e: any, opt: string) {
    e.preventDefault();

    var blk = { "opt": opt };
    this.videoView.emit({'action': 'videoThumb', block: blk});
  };

  checkDisabled(e?: any) {
    return !this.utils.isNullOrEmpty(this.block.data.url) ? true : false;
  }
  public videoLibrary(e: any, target: string) {
    e.preventDefault();
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
          this.block.data[target] = environment.vimeoUrl + result.vimeoId;
          this.block.data['videoid'] = result.vimeoId;
          // this.block.data['dataid'] = result.vimeoId; // where to get this ask udhay
        }
      }
    });
  }
}
// {"caption":"test","url":"https://player.vimeo.com/video/160844822","videoid":"160844822","dataid":"56fb65124c4d9d292fdc0a2d"}}
