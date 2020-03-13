import { Injectable } from '@angular/core';
import { Http, Response, Headers, Request, RequestMethod, RequestOptions } from '@angular/http';
import { Router} from '@angular/router';
import { BehaviorSubject, Observable  } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Dictionary } from './interface';
import { ContentType } from './enums';
import { StoreService } from './store.service';
import { Utils } from '../helpers/utils';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { urlSafeBase64Encoding } from '../helpers';

@Injectable()
export class RequestService {
  private authURL = environment.serverUrl;
  private token: any = '';
  private userType: string = 'default';
  public orgId: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
  public appStatusSubject: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
  public authenticatedUser: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private cachedObj = {};
  public currentUserSubject: BehaviorSubject<any | undefined> = new BehaviorSubject<any | undefined>(undefined);
  public _currentUser: any | undefined = undefined;
  set currentUser(currentUser: any | undefined) {
    if (currentUser) {
      this._currentUser = currentUser;
      let userObject: any = currentUser;
      this.userType = currentUser.type || 'default';
      this.store.init( 'default_' + userObject._id);
      this.orgId.next(this.store.get('orgId'));
      this.setToken(userObject.token);
      this.currentUserSubject.next(userObject);
      // this.store.set('te', 'temp');
      // this.permissionsService.flushPermissions();
      // this.permissionsService.addPermission(userObject.role.uid);
    } else {
      this._currentUser = undefined;
      this.currentUserSubject.next(undefined);
      this.token = '';
      this.userType = 'default';
      this.store.init('default');
      // this.permissionsService.flushPermissions();
    }
  }
  get currentUser(): any | undefined {
    return this._currentUser;
  }
  public updateCurrentUser(newData: any) {
    let objectUser = Object.assign( this._currentUser, newData);
    this.currentUser = objectUser;
  }
  constructor(private utils: Utils, public store: StoreService, private router: Router, private http: Http,
  private permissionsService: NgxPermissionsService) {
      this.store.init('Anonomous');
  }
  public loggedIn() {
    if (this.currentUser) {
      return true;
    } else {
      return false;
    }
  }
  public getUserType() {
    return this.userType;
  }
  public getUserId() {
    if (this.currentUser && this.currentUser.hasOwnProperty('_id')) {
      return this.currentUser['_id'];
    } else {
      return '';
    }
  }
  public setToken(token: any) {
    this.token = token;
  }
  public addLanguageToURL(url: string, lang?: string): string {
    // if (url) {
    //   let langEnd = lang;
    //   if (langEnd === undefined) {
    //       langEnd = 'en';
    //   }
    //   if (~url.indexOf('?')) {
    //     url += '&locale=' + langEnd;
    //   } else {
    //     url += '?locale=' + langEnd;
    //   }
    //   return url;
    // } else {
    //   return '';
    // }
    return url;
  }
  public logout() {
    localStorage.removeItem('currentUser');
    this.appStatusSubject.next(undefined);
    this.currentUser = undefined;
    //this.router.navigate(['/login']); // when we use this as the main angular we can un comment
  }
  public getMe(callback: (dataResponse: any | undefined,
    requestError: any | undefined) => void, lang?: string) {
      let urlStr = this.authURL + 'me' ;
      urlStr = this.addLanguageToURL(urlStr, lang);
      this.jsonGetRequest(urlStr, (jsonObj, error) => {
          if (error !== undefined) {
              callback(undefined, error);
              return;
          }
          if (jsonObj) {
            if (jsonObj.status) {
              let userObject = jsonObj.results;
              callback(userObject, undefined);
            }else {
              if(jsonObj.hasOwnProperty('type')){
                  this.appStatusSubject.next(jsonObj.type);
              }
              callback(undefined, jsonObj.message);
            }
          } else {
            callback(undefined, 'Data error from server ');
          }
      });
  }
  public requestLogin(username: string, password: string, callback: (dataResponse: any | undefined,
    requestError: any | undefined, returnIt: boolean) => void, lang?: string) {
      let encodedPassword = urlSafeBase64Encoding(password); // make it from backend
      let urlStr = this.authURL + 'user/login?email=' + username + '&password=' + password ;
      urlStr = this.addLanguageToURL(urlStr, lang);
      this.jsonGetRequest(urlStr, (jsonObj, error) => {
          if (error !== undefined) {
            if(jsonObj.hasOwnProperty('return')){
              callback(undefined, error, jsonObj.return);
            }else{
              callback(undefined, error, false);
            }
              return;
          }
          if (jsonObj) {
            if (jsonObj.status) {
              let userObject = jsonObj.results;
              this.setToken(jsonObj.token);
              userObject['token'] = jsonObj.token;
              callback(userObject, undefined, false);
            } else {
              if(jsonObj.hasOwnProperty('return')){
                callback(undefined, jsonObj.message, jsonObj.return);
              }else{
                callback(undefined, jsonObj.message, false);
              }
            }
          } else {
            callback(undefined, 'Data error from server ', false);
          }
      });
  }
  public validateUser(callback: (dataResponse: any | undefined,
    requestError: any | undefined) => void, lang?: string) {
      let urlStr = this.authURL + 'user/valid' ;
      callback(true, undefined);
      // this.jsonGetRequest(urlStr, (jsonObj, error) => {
      //     if (error !== undefined) {
      //         callback(undefined, error);
      //         return;
      //     }
      //     if (jsonObj) {
      //       if (jsonObj.status) {
      //         callback(true, undefined);
      //       }else {
      //         callback(undefined, jsonObj.message);
      //       }
      //     } else {
      //       callback(undefined, 'Data error from server ');
      //     }
      // });
  }
  private toBase64(stringToSign: string) {
    let base64 = btoa(stringToSign);
    return base64;
  }
  public getMetaData(type: string, feilds: any[], callback: (dataResponse: any | undefined, requestError: any | undefined) => void, lang?: string) {
    let urlStr = this.authURL  + type + '/metadata';
    if(feilds){
      urlStr = urlStr + '?fields=' + feilds
    }
    urlStr = this.addLanguageToURL(urlStr, lang);
    this.jsonGetRequest(urlStr, (jsonObj, error) => {
        if (error !== undefined) {
            callback(undefined, error);
            return;
        }
        if (jsonObj) {
          if (jsonObj.status) {
            callback(jsonObj, undefined);
          }else {
            if(jsonObj.hasOwnProperty('type')){
                this.appStatusSubject.next(jsonObj.type);
            }
            callback(undefined, jsonObj.message);
          }
        } else {
            callback(undefined, error);
        }
    });
  }
  public saveData(type: string, data: any, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, lang?: string) {
    if (data.hasOwnProperty('_id') && data._id) {
      let urlStr = this.authURL + type + '/update/' + data._id;
      this.jsonRequest(urlStr, (jsonObj, error) => {
          if (error !== undefined) {
              callback(undefined, 'Server Error!');
              return;
          }
          if (jsonObj) {
            if (jsonObj.status) {
              callback(jsonObj, undefined);
            }else {
              if(jsonObj.hasOwnProperty('type')){
                  this.appStatusSubject.next(jsonObj.type);
              }
              callback(undefined, jsonObj.message);
            }
          } else {
              callback(undefined, error);
          }
      }, RequestMethod.Post, data);
    } else {
      let urlStr = this.authURL + type;
      // urlStr = this.addLanguageToURL(urlStr, lang);
      this.jsonRequest(urlStr, (jsonObj, error) => {
          if (error !== undefined) {
              callback(undefined, 'Server Error!');
              return;
          }
          if (jsonObj) {
            if (jsonObj.status) {
              callback(jsonObj, undefined);
            }else {
              if(jsonObj.hasOwnProperty('type')){
                  this.appStatusSubject.next(jsonObj.type);
              }
              callback(undefined, jsonObj.message);
            }
          } else {
              callback(undefined, error);
          }
      }, RequestMethod.Post, data);
    }
  }
  public cropImageByOrg(data: any, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, lang?: string) {
      let urlStr = this.authURL + 'img/crop/' + this.orgId.getValue();
      // urlStr = this.addLanguageToURL(urlStr, lang);
      this.jsonRequest(urlStr, (jsonObj, error) => {
          if (error !== undefined) {
              callback(undefined, 'Server Error!');
              return;
          }
          if (jsonObj) {
            if (jsonObj.status) {
              callback(jsonObj, undefined);
            }else {
              if(jsonObj.hasOwnProperty('type')){
                  this.appStatusSubject.next(jsonObj.type);
              }
              callback(undefined, jsonObj.message);
            }
          } else {
              callback(undefined, error);
          }
      }, RequestMethod.Post, data);
  }
  public getSingleData(type: string, id: any, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, lang?: string) {
    let urlStr = this.authURL  + type + '/' + id;
    urlStr = this.addLanguageToURL(urlStr, lang);
    this.jsonGetRequest(urlStr, (jsonObj, error) => {
        if (error !== undefined) {
            callback(undefined, error);
            return;
        }
        if (jsonObj) {
          if (jsonObj.status) {
            callback(jsonObj, undefined);
          }else {
            if(jsonObj.hasOwnProperty('type')){
                this.appStatusSubject.next(jsonObj.type);
            }
            callback(undefined, jsonObj.message);
          }
        } else {
            callback(undefined, error);
        }
    });
  }
  public getMySingleData(type: string, id: any, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, lang?: string) {
    let urlStr = this.authURL + type + '/' + id;
    urlStr = this.addLanguageToURL(urlStr, lang);
    this.jsonGetRequest(urlStr, (jsonObj, error) => {
        if (error !== undefined) {
            callback(undefined, error);
            return;
        }
        if (jsonObj) {
          if (jsonObj.status) {
            callback(jsonObj, undefined);
          }else {
            if(jsonObj.hasOwnProperty('type')){
                this.appStatusSubject.next(jsonObj.type);
            }
            callback(undefined, jsonObj.message);
          }
        } else {
            callback(undefined, error);
        }
    });
  }
  public deleteSingleData(type: string, id: any, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, lang?: string) {
    let urlStr = this.authURL + type + '/' + id + '/delete';
    urlStr = this.addLanguageToURL(urlStr, lang);
    this.jsonRequest(urlStr, (jsonObj, error) => {
        if (error !== undefined) {
            callback(undefined, error);
            return;
        }
        if (jsonObj) {
          if (jsonObj.status) {
            callback(jsonObj, undefined);
          }else {
            if(jsonObj.hasOwnProperty('type')){
                this.appStatusSubject.next(jsonObj.type);
            }
            callback(undefined, jsonObj.message);
          }
        } else {
            callback(undefined, error);
        }
    }, RequestMethod.Post);
  }
  public deleteImageDataByOrg(type: string, id: any, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, lang?: string) {
    let urlStr = this.authURL + type + '/delete/' + this.orgId.getValue();
    urlStr = this.addLanguageToURL(urlStr, lang);
    let objData = {
      // folder: "string",
      url: id
    };
    this.jsonRequest(urlStr, (jsonObj, error) => {
        if (error !== undefined) {
            callback(undefined, error);
            return;
        }
        if (jsonObj) {
          if (jsonObj.status) {
            callback(jsonObj, undefined);
          }else {
            if(jsonObj.hasOwnProperty('type')){
                this.appStatusSubject.next(jsonObj.type);
            }
            callback(undefined, jsonObj.message);
          }
        } else {
            callback(undefined, error);
        }
    }, RequestMethod.Post, objData);
  }
  public deleteBackgroundImageData(type: string, id: string, imageUrl: string, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, lang?: string) {
    let urlStr = this.authURL + 'img/delete/' + id + '/tilebackground';
    let data = {
      type: type,
      imageUrl: imageUrl
    };
    urlStr = this.addLanguageToURL(urlStr, lang);
    this.jsonRequest(urlStr, (jsonObj, error) => {
        if (error !== undefined) {
            callback(undefined, error);
            return;
        }
        if (jsonObj) {
          if (jsonObj.status) {
            callback(jsonObj, undefined);
          }else {
            if(jsonObj.hasOwnProperty('type')){
                this.appStatusSubject.next(jsonObj.type);
            }
            callback(undefined, jsonObj.message);
          }
        } else {
            callback(undefined, error);
        }
    }, RequestMethod.Post, data);
  }
  public getDataListByGet(type: string, conf: any, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, lang?: string) {
    let urlStr = this.authURL + type + '/list';
    // let urlStr = this.authURL + 'app/' + type;
    urlStr = this.addLanguageToURL(urlStr, lang);
    this.jsonGetRequest(urlStr, (jsonObj, error) => {
        if (error !== undefined) {
            callback(undefined, error);
            return;
        }
        if (jsonObj) {
          if (jsonObj.status) {
            callback(jsonObj, undefined);
          }else {
            if(jsonObj.hasOwnProperty('type')){
                this.appStatusSubject.next(jsonObj.type);
            }
            callback(undefined, jsonObj.message);
          }
        } else {
            callback(undefined, error);
        }
    });
  }
  public getDataListByOrgByGet(type: string, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, lang?: string) {
    let urlStr = this.authURL + type + '/list/' + this.orgId.getValue();
    // let urlStr = this.authURL + 'app/' + type;
    urlStr = this.addLanguageToURL(urlStr, lang);
    this.jsonGetRequest(urlStr, (jsonObj, error) => {
        if (error !== undefined) {
            callback(undefined, error);
            return;
        }
        if (jsonObj) {
          if (jsonObj.status) {
            callback(jsonObj, undefined);
          }else {
            if(jsonObj.hasOwnProperty('type')){
                this.appStatusSubject.next(jsonObj.type);
            }
            callback(undefined, jsonObj.message);
          }
        } else {
            callback(undefined, error);
        }
    });
  }
  public getDataList(type: string, conf: any, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, source: string = '', sourceTarget: string = '', lang?: string) {
    let cleanConf = this.buildSearchRequestSToAPI(conf, '');
    let urlStr = this.authURL  + source + type + '/search' + sourceTarget;
    urlStr = this.addLanguageToURL(urlStr, lang);
    this.jsonRequest(urlStr, (jsonObj, error) => {
        if (error !== undefined) {
            callback(undefined, error);
            return;
        }
        if (jsonObj) {
          if (jsonObj.status) {
            callback(jsonObj, undefined);
          }else {
            if(jsonObj.hasOwnProperty('type')){
                this.appStatusSubject.next(jsonObj.type);
            }
            callback(undefined, jsonObj.message);
          }
        } else {
            callback(undefined, error);
        }
    }, RequestMethod.Post, cleanConf);
  }
  public getDataListByListByOrg(type: string, conf: any, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, source: string = '', sourceTarget: string = '', lang?: string) {
    let cleanConf = this.buildSearchRequestSToAPI(conf, '');
    let urlStr = this.authURL  + source + type + '/list/' + this.orgId.getValue();
    urlStr = this.addLanguageToURL(urlStr, lang);
    this.jsonRequest(urlStr, (jsonObj, error) => {
        if (error !== undefined) {
            callback(undefined, error);
            return;
        }
        if (jsonObj) {
          if (jsonObj.status) {
            callback(jsonObj, undefined);
          }else {
            if(jsonObj.hasOwnProperty('type')){
                this.appStatusSubject.next(jsonObj.type);
            }
            callback(undefined, jsonObj.message);
          }
        } else {
            callback(undefined, error);
        }
    }, RequestMethod.Post, cleanConf);
  }
  public getDataListByList(type: string, conf: any, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, source: string = '', sourceTarget: string = '', lang?: string) {
    let cleanConf = this.buildSearchRequestSToAPI(conf, '');
    let urlStr = this.authURL  + source + type + '/list';
    urlStr = this.addLanguageToURL(urlStr, lang);
    this.jsonRequest(urlStr, (jsonObj, error) => {
        if (error !== undefined) {
            callback(undefined, error);
            return;
        }
        if (jsonObj) {
          if (jsonObj.status) {
            callback(jsonObj, undefined);
          }else {
            if(jsonObj.hasOwnProperty('type')){
                this.appStatusSubject.next(jsonObj.type);
            }
            callback(undefined, jsonObj.message);
          }
        } else {
            callback(undefined, error);
        }
    }, RequestMethod.Post, cleanConf);
  }
  public getDataListSummary(type: string, conf: any, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, cached: boolean = false, lang?: string) {
    let cleanConf = this.buildSearchRequestSToAPI(conf, '');
    let urlStr = this.authURL  + type + '/search/summary';
    urlStr = this.addLanguageToURL(urlStr, lang);
    this.jsonRequest(urlStr, (jsonObj, error) => {
        if (error !== undefined) {
            callback(undefined, error);
            return;
        }
        if (jsonObj) {
          if (jsonObj.status) {
            if (cached) {
              this.cachedObj[type] = jsonObj;
            }
            callback(jsonObj, undefined);
          }else {
            if(jsonObj.hasOwnProperty('type')){
                this.appStatusSubject.next(jsonObj.type);
            }
            callback(undefined, jsonObj.message);
          }
        } else {
            callback(undefined, error);
        }
    }, RequestMethod.Post, cleanConf);
  }
  // downloadFile(data: Response) {
  //   const blob = new Blob([data], { type: 'text/csv' });
  //   const url= window.URL.createObjectURL(blob);
  //   window.open(url);
  // }
  public getThemes(orgId: string, id: string, createdOrg: string, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, lang?: string) {
    var urlStr =  this.authURL  + 'tiletheme/list';
    var query = {};

    if (this.utils.isNullOrEmpty(createdOrg)) {
      if (!this.utils.isNullOrEmpty(id)) {
        query["_id"] = id;
      } else {
        query["organizationId"] = orgId;
      }
    } else {
      query["createdOrg"] = createdOrg;
    }
    urlStr = this.addLanguageToURL(urlStr, lang);
    let lgObj = 'form_data='+ encodeURI(JSON.stringify(query));
    this.jsonRequest(urlStr, (jsonObj, error) => {
        if (error !== undefined) {
            callback(undefined, error);
            return;
        }
        if (jsonObj) {
          if (jsonObj.status) {
            callback(jsonObj, undefined);
          }else {
            if(jsonObj.hasOwnProperty('type')){
                this.appStatusSubject.next(jsonObj.type);
            }
            callback(undefined, jsonObj.message);
          }
        } else {
            callback(undefined, error);
        }
    }, RequestMethod.Post, lgObj);
  };
  public getDataLByOrg(type: string, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, cached: boolean = false, lang?: string) {
    if (cached) {
      if (this.cachedObj.hasOwnProperty(type + '/' + this.orgId.getValue())) {
        callback(this.cachedObj[type + '/' + this.orgId.getValue()], undefined);
        return;
      }
    }
    // let urlStr = this.authURL  + type;
    let urlStr = this.authURL  + type + '/list/' + this.orgId.getValue();
    urlStr = this.addLanguageToURL(urlStr, lang);
    this.jsonGetRequest(urlStr, (jsonObj, error) => {
        if (error !== undefined) {
            callback(undefined, error);
            return;
        }
        if (jsonObj) {
            if (jsonObj.status) {
              if (cached) {
                this.cachedObj[type + '/' + this.orgId.getValue()] = jsonObj;
              }
              callback(jsonObj, undefined);
            }else {
              if(jsonObj.hasOwnProperty('type')){
                  this.appStatusSubject.next(jsonObj.type);
              }
              callback(undefined, jsonObj.message);
            }
        } else {
            callback(undefined, error);
        }
    });
  }
  public getDataLByOrgType(datatype: string, type: string, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, cached: boolean = false, lang?: string) {
    if (cached) {
      if (this.cachedObj.hasOwnProperty(datatype + '/' + this.orgId.getValue() + '/' + type)) {
        callback(this.cachedObj[datatype + '/' + this.orgId.getValue() + '/' + type], undefined);
        return;
      }
    }
    let urlStr = this.authURL  + datatype + '/list/' + this.orgId.getValue() + '/' + type;
    urlStr = this.addLanguageToURL(urlStr, lang);
    this.jsonGetRequest(urlStr, (jsonObj, error) => {
        if (error !== undefined) {
            callback(undefined, error);
            return;
        }
        if (jsonObj) {
            if (jsonObj.status) {
              if (cached) {
                this.cachedObj[datatype + '/' + this.orgId.getValue() + '/' + type] = jsonObj;
              }
              callback(jsonObj, undefined);
            }else {
              if(jsonObj.hasOwnProperty('type')){
                  this.appStatusSubject.next(jsonObj.type);
              }
              callback(undefined, jsonObj.message);
            }
        } else {
            callback(undefined, error);
        }
    });
  }
  public getDataL(type: string, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, cached: boolean = false, lang?: string) {
    if (cached) {
      if (this.cachedObj.hasOwnProperty(type)) {
        callback(this.cachedObj[type], undefined);
        return;
      }
    }
    // let urlStr = this.authURL  + type;
    let urlStr = this.authURL  + type + '/list';
    urlStr = this.addLanguageToURL(urlStr, lang);
    this.jsonGetRequest(urlStr, (jsonObj, error) => {
        if (error !== undefined) {
            callback(undefined, error);
            return;
        }
        if (jsonObj) {
          if (jsonObj.status) {
            if (cached) {
              this.cachedObj[type] = jsonObj;
            }
            callback(jsonObj, undefined);
          }else {
            if(jsonObj.hasOwnProperty('type')){
                this.appStatusSubject.next(jsonObj.type);
            }
            callback(undefined, jsonObj.message);
          }
        } else {
            callback(undefined, error);
        }
    });
  }
  public getUsersList(conf: any, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, lang?: string) {
    let cleanConf = this.buildSearchRequestSToAPI(conf, '');
    let urlStr = this.authURL + 'user/search';
    urlStr = this.addLanguageToURL(urlStr, lang);
    this.jsonRequest(urlStr, (jsonObj, error) => {
        if (error !== undefined) {
            callback(undefined, error);
            return;
        }
        if (jsonObj) {
          if (jsonObj.status) {
            callback(jsonObj, undefined);
          }else {
            callback(undefined, jsonObj.message);
          }
        } else {
            callback(undefined, error);
        }
    }, RequestMethod.Post, cleanConf);
  }
  public getMyUsersList(conf: any, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, lang?: string) {
    let cleanConf = this.buildSearchRequestSToAPI(conf, '');
    let urlStr = this.authURL + 'my/user/search/summary';
    urlStr = this.addLanguageToURL(urlStr, lang);
    this.jsonRequest(urlStr, (jsonObj, error) => {
        if (error !== undefined) {
            callback(undefined, error);
            return;
        }
        if (jsonObj) {
          if (jsonObj.status) {
            callback(jsonObj, undefined);
          }else {
            if(jsonObj.hasOwnProperty('type')){
                this.appStatusSubject.next(jsonObj.type);
            }
            callback(undefined, jsonObj.message);
          }
        } else {
            callback(undefined, error);
        }
    }, RequestMethod.Post, cleanConf);
  }
  public getUser(userId: string, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, lang?: string) {
    let urlStr = this.authURL + 'user/' + userId;
    urlStr = this.addLanguageToURL(urlStr, lang);
    this.jsonGetRequest(urlStr, (jsonObj, error) => {
        if (error !== undefined) {
            callback(undefined, error);
            return;
        }
        if (jsonObj) {
          if (jsonObj.status) {
            callback(jsonObj, undefined);
          }else {
            if(jsonObj.hasOwnProperty('type')){
                this.appStatusSubject.next(jsonObj.type);
            }
            callback(undefined, jsonObj.message);
          }
        } else {
            callback(undefined, error);
        }
    });
  }
  public registeruser(user: any, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, lang?: string) {
    let urlStr = this.authURL + 'user/register';
    urlStr = this.addLanguageToURL(urlStr, lang);
    this.jsonRequest(urlStr, (jsonObj, error) => {
        if (error !== undefined) {
            callback(undefined, error);
            return;
        }
        if (jsonObj) {
          if (jsonObj.status) {
            callback(jsonObj, undefined);
          }else {
            if(jsonObj.hasOwnProperty('type')){
                this.appStatusSubject.next(jsonObj.type);
            }
            callback(undefined, jsonObj.message);
          }
        } else {
            callback(undefined, error);
        }
    }, RequestMethod.Post, user);
  }
  public editUser(userId: any, user: any, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, lang?: string) {
    let urlStr = this.authURL + 'user/' + userId;
    urlStr = this.addLanguageToURL(urlStr, lang);
    this.jsonRequest(urlStr, (jsonObj, error) => {
        if (error !== undefined) {
            callback(undefined, error);
            return;
        }
        if (jsonObj) {
          if (jsonObj.status) {
            callback(jsonObj, undefined);
          }else {
            if(jsonObj.hasOwnProperty('type')){
                this.appStatusSubject.next(jsonObj.type);
            }
            callback(undefined, jsonObj.message);
          }
        } else {
            callback(undefined, error);
        }
    }, RequestMethod.Post, user);
  }
  public editUserPassword(password: any, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, lang?: string) {
    let urlStr = this.authURL + 'changepassword/';
    let user = { password: password }
    urlStr = this.addLanguageToURL(urlStr, lang);
    this.jsonRequest(urlStr, (jsonObj, error) => {
        if (error !== undefined) {
            callback(undefined, error);
            return;
        }
        if (jsonObj) {
          if (jsonObj.status) {
            callback(jsonObj, undefined);
          }else {
            if(jsonObj.hasOwnProperty('type')){
                this.appStatusSubject.next(jsonObj.type);
            }
            callback(undefined, jsonObj.message);
          }
        } else {
            callback(undefined, error);
        }
    }, RequestMethod.Post, user);
  }
  public resetUserPassword(userId: any, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, lang?: string) {
    let urlStr = this.authURL + 'resetpassword/' + userId;
    urlStr = this.addLanguageToURL(urlStr, lang);
    this.jsonGetRequest(urlStr, (jsonObj, error) => {
        if (error !== undefined) {
            callback(undefined, error);
            return;
        }
        if (jsonObj) {
          if (jsonObj.status) {
            callback(jsonObj, undefined);
          }else {
            if(jsonObj.hasOwnProperty('type')){
                this.appStatusSubject.next(jsonObj.type);
            }
            callback(undefined, jsonObj.message);
          }
        } else {
            callback(undefined, error);
        }
    });
  }
  public requestPassword(useremail: any, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, lang?: string) {
    let urlStr = this.authURL + 'requestpassword/' + useremail;
    urlStr = this.addLanguageToURL(urlStr, lang);
    this.jsonRequest(urlStr, (jsonObj, error) => {
        if (error !== undefined) {
            callback(undefined, error);
            return;
        }
        if (jsonObj) {
          if (jsonObj.status) {
            callback(jsonObj, undefined);
          }else {
            if(jsonObj.hasOwnProperty('type')){
                this.appStatusSubject.next(jsonObj.type);
            }
            callback(undefined, jsonObj.message);
          }
        } else {
            callback(undefined, error);
        }
    });
  }
  public editSelfUser(userId: any, user: any, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, lang?: string) {
    let urlStr = this.authURL + 'userself/' + userId;
    urlStr = this.addLanguageToURL(urlStr, lang);
    this.jsonRequest(urlStr, (jsonObj, error) => {
        if (error !== undefined) {
            callback(undefined, error);
            return;
        }
        if (jsonObj) {
          if (jsonObj.status) {
            callback(jsonObj, undefined);
          }else {
            if(jsonObj.hasOwnProperty('type')){
                this.appStatusSubject.next(jsonObj.type);
            }
            callback(undefined, jsonObj.message);
          }
        } else {
            callback(undefined, error);
        }
    }, RequestMethod.Post, user);
  }
  private buildSearchRequestSToAPI(conf: any, token: string = '', addCustomData: boolean = true): {}{
    let searchRequestGeneric: any = {
      count: conf.perpage || 10
    };
    if(searchRequestGeneric.count === -1){
      delete searchRequestGeneric.count;
    }
    if(conf.orderBy && conf.orderDir){
      searchRequestGeneric['order'] = [];
      searchRequestGeneric['order'].push({field: conf.orderBy,order: conf.orderDir});
    }
    let fieldList: string[] = [];
    if (conf.hasOwnProperty('fieldKeys')){
        fieldList = conf['fieldKeys'];
    }
    if (fieldList.length > 0){
      searchRequestGeneric['fields'] = fieldList;
    }
    if (conf.hasOwnProperty('term') && conf['term'] !== undefined){
      searchRequestGeneric['term'] = conf['term'] || '';
    }
    if (conf.hasOwnProperty('termfields') && conf['termfields'] !== undefined){
      searchRequestGeneric['termfields'] = conf['termfields'] || '';
    }
    let filterList = {};
    if (conf.customData && addCustomData){
      if (Object.keys(conf.customData).length > 0){
        for (let field of Object.keys(conf.customData)){
          if (field)
            filterList[field] = {op: 'eq', value: conf.customData[field]};
        }
      }
    }
    if (conf.filterFieldKey){
      for (let field of conf.filterFieldKey){
        if (field){
            filterList[field.field] = {op: field.op, value: field.search};
            if (field.type && field.type === 'number'){
              filterList[field.field].value = Number(filterList[field.field].value);
            }
        }
      }
    }
    if (Object.keys(filterList).length > 0){
      searchRequestGeneric['filter'] = filterList;
    }
    if (conf.hasOwnProperty('filter')){
      searchRequestGeneric['filter'] = conf.filter;
    }
    if (conf.hasOwnProperty('page')){
      searchRequestGeneric['page'] = conf.page;
    }
    if (token !== ''){
      searchRequestGeneric['paginationToken'] = token;
    }
    if (conf.hasOwnProperty('include') && conf['include'] !== undefined){
      searchRequestGeneric['include'] = conf['include'] || [];
    }
    if (conf.hasOwnProperty('exclude') && conf['exclude'] !== undefined){
      searchRequestGeneric['exclude'] = conf['exclude'] || [];
    }
    return searchRequestGeneric;
  }
  private urlEncode(str: string): string {
      return encodeURI(str);
  }
  private jsonRequestSimple(urlString: string, callback: (json?: any, error?: any) => void, params: Dictionary, timeout: number = 60.0) {
    let body ;
    if (params) {
      body = params;
    } else {
      // we need to recheck this
      console.log('Parameters sent to jsonRequestSimple are not serializable into JSON');
    }
    this.jsonRequest(urlString, (json, error) => {
      callback(json, error);
    }, RequestMethod.Post, body, ContentType.JSON, timeout);
  }
  private jsonGetRequest(urlString: string, callback: (json?: any, error?: any) => void, params?: Dictionary) {
      if (urlString) {
        let urlComps = urlString;
        if (params) {
          for (let urlItem of Object.keys(params)) {
            urlComps += '&' + urlItem + '=' + params[urlItem];
          }
        }
        this.jsonRequest(urlComps, callback, RequestMethod.Get);
      } else {
        return;
      }
  }
  private jsonRequest(urlString: string,
                      callback: (json: any, error: any) => void,
                      method: RequestMethod = RequestMethod.Post,
                      postBody: any = undefined,
                      contentType: string = ContentType.JSON,
                      timeout: number = 10.0,
                      retry: boolean = false,
                      retryFactor: number = 1.5,
                      maxTimeout: number = 60.0) {
      if ( urlString ) {
        let url: string = urlString || '';
        // this.logger.log(url, method, postBody, contentType, timeout, retry, retryFactor, maxTimeout);
        // console.log(url, method, postBody, contentType, timeout, retry, retryFactor, maxTimeout);
        let headers = new Headers();
        headers.append('Content-Type', contentType );
        // headers.append('Accept' , 'application/json');
        if (this.token && urlString.startsWith(this.authURL)) {
            // headers.append('http-header', this.token);
            headers.append('Authorization', 'bearer ' + this.token);
        }
        let options = new RequestOptions({ headers: headers });
        let bodyString = postBody;
        if (method === RequestMethod.Post) {
           bodyString = JSON.stringify(postBody);
           options.body = bodyString;
        }
        let request = new Request({method: method, url: url, body: bodyString, headers: headers});
        this.http.request(request, options).pipe(
                          map(
                              (res: Response) => {
                                // console.log('res', res);
                                if (res.status >= 404) {
                                  window.location.reload();
                                }else if (res.status >= 400){
                                  callback(undefined, 'server');
                                  return;
                                }
                                return res.json();
                              }
                            )
                          )
                          .subscribe(
                            (data) => {
                              callback(data, undefined);
                              // console.log(url, data);
                            },
                            (err) => {
                              if(err){
                                if (err.status >= 404) {
                                  // window.location.reload();
                                  callback(undefined, 'Refresh parent');
                                }else if (err.status >= 400){
                                  callback(undefined, 'server');
                                }else{
                                  callback(undefined, err);
                                }
                              }
                              // if (retry) {
                              //     let timeInterval = Math.min(maxTimeout, retryFactor * timeout);
                              //     this.jsonRequest(urlString, callback, method, postBody, contentType, timeInterval,
                              //        true, retryFactor, maxTimeout );
                              // } else {
                              //     callback(undefined, err);
                              // }
                            });

      } else {
        // this.logger.log('Failed to create URL');
        console.log('Failed to create URL');
      }
  }
  public onUploadUserImage(browsed_file: any, userId: string): Observable<{}> {
    let headers: Headers = new Headers();
    headers.append('Accept' , 'application/json');
    headers.append('Authorization', 'bearer ' + this.token);
    let url = this.authURL + 'user/image/upload/' + userId;
    let formData = new FormData();
    formData.append('upfile', browsed_file.originalFile);
    formData.append('name', browsed_file.text);
    return this.http.post(url,
    formData , {headers: headers}).pipe(map((response: Response) => {
          let jsonObj = undefined;
          try{
            jsonObj = response.json() || undefined;
          }catch(e){
            // error
          }
          if (jsonObj) {
            if (jsonObj.status) {
              return jsonObj;
            }else {
              return { status: false, message: 'Upload Unsuccessful!!'};
            }
          } else {
            return { status: false, message: 'Upload Unsuccessful!!'};
          }
      }));
  }
  public onUploadUserTranscript(browsed_file: any, userId: string, transcript: any): Observable<{}> {
    let headers: Headers = new Headers();
    headers.append('Accept' , 'application/json');
    headers.append('Authorization', 'bearer ' + this.token);
    let url = this.authURL + 'transcript/upload/' + userId;
    let formData = new FormData();
    formData.append('upfile', browsed_file.originalFile);
    formData.append('name', browsed_file.text);
    formData.append('year', transcript.year);
    return this.http.post(url,
    formData , {headers: headers}).pipe(map((response: Response) => {
          let jsonObj = undefined;
          try{
            jsonObj = response.json() || undefined;
          }catch(e){
            // error
          }
          if (jsonObj) {
            if (jsonObj.status) {
              return jsonObj;
            }else {
              return { status: false, message: 'Upload Unsuccessful!!'};
            }
          } else {
            return { status: false, message: 'Upload Unsuccessful!!'};
          }
      }));
  }
  public onUploadFiles(browsed_file: any, folder: string = '', type: string = '', isEncoded: string = 'false'): Observable<{}> {
    let headers: Headers = new Headers();
    headers.append('Accept' , 'application/json');
    headers.append('Authorization', 'bearer ' + this.token);
    let url = this.authURL + 'img/upload/' + this.orgId.getValue();;
    let formData = new FormData();
    // formData.append('file', browsed_file.originalFile, browsed_file.originalFile.name);
    formData.append('upfile', browsed_file.originalFile);
    formData.append('folder', folder);
    formData.append('type', type);
    formData.append('isEncoded', isEncoded);
    return this.http.post(url,
    formData , {headers: headers}).pipe(map((response: Response) => {
        let jsonObj = undefined;
        try{
          jsonObj = response.json() || undefined;
        }catch(e){
          // error
        }
        if (jsonObj) {
          if (jsonObj.status) {
            return jsonObj;
          }else {
            return { status: false, message: 'Upload Unsuccessful!!'};
          }
        } else {
          return { status: false, message: 'Upload Unsuccessful!!'};
        }
      }));
  }
  public onUploadBackgroundFiles(tileId: string, type: string, browsed_file: any): Observable<{}> {
    let headers: Headers = new Headers();
    headers.append('Accept' , 'application/json');
    headers.append('Authorization', 'bearer ' + this.token);
    let url = this.authURL + 'img/upload/' + tileId + '/tilebackground';
    let formData = new FormData();
    // formData.append('file', browsed_file.originalFile, browsed_file.originalFile.name);
    formData.append('upfile', browsed_file.originalFile);
    formData.append('tileId', tileId);
    formData.append('type', type);
    return this.http.post(url,
    formData , {headers: headers}).pipe(map((response: Response) => {
        let jsonObj = undefined;
        try{
          jsonObj = response.json() || undefined;
        }catch(e){
          // error
        }
        if (jsonObj) {
          if (jsonObj.status) {
            return jsonObj;
          }else {
            return { status: false, message: 'Upload Unsuccessful!!'};
          }
        } else {
          return { status: false, message: 'Upload Unsuccessful!!'};
        }
      }));
  }
  public getURLData(url: string, callback: (dataResponse: any | undefined, requestError: any | undefined) => void, lang?: string) {
    let urlStr = url;//this.authURL  + type + '/' + id;
    //urlStr = this.addLanguageToURL(urlStr, lang);
    this.jsonGetRequest(urlStr, (jsonObj, error) => {
        if (error !== undefined) {
            callback(undefined, error);
            return;
        }
        if (jsonObj) {
          if (jsonObj.status) {
            callback(jsonObj, undefined);
          }else {
            if(jsonObj.hasOwnProperty('type')){
                this.appStatusSubject.next(jsonObj.type);
            }
            callback(undefined, jsonObj.message);
          }
        } else {
            callback(undefined, error);
        }
    });
  }
}
