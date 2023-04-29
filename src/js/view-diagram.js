import { BpmnVisualization, FitType} from 'bpmn-visualization';

// Variable to store the diagram of the left part of the screen
const bpmnVisualization = new BpmnVisualization({
    container: 'marco',
    navigation: { enabled: true },
    fit: { type: FitType.Center }
});

// Just for displaying my title and version of the tool
const footer = document.querySelector('footer');
const version = bpmnVisualization.getVersion();
footer.innerText = `TFG-tool-version-${version.lib}`;

var diagramC = localStorage.getItem("diagramC");
var diagram1;
var diagram1Raw;

if (diagramC != undefined && diagramC != null){
    switch (diagramC) {
        case 'crs-createarticle.bpmn':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-createarticle.bpmn');
            diagram1Raw = await diagram1.text();
        break;
        case 'crs-deletetrack.bpmn':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-deletetrack.bpmn');
            diagram1Raw = await diagram1.text();
        break;
        case 'crs-updatereviewer.bpmn':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-updatereviewer.bpmn');
            diagram1Raw = await diagram1.text();
        break;
        case 'crs-updatetrack.bpmn':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-updatetrack.bpmn');
            diagram1Raw = await diagram1.text();
        break;
        case 'crs-updatearticle.bpmn':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-updatearticle.bpmn');
            diagram1Raw = await diagram1.text();
        break;
        case 'crs-getreport.bpmn':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-getreport.bpmn');
            diagram1Raw = await diagram1.text();
        break;
        case 'crs-getpaper.bpmn':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-getpaper.bpmn');
            diagram1Raw = await diagram1.text();
        break;
        /*
        case '':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/');
            diagram1Raw = await diagram1.text();
        break;
        */
        default:
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-getpaper.bpmn');
            diagram1Raw = await diagram1.text();
    }
} else{
    // Default diagram loading
    if(diagram1 === null || diagram1 === undefined){
        diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-getpaper.bpmn');
        diagram1Raw = await diagram1.text();
        alert("Warning. The selected diagram is not suported together.\nPlease select other diagram.\nShowing preloaded diagram.")
    }
}

// Loading diagram
bpmnVisualization.load(diagram1Raw, {
    fit: { type: FitType.Horizontal }
});