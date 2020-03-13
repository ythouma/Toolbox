import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Modeler, CamundaPropertiesProvider, PropertiesPanelModule, InjectionNames, OriginalPaletteProvider} from "./bpmn-js/bpmn-js";
import {CustomPaletteProvider} from "./props-provider/CustomPaletteProvider";
// const camundaModdleDescriptor = require('camunda-bpmn-moddle/resources/camunda.json');
import * as camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';

@Component({
  selector: 'app-workflows-page',
  templateUrl: './workflows-page.component.html',
  styleUrls: [
    './workflows-page.component.scss',
    './styles/vendor/properties.css',
    './styles/vendor/diagram-js.css',
    './styles/vendor/bpmn-font/css/bpmn-embedded.css',
  ]
})

export class WorkflowsPageComponent implements OnInit {
  title = 'Angular/BPMN';
  modeler;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.modeler = new Modeler({
      container: '#canvas',
      width: '100%',
      height: '600px',
      additionalModules: [
        PropertiesPanelModule,
        CamundaPropertiesProvider,

        // Re-use original palette, see CustomPaletteProvider
        {[InjectionNames.originalPaletteProvider]: ['type', OriginalPaletteProvider]},
        {[InjectionNames.paletteProvider]: ['type', CustomPaletteProvider]},
      ],
      propertiesPanel: {
        parent: '#properties'
      },
      moddleExtension: {
        // custom: customModdle,
        camunda: camundaModdleDescriptor
      },
      bpmnRenderer: {
        // defaultFillColor: '#333',
        // defaultStrokeColor: '#fff'
      }
    });
  }

  handleError(err: any) {
    if (err) {
      console.warn('Ups, error: ', err);
    }
  }

  load(): void {
    const url = '/assets/bpmn/testingdiagram.bpmn';
    this.http.get(url, {
      headers: {observe: 'response'}, responseType: 'text'
    }).subscribe(
      (x: any) => {
        console.log('Fetched XML, now importing: ', x);
        this.modeler.importXML(x, this.handleError);
      },
      this.handleError
    );
  }

  save(): void {
    this.modeler.saveXML((err: any, xml: any) => console.log('Result of saving XML: ', err, xml));
  }
}








// export class WorkflowsPageComponent implements OnInit, OnDestroy {
//     private subscriptions: Subscription[] = [];
//     public selectedUser: any;
//     public loading: boolean = false;
//     public tableSetting: any = undefined;
//     public errorMessage: string = '';
//     public BpmnEditorComponent: BpmnEditorComponent;

//     constructor( private requestService: RequestService, private router: Router,
// 		private activatedRoute: ActivatedRoute,
//     private subheaderService: SubheaderService,
//     private layoutUtilsService: LayoutUtilsService,
//     public dialog: MatDialog) {}

//     ngOnInit() {
//       console.log('start');
//       // this.BpmnEditorComponent = new BpmnEditorComponent(this.requestService);
//       // this.BpmnEditorComponent.importDiagram();
//       console.log('end');
//       //this.BpmnEditorComponent.loadUrl('http://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn');
//   		this.subscriptions.push(
//         this.requestService.currentUserSubject.subscribe((data) => {
//           if (data) {
//             this.selectedUser = data;
//           }
//         })
//       );
//       this.subheaderService.setTitle('Workflows');
//       this.subheaderService.setBreadcrumbs([
// 				{ title: 'Engine', page: undefined },
// 				{ title: 'Workflows', page: undefined },
// 			]);
//     }

//     /**
//   	 * On Destroy
//   	 */
//   	ngOnDestroy() {
//   		this.subscriptions.forEach(el => el.unsubscribe());
//     }
//     handleImported(e){
//      console.log(e); 
//     }
// }

