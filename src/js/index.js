import { BpmnVisualization, FitType, FlowKind } from 'bpmn-visualization';

// the '?raw' parameter tells Vite to store the diagram content in a string.
// for more details, see https://vitejs.dev/guide/assets.html#importing-asset-as-string
// for other load methods, see https://github.com/process-analytics/bpmn-visualization-examples
import diagram from './bpmn_diagrams/diagram.bpmn?raw';

import diagram2 from './bpmn_diagrams/CRS - Create article.bpmn?raw';
import './styles.css';

import { getActivitiesRunningInstances, getEdgesWaitingInstances, getPrueba } from './js/algorithms.js';
import { calcularSimilitudCasillas, calcularSimilitudCasillas2 } from './js/similitud';

// 'bpmn-visualization' API documentation: https://process-analytics.github.io/bpmn-visualization-js/api/index.html
// set up the container for the BPMN diagram and enable navitation
/*const bpmnVisualization = new BpmnVisualization({
  container: 'bpmn-container',
  navigation: { enabled: true },
});*/

const bpmnVisualization = new BpmnVisualization({
  container: 'parte-izquierda',
  navigation: { enabled: true },
});

const bpmnVisualization2 = new BpmnVisualization({
  container: 'parte-derecha',
  navigation: { enabled: true },
});

// just for displaying my title and version of the tool
const footer = document.querySelector('footer');
const version = bpmnVisualization.getVersion();
footer.innerText = `TFG-version-${version.lib}`;

/*
// load and filter a pool
bpmnVisualization.load(diagram, {
  fit: { type: FitType.Center },
  modelFilter: {
    pools: [
      {
        // name of the Participant related to the Pool to display
        name: 'Process Engine - Invoice Receipt',
      },
    ],
  },
});
*/

// load a pool
//bpmnVisualization.load(diagram, {
//  fit: { type: FitType.Horizontal }
//});

bpmnVisualization.load(diagram, {
  fit: { type: FitType.Center },
  modelFilter: {
    pools: [
      {
        // name of the Participant related to the Pool to display
        name: 'Process Engine - Invoice Receipt',
      },
    ],
  },
});

bpmnVisualization2.load(diagram, {
  fit: { type: FitType.Center },
  modelFilter: {
    pools: [
      {
        // name of the Participant related to the Pool to display
        name: 'Process Engine - Invoice Receipt',
      },
    ],
  },
});

/*
bpmnVisualization2.load(diagram2, {
  fit: { type: FitType.Center }
});
*/


// retrieve data of the live instances
const activitiesRunningInstances = getActivitiesRunningInstances();
const edgesWaitingInstances = getEdgesWaitingInstances();
const prueba = getPrueba();

// add Overlays on running activity instances
activitiesRunningInstances.forEach((value, activityId) => {
  // running on time
  if (value.onTime) {
    bpmnVisualization.bpmnElementsRegistry.addOverlays(activityId, {
      position: 'top-center',
      label: `${value.onTime}`,
      style: {
        font: { color: 'white', size: 16 },
        fill: { color: 'green', opacity: 50 },
        stroke: { color: 'green', width: 2 },
      },
    });
  }
  // running late with risky level
  if (value.risky) {
    bpmnVisualization.bpmnElementsRegistry.addOverlays(activityId, {
      position: 'top-left',
      label: `${value.risky}`,
      style: {
        font: { color: 'white', size: 16 },
        fill: { color: '#FF8C00', opacity: 50 },
        stroke: { color: '#FF8C00', width: 2 },
      },
    });
  }
  // running late with critical level
  if (value.critical) {
    bpmnVisualization.bpmnElementsRegistry.addOverlays(activityId, {
      position: 'top-right',
      label: `${value.critical}`,
      style: {
        font: { color: 'white', size: 16 },
        fill: { color: 'red', opacity: 50 },
        stroke: { color: 'red', width: 2 },
      },
    });
  }
});

// add CSS classes to running activity instances
activitiesRunningInstances.forEach((value, activityId) => {
  if (value.critical) {
    bpmnVisualization.bpmnElementsRegistry.addCssClasses(activityId, 'task-running-critical');
  } else if (value.risky) {
    bpmnVisualization.bpmnElementsRegistry.addCssClasses(activityId, 'task-running-risky');
  } else if (value.onTime) {
    bpmnVisualization.bpmnElementsRegistry.addCssClasses(activityId, 'task-running-on-time');
  }
});

// add Overlays on waiting edge instances
edgesWaitingInstances.forEach((value, edgeId) => {
  bpmnVisualization.bpmnElementsRegistry.addOverlays(edgeId, {
    position: 'middle',
    label: `${value}`,
    style: {
      font: { color: 'white', size: 16 },
      fill: { color: 'red', opacity: 50 },
      stroke: { color: 'red', width: 2 },
    },
  });
});

// add CSS classes to waiting edge instances
edgesWaitingInstances.forEach((value, edgeId) => {
  bpmnVisualization.bpmnElementsRegistry.addCssClasses(edgeId, 'path-waiting');
});

prueba.forEach((value, pruebaId) => {
  console.log(value);
  if (value.mytical) {
    bpmnVisualization.bpmnElementsRegistry.addCssClasses(pruebaId, 'prueba');
  }
});

prueba.forEach((value, edgeId) => {
  console.log(edgeId);
  console.log(value);
  bpmnVisualization.bpmnElementsRegistry.addOverlays(edgeId, {
    position: 'middle',
    label: `${value.mytical}`,
    style: {
      font: { color: 'white', size: 16 },
      fill: { color: 'red', opacity: 50 },
      stroke: { color: 'red', width: 2 },
    },
  });
});

//Pruebas de ID y tag name utilizando el DOM
/*
let parser = new DOMParser();
let xmlDoc = parser.parseFromString(diagram, "text/xml");

let element = xmlDoc.querySelector("[name='Scan Invoice']");

console.log('##############################');
console.log(element);

let container = element.parentNode;
let containerId = container.getAttribute("id");
console.log(containerId);

bpmnVisualization.bpmnElementsRegistry.addOverlays(containerId, {
  position: 'middle',
  label: 'heyyy',
  style: {
    font: { color: 'white', size: 16 },
    fill: { color: 'red', opacity: 50 },
    stroke: { color: 'red', width: 2 },
  },
});

bpmnVisualization.bpmnElementsRegistry.addCssClasses(container, 'prueba');
element.style.color = "red";
element.innerHTML = "Scan Invoiceddd";
*/

////////////////////////////////////////

// retrieve data of the live instances
const activitiesRunningInstances2 = getActivitiesRunningInstances();
const edgesWaitingInstances2 = getEdgesWaitingInstances();
const prueba2 = getPrueba();

// add Overlays on running activity instances
activitiesRunningInstances2.forEach((value, activityId) => {
  // running on time
  if (value.onTime) {
    bpmnVisualization2.bpmnElementsRegistry.addOverlays(activityId, {
      position: 'top-center',
      label: `${value.onTime}`,
      style: {
        font: { color: 'white', size: 16 },
        fill: { color: 'green', opacity: 50 },
        stroke: { color: 'green', width: 2 },
      },
    });
  }
  // running late with risky level
  if (value.risky) {
    bpmnVisualization2.bpmnElementsRegistry.addOverlays(activityId, {
      position: 'top-left',
      label: `${value.risky}`,
      style: {
        font: { color: 'white', size: 16 },
        fill: { color: '#FF8C00', opacity: 50 },
        stroke: { color: '#FF8C00', width: 2 },
      },
    });
  }
  // running late with critical level
  if (value.critical) {
    bpmnVisualization2.bpmnElementsRegistry.addOverlays(activityId, {
      position: 'top-right',
      label: `${value.critical}`,
      style: {
        font: { color: 'white', size: 16 },
        fill: { color: 'red', opacity: 50 },
        stroke: { color: 'red', width: 2 },
      },
    });
  }
});

// add CSS classes to running activity instances
activitiesRunningInstances2.forEach((value, activityId) => {
  if (value.critical) {
    bpmnVisualization2.bpmnElementsRegistry.addCssClasses(activityId, 'task-running-critical');
  } else if (value.risky) {
    bpmnVisualization2.bpmnElementsRegistry.addCssClasses(activityId, 'task-running-risky');
  } else if (value.onTime) {
    bpmnVisualization2.bpmnElementsRegistry.addCssClasses(activityId, 'task-running-on-time');
  }
});

// add Overlays on waiting edge instances
edgesWaitingInstances2.forEach((value, edgeId) => {
  bpmnVisualization2.bpmnElementsRegistry.addOverlays(edgeId, {
    position: 'middle',
    label: `${value}`,
    style: {
      font: { color: 'white', size: 16 },
      fill: { color: 'red', opacity: 50 },
      stroke: { color: 'red', width: 2 },
    },
  });
});

// add CSS classes to waiting edge instances
edgesWaitingInstances2.forEach((value, edgeId) => {
  bpmnVisualization2.bpmnElementsRegistry.addCssClasses(edgeId, 'path-waiting');
});

prueba2.forEach((value, pruebaId) => {
  console.log(value);
  if (value.mytical) {
    bpmnVisualization2.bpmnElementsRegistry.addCssClasses(pruebaId, 'prueba');
  }
});

prueba2.forEach((value, edgeId) => {
  console.log(edgeId);
  console.log(value);
  bpmnVisualization2.bpmnElementsRegistry.addOverlays(edgeId, {
    position: 'middle',
    label: `${value.mytical}`,
    style: {
      font: { color: 'white', size: 16 },
      fill: { color: 'red', opacity: 50 },
      stroke: { color: 'red', width: 2 },
    },
  });
});



let matriz = [  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

let resultados = calcularSimilitudCasillas(matriz);

let resultados2 = calcularSimilitudCasillas2(matriz);

console.log("Primer algoritmo:")
console.log(resultados);

resultados.forEach((value, key) => {
  console.log(key , 'Similitud -> ', value[2]);
});


// Función para leer un archivo CSV y obtener una matriz de valores
async function readCsv(fileUrl) {
  // Obtiene el contenido del archivo CSV
  const response = await fetch(fileUrl);
  const csvString = await response.text();

  // Divide el contenido del archivo en líneas
  const lines = csvString.split('\n');

  // Divide cada línea en una matriz de valores y almacena los valores en una matriz
  const values = lines.map(line => line.split(','));

  return values;
}

// Ejemplo de uso de la función
/*
(async () => {
  const values = await readCsv('/src/similarity_matrix/similaritymatrix_CRS_Get_conference_CRS-Update_conference.csv');
  console.log(values);  // Imprime la matriz de valores leída del archivo CSV
  console.log(colorMatrix(values));
})();
*/

const values = await readCsv('/src/similarity_matrix/similaritymatrix_CRS_Get_conference_CRS-Update_conference.csv');
  console.log(values);  // Imprime la matriz de valores leída del archivo CSV
  console.log(colorMatrix(values));

  // Obtiene la referencia al elemento con el ID "miElemento"
const element = document.getElementById('archiveInvoice');
console.log(element);
// Asigna el color verde al elemento
//element.color = 'green';
bpmnVisualization2.bpmnElementsRegistry.addCssClasses('archiveInvoice', 'prueba');

async function getTaskNames(fileUrl) {
  // Obtiene el contenido del archivo CSV
  const response = await fetch(fileUrl);
  const csvString = await response.text();
  
  // Divide el contenido del archivo en líneas
  const lines = csvString.split('\n');
  
  // Divide cada línea en una matriz de valores y extrae el primer valor (nombre de la tarea)
  const taskNames = lines.map(line => line.split(',')[0]);
  
  return taskNames;
}

// Ejemplo de uso de la función
(async () => {
  const taskNames = await getTaskNames('/src/csv_files/Get_conference.bpmn.csv');
  console.log(taskNames);  // Imprime el array con los nombres de las tareas leídas del archivo CSV
})();

//bpmnVisualization2.bpmnElementsRegistry.addCssClasses(pruebaId, 'prueba');

//Recibe una matriz de valores y devuelve una matriz de colores utilizando una escala de colores verde a rojo
function colorMatrix(matrix) {
  // Crea una lista de colores verde a rojo
  const colors = ['#00FF00', '#33FF00', '#66FF00', '#99FF00', '#CCFF00',
                  '#FFFF00', '#FFCC00', '#FF9900', '#FF6600', '#FF3300',
                  '#FF0000'];

  // Inicializa una matriz de colores vacía
  const colorMatrix = [];

  // Recorre cada fila de la matriz de valores
  for (const row of matrix) {
    // Inicializa una fila de colores vacía
    const colorRow = [];

    // Recorre cada valor de la fila
    for (const value of row) {
      // Asigna un color a cada valor según su posición en la escala de colores
      const color = colors[Math.floor(value * 10)];
      // Agrega el color a la fila de colores
      colorRow.push(color);
    }

    // Agrega la fila de colores a la matriz de colores
    colorMatrix.push(colorRow);
  }

  return colorMatrix;
}

// Ejemplo de uso de la función
//const matrix = [[0.1, 0.2, 0.3],



/*
// Carga la librería desde un módulo
import BPMN from 'bpmn-js/lib/Modeler';


// Cargamos el archivo .bpmn
var bpmnXML = '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="Definitions_1">' +
                '<bpmn:process id="Process_1" isExecutable="true">' +
                  '<bpmn:startEvent id="StartEvent_1" />' +
                  '<bpmn:task id="Task_1" name="My Task">' +
                    '<bpmn:incoming>SequenceFlow_1</bpmn:incoming>' +
                    '<bpmn:outgoing>SequenceFlow_2</bpmn:outgoing>' +
                  '</bpmn:task>' +
                  '<bpmn:endEvent id="EndEvent_1" />' +
                  '<bpmn:sequenceFlow id="SequenceFlow_1" sourceRef="StartEvent_1" targetRef="Task_1" />' +
                  '<bpmn:sequenceFlow id="SequenceFlow_2" sourceRef="Task_1" targetRef="EndEvent_1" />' +
                '</bpmn:process>' +
              '</bpmn:definitions>';

// Creamos una nueva instancia de BPMNModeler
var modeler = new BPMNModeler({
  container: '.parte-izquierda'
});

var m = new BPMN.Modeler({
  container: 'parte-derecha'
});


// Cargamos el archivo .bpmn en el modeler
modeler.importXML(bpmnXML, function(err) {
  if (err) {
    console.error(err);
    return;
  }

  // Obtenemos todos los elementos de tarea del diagrama
  var tasks = modeler.get('elementRegistry').filter(function(element) {
    return element.type === 'bpmn:Task';
  });

  // Buscamos la tarea que tenga el nombre "My Task"
  var task;
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].businessObject.name === "My Task") {
      task = tasks[i];
      break;
    }
  }

  console.log(task);
});


var tasks = bpmnVisualization.get('elementRegistry').filter(function(element) {
  return element.type === 'bpmn:Task';
});

// Buscamos la tarea que tenga el nombre "My Task"
var task;
for (var i = 0; i < tasks.length; i++) {
  if (tasks[i].businessObject.name === "Assign Approver") {
    task = tasks[i];
    break;
  }
}
*/