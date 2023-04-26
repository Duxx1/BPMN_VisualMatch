import { BpmnVisualization, FitType} from 'bpmn-visualization';

// Variable para almacenar el diagramC de la parte izquierda de la pantalla 
const bpmnVisualization = new BpmnVisualization({
    container: 'marco',
    navigation: { enabled: true },
    fit: { type: FitType.Center }
});

// just for displaying my title and version of the tool
const footer = document.querySelector('footer');
const version = bpmnVisualization.getVersion();
footer.innerText = `TFG-tool-version-${version.lib}`;

var diagramC = localStorage.getItem("diagramC");
var diagram1;
var diagram1Raw;

if (diagramC != undefined && diagramC != null){
    switch (diagramC) {
        case 'crs-get-conference-bpmn.bpmn':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-get-conference-bpmn.bpmn');
            diagram1Raw = await diagram1.text();
            console.log(diagram1Raw);
        break;
        case 'crs-createarticle.bpmn':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-createarticle.bpmn');
            diagram1Raw = await diagram1.text();
            console.log(diagram1Raw);
        break;
        case 'crs-deletetrack.bpmn':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-deletetrack.bpmn');
            diagram1Raw = await diagram1.text();
            console.log(diagram1Raw);
        break;
        case 'crs-updatereviewer.bpmn':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-updatereviewer.bpmn');
            diagram1Raw = await diagram1.text();
            console.log(diagram1Raw);
        break;
        case 'crs-updatetrack.bpmn':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-updatetrack.bpmn');
            diagram1Raw = await diagram1.text();
            console.log(diagram1Raw);
        break;
        case 'crs-updatearticle.bpmn':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-updatearticle.bpmn');
            diagram1Raw = await diagram1.text();
            console.log(diagram1Raw);
        break;
        case 'crs-getreport.bpmn':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-getreport.bpmn');
            diagram1Raw = await diagram1.text();
            console.log(diagram1Raw);
        break;
        case 'crs-getpaper.bpmn':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-getpaper.bpmn');
            diagram1Raw = await diagram1.text();
            console.log(diagram1Raw);
        break;
        /*
        case '':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/');
            diagram1Raw = await diagram1.text();
            console.log(diagram1Raw);
        break;
        */
        default:
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-update-conference-bpmn.bpmn');
            diagram1Raw = await diagram1.text();
            console.log(diagram1Raw);
    }
} else{
    //Carga de diagrama por defecto
    if(diagram1 === null || diagram1 === undefined){
        diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-get-conference-bpmn.bpmn');
        diagram1Raw = await diagram1.text();
        console.log("EL diagramC  SE HA CARGADO POR DEFECTO");
    }
}

//Carga del diagrama
bpmnVisualization.load(diagram1Raw, {
    fit: { type: FitType.Horizontal }
});