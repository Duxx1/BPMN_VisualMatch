import { BpmnVisualization, FitType} from 'bpmn-visualization';

// Variable para almacenar el diagramC de la parte izquierda de la pantalla 
const bpmnVisualization = new BpmnVisualization({
    container: 'marco',
    navigation: { enabled: true },
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
        case 'colors.bpmn':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/colors.bpmn');
            diagram1Raw = await diagram1.text();
            console.log(diagram1Raw);
        break;
        case 'crs-delete-paper-bpmn.bpmn':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-delete-paper-bpmn.bpmn');
            diagram1Raw = await diagram1.text();
            console.log(diagram1Raw);
        break;
        case 'crs-delete-subject-bpmn.bpmn':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-delete-subject-bpmn.bpmn');
            diagram1Raw = await diagram1.text();
            console.log(diagram1Raw);
        break;
        case 'crs-get-conference-bpmn.bpmn':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-get-conference-bpmn.bpmn');
            diagram1Raw = await diagram1.text();
            console.log(diagram1Raw);
        break;
        case 'CRS-Create-article-mal.bpmn':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/CRS-Create-article-mal.bpmn');
            diagram1Raw = await diagram1.text();
            console.log(diagram1Raw);
        break;
        case 'CRS-Delete-track-mal.bpmn':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/CRS-Delete-track-mal.bpmn');
            diagram1Raw = await diagram1.text();
            console.log(diagram1Raw);
        break;
        default:
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-update-conference-bpmn.bpmn');
            diagram1Raw = await diagram1.text();
            console.log(diagram1Raw);
    }
} else{
    //Carga de diagramCs por defecto
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