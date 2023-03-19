import { BpmnVisualization, FitType, FlowKind, ShapeBpmnElementKind } from 'bpmn-visualization';
//import diagram from './bpmn_diagrams/diagram.bpmn?raw';
//import diagram2 from './bpmn_diagrams/CRS - Create article.bpmn?raw';
//import diagram from './bpmn_diagrams/crs-get-conference-bpmn.bpmn?raw';
//import diagram2 from './bpmn_diagrams/crs-update-conference-bpmn.bpmn?raw';
import './styles.css';
import { getActivitiesRunningInstances, getEdgesWaitingInstances, getPrueba } from './js/algorithms.js';
//import { calcularSimilitudCasillas, calcularSimilitudCasillas2 } from './js/similitud';
import { readMatrixFromCsv, getTaskNamesFromCsv } from './js/read_csv.js';

// Variable para almacenar el diagrama de la parte izquierda de la pantalla 
const bpmnVisualization = new BpmnVisualization({
    container: 'parte-izquierda',
    navigation: { enabled: true },
});
// Variable para almacenar el diagrama de la parte derecha de la pantalla
const bpmnVisualization2 = new BpmnVisualization({
    container: 'parte-derecha',
    navigation: { enabled: true },
});

// just for displaying my title and version of the tool
const footer = document.querySelector('footer');
const version = bpmnVisualization.getVersion();
footer.innerText = `TFG-version-${version.lib}`;

// ################ ZONA DE PRUEBAS ################
//TODO probar a cargar en una variable el texto raw de los diagramas y luego cargarlos en el load
//Probar luego condicionales mezclados con la pagina de subir
var diagramA = localStorage.getItem("diagramA");
var diagramB = localStorage.getItem("diagramB");
console.log(diagramA);
console.log(diagramB);
var diagram1;
var diagram1Raw;
var diagram2;
var diagram2Raw;
    
if(diagramA != null && diagramB != null && diagramA != undefined && diagramB != undefined){
    
    switch (diagramA) {
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
        default:
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-update-conference-bpmn.bpmn');
            diagram1Raw = await diagram1.text();
            console.log(diagram1Raw);
    }

    switch (diagramB) {
        case 'colors.bpmn':
            diagram2 = await fetch('http://localhost:5173/src/bpmn_diagrams/colors.bpmn');
            diagram2Raw = await diagram2.text();
            console.log(diagram2Raw);
        break;
        case 'crs-delete-paper-bpmn.bpmn':
            diagram2 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-delete-paper-bpmn.bpmn');
            diagram2Raw = await diagram2.text();
            console.log(diagram2Raw);
        break;
        case 'crs-delete-subject-bpmn.bpmn':
            diagram2 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-delete-subject-bpmn.bpmn');
            diagram2Raw = await diagram2.text();
            console.log(diagram2Raw);
        break;
        case 'crs-get-conference-bpmn.bpmn':
            diagram2 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-get-conference-bpmn.bpmn');
            diagram2Raw = await diagram2.text();
            console.log(diagram2Raw);
        break;
        default:
            diagram2 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-update-conference-bpmn.bpmn');
            diagram2Raw = await diagram2.text();
            console.log(diagram2Raw);
    }

}else{
    //Carga de diagramas por defecto
    if(diagram1 === null || diagram1 === undefined){
        diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-get-conference-bpmn.bpmn');
        diagram1Raw = await diagram1.text();
        console.log("EL DIAGRAMA 1 (IZQUIERDA) SE HA CARGADO POR DEFECTO");
    }
    if(diagram2 === null || diagram2 === undefined){
        diagram2 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-update-conference-bpmn.bpmn');
        diagram2Raw = await diagram2.text();
        console.log("EL DIAGRAMA 2 (DERECHA) SE HA CARGADO POR DEFECTO");
    }
}



//const response = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-get-conference-bpmn.bpmn');
//const data = await response.text();
//console.log(data);

// ################ FIN ZONA DE PRUEBAS ############
////////////////////////////////////



// Cargar diagrama de la parte izquierda de la pantalla
bpmnVisualization.load(diagram1Raw, {
    fit: { type: FitType.Horizontal }
});

// Cargar diagrama de la parte derecha de la pantalla
bpmnVisualization2.load(diagram2Raw, {
    fit: { type: FitType.Center }
});


// retrieve data of the live instances
/*
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
*/

/*
bpmnVisualization2.bpmnElementsRegistry.getElementsByIds(ids).forEach((element) => {

    bpmnVisualization2.bpmnElementsRegistry.getElementsByIds(ids).forEach((element) => {
        console.log("MATRIZ ",[cont],[cont2],matrizz[cont][cont2]);
        console.log("ID ",ids[cont],ids[cont2]);
        if(matrizz[cont][cont2] < (1/3) ){
            bpmnVisualization.bpmnElementsRegistry.addCssClasses(ids[cont], 'low-match');
            bpmnVisualization2.bpmnElementsRegistry.addCssClasses(ids[cont2], 'low-match');
        } else if((1/3) <= matrizz[cont][cont2] && matrizz[cont][cont2] < (2/3) ){
            bpmnVisualization.bpmnElementsRegistry.addCssClasses(ids[cont], 'medium-match');
            bpmnVisualization2.bpmnElementsRegistry.addCssClasses(ids[cont2], 'medium-match');
        } else {
            bpmnVisualization.bpmnElementsRegistry.addCssClasses(ids[cont], 'high-match');
            bpmnVisualization2.bpmnElementsRegistry.addCssClasses(ids[cont2], 'high-match');
        }
        cont2 = cont2 + 1;
    });
    cont = cont + 1;
});*/


//Contadores que se usaran para el procesamiento de las tareas de los diagramas
var cont=0;
var cont2=0;
var pr;
var pr2;
var sim;

// Ejemplo de uso de la función
(async () => {
    //const taskNames = await getTaskNames('/src/csv_files/Get_conference.bpmn.csv');
    //console.log("Tareas leídas del archivo CSV Get conference");
    //console.log(taskNames);  // Imprime el array con los nombres de las tareas leídas del archivo CSV

    //###### NOTA IMPORTANTISIMA ######
    //De momento solo se pueden comparar dos diagramas entre si, de los cuales se dispongan las tareas en csv y la matriz de similitud
    //Los disponibles son:
    // Get conference - Update conference (con datos reales de un TFG anterior)
    // Delete paper - Delete subject (con datos simulados)
    //###############################

    switch (diagramA) {
        case 'colors.bpmn':
            
        break;
        case 'crs-delete-paper-bpmn.bpmn':
            pr = await getTaskNames("/src/csv_files/Delete_paper.bpmn.csv");
            sim = await readMatrixFromCsv("/src/similarity_matrix/similaritymatrix_CRS_Delete_paper_CRS-Delete_subject.csv");
        break;
        case 'crs-delete-subject-bpmn.bpmn':
            pr = await getTaskNames("/src/csv_files/Delete_subject.bpmn.csv");
            sim = await readMatrixFromCsv("/src/similarity_matrix/similaritymatrix_CRS_Delete_paper_CRS-Delete_subject.csv");
        break;
        case 'crs-get-conference-bpmn.bpmn':
            pr = await getTaskNames("/src/csv_files/Get_conference.bpmn.csv");
            sim = await readMatrixFromCsv("/src/similarity_matrix/similaritymatrix_CRS_Get_conference_CRS-Update_conference.csv");
        break;
        default:
            pr = await getTaskNames("/src/csv_files/Get_conference.bpmn.csv");
            sim = await readMatrixFromCsv("/src/similarity_matrix/similaritymatrix_CRS_Get_conference_CRS-Update_conference.csv");
    }

    switch (diagramB) {
        case 'colors.bpmn':
            
        break;
        case 'crs-delete-paper-bpmn.bpmn':
            pr2 = await getTaskNames("/src/csv_files/Delete_paper.bpmn.csv");
            sim = await readMatrixFromCsv("/src/similarity_matrix/similaritymatrix_CRS_Delete_paper_CRS-Delete_subject.csv");
        break;
        case 'crs-delete-subject-bpmn.bpmn':
            pr2 = await getTaskNames("/src/csv_files/Delete_subject.bpmn.csv");
            sim = await readMatrixFromCsv("/src/similarity_matrix/similaritymatrix_CRS_Delete_paper_CRS-Delete_subject.csv");
        break;
        case 'crs-get-conference-bpmn.bpmn':
            pr2 = await getTaskNames("/src/csv_files/Get_conference.bpmn.csv");
            sim = await readMatrixFromCsv("/src/similarity_matrix/similaritymatrix_CRS_Get_conference_CRS-Update_conference.csv");
        break;
        default:
            pr2 = await getTaskNames("/src/csv_files/Update_conference.bpmn.csv");
            sim = await readMatrixFromCsv("/src/similarity_matrix/similaritymatrix_CRS_Get_conference_CRS-Update_conference.csv");
    }

    //console.log(pr);
    //console.log(pr2);

    //Se almacena en pr los nombres de las tareas del diagrama A leidas desde el csv
    //console.log("Probando a obtener del csv Get conference los nombres de las tareas:");
    //pr = await getTaskNames("/src/csv_files/Get_conference.bpmn.csv");
    //console.log("nombres:", pr);
    
    //Se almacena en pr2 los nombres de las tareas del diagrama B leidos desde el csv
    //console.log("Probando a obtener del csv Update conference los nombres de las tareas:");
    //pr2 = await getTaskNames("/src/csv_files/Update_conference.bpmn.csv");
    //console.log("nombres:", pr2);
    
    //Se almacena en sim los valores de la matriz de similitud leidos desde el csv
    //console.log("Probando a obtener del csv los valores de la matriz de similitud:");
    //sim = await readMatrixFromCsv("/src/similarity_matrix/similaritymatrix_CRS_Get_conference_CRS-Update_conference.csv");
    //console.log(sim);
    
    //Se almacena en idsFromA los ids de las tareas del diagrama A convertidos a camelCase a partir de los nombres de las tareas
    const idsFromA = convertirACamelCase(pr).map(string => string.replace(/\r/g, ""));
    //Se almacena en idsFromB los ids de las tareas del diagrama B convertidos a camelCase a partir de los nombres de las tareas
    const idsFromB = convertirACamelCase(pr2).map(string => string.replace(/\r/g, ""));
    console.log("Ids convertidos para el diagrama A: ",idsFromA);
    console.log("Ids convertidos para el diagrama B: ",idsFromB);

    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

    //Valor maximo de similitud entre dos tareas para cada fila de la matriz
    let max_match = 0;
    //Valor minimo de similitud entre dos tareas para cada fila de la matriz
    let min_match = 1;
    //Nombre de la tarea del diagrama A con mayor similitud
    let taskFromA_max = null;
    //Nombre de la tarea del diagrama B con mayor similitud
    let taskFromB_max = null;
    //Nombre de la tarea del diagrama A con menor similitud
    let taskFromA_min = null;
    //Nombre de la tarea del diagrama B con menor similitud
    let taskFromB_min = null;
    //Nombres de las tareas del diagrama A con mayor similitud en cada fila de la matriz
    let maxTaskFromAArray = [];
    //Nombres de las tareas del diagrama A con menor similitud en cada fila de la matriz
    let minTaskFromAArray = [];
    //Nombres de las tareas del diagrama B con mayor similitud en cada fila de la matriz
    let maxTaskFromBArray = [];
    //Nombres de las tareas del diagrama B con mayor similitud en cada fila de la matriz
    let minTaskFromBArray = [];
    //Valores de similitud maximos para las tareas de A en cada fila de la matriz 
    //Nota: es el mismo que para las tareas de B
    let maxTaskFromAValuesArray = [];
    //Valores de similitud minimos para las tareas de A en cada fila de la matriz 
    let minTaskFromAValuesArray = [];
    
    /* 
    Se lee cada casilla de la matriz, se saca el maximo y el minimo de coincidencia para cada tarea de A respecto con cada tarea de B
    Falta intentar poner el css sobre cada tarea en base a su similitud
    
    for(cont = 0; cont < pr.length; cont++){
        for(cont2 = 0; cont2 < pr2.length; cont2++){
            //console.log("MATRIZ ",[cont],[cont2],sim[cont][cont2]);
            //console.log("ID A: ",pr[cont]," ID B: ",pr2[cont2]);
            //console.log("### Valor de la matriz-> ", sim[cont][cont2]);

            //Se hace un mejor hasta ahora para obtener los maximos y minimos en cada fila, junto con las tareas
            if(sim[cont][cont2] > max_match){
                max_match = sim[cont][cont2];
                taskFromA_max = pr[cont];
                taskFromB_max = pr2[cont2]; //taskFromB_max = pr2[cont];
            }
            if(sim[cont][cont2] < min_match){
                min_match = sim[cont][cont2];
                taskFromA_min = pr[cont];
                taskFromB_min = pr2[cont2];
            }
        }

        //Se meten las tareas en los arrays y lo mismo con los valores de similitud maximos y minimos
        maxTaskFromAArray.push(taskFromA_max);
        minTaskFromAArray.push(taskFromA_min);
        maxTaskFromBArray.push(taskFromB_max);
        minTaskFromBArray.push(taskFromB_min);
        maxTaskFromAValuesArray.push(max_match);
        minTaskFromAValuesArray.push(min_match);
        
        console.log("MAX MATCH: ",max_match, " - Task from A MAX: ",taskFromA_max, " - Task from B MAX: ",taskFromB_max);
        console.log("MIN MATCH: ",min_match, " - Task from A min: ",taskFromA_min, " - Task from B min: ",taskFromB_min);
        console.log(taskFromA_max, taskFromB_max, taskFromA_min, taskFromB_min);
            
        //console.log("Fin de la vuelta");
        //Resetear los valores de maximo y minimo para la siguiente vuelta
        max_match = 0;
        min_match = 1;
    }
    */

    //En proceso. La idea es trabajar con los ids para solucionar el problema comentado anteriormente
    for(cont = 0; cont < idsFromA.length; cont++){
        for(cont2 = 0; cont2 < idsFromB.length; cont2++){
            //console.log("MATRIZ ",[cont],[cont2],sim[cont][cont2]);
            //console.log("ID A: ",idsFromA[cont]," ID B: ",idsFromB[cont2]);
            //console.log("### Valor de la matriz-> ", sim[cont][cont2]);

            //Se hace un mejor hasta ahora para obtener los maximos y minimos en cada fila, junto con las tareas
            if(sim[cont][cont2] > max_match){
                max_match = sim[cont][cont2];
                taskFromA_max = idsFromA[cont];
                taskFromB_max = idsFromB[cont2]; //taskFromB_max = pr2[cont];
            }
            if(sim[cont][cont2] < min_match){
                min_match = sim[cont][cont2];
                taskFromA_min = idsFromA[cont];
                taskFromB_min = idsFromB[cont2];
            }
        }

        //Se meten las tareas en los arrays y lo mismo con los valores de similitud maximos y minimos
        maxTaskFromAArray.push(taskFromA_max);
        minTaskFromAArray.push(taskFromA_min);
        maxTaskFromBArray.push(taskFromB_max);
        minTaskFromBArray.push(taskFromB_min);
        maxTaskFromAValuesArray.push(max_match);
        minTaskFromAValuesArray.push(min_match);
        
        console.log("MAX MATCH: ",max_match, " - Task from A MAX: ",taskFromA_max, " - Task from B MAX: ",taskFromB_max);
        console.log("MIN MATCH: ",min_match, " - Task from A min: ",taskFromA_min, " - Task from B min: ",taskFromB_min);
        console.log(taskFromA_max, taskFromB_max, taskFromA_min, taskFromB_min);
            
        //console.log("Fin de la vuelta");
        //Resetear los valores de maximo y minimo para la siguiente vuelta
        max_match = 0;
        min_match = 1;
    }
    //Hasta aqui

    /*console.log("Recorriendo la lista de maxima coincidencia para A:",maxTaskFromAArray.length)
    maxTaskFromAArray.forEach((element) => {
        console.log(element);
    });*/
    console.log("Recorriendo la lista de minima coincidencia para A:",minTaskFromAArray.length)
    minTaskFromAArray.forEach((element) => {
        console.log(element);
    });
    /*console.log("Recorriendo la lista de maxima coincidencia para B:",maxTaskFromAArray.length)
    maxTaskFromBArray.forEach((element) => {
        console.log(element);
    });*/
    console.log("Recorriendo la lista de minima coincidencia para B:",minTaskFromBArray.length)
    minTaskFromBArray.forEach((element) => {
        console.log(element);
    });

    // ############################################################################################################
    //NOTA IMPORTANTE: NO PUEDO CONVERTIR YA LOS ARRAY DE MAXIMOS Y MINIMOS A IDENTIFICADORES, DEBO HACERLO ANTES
    //#############################################################################################################

    //Se convierten los nombres de las tareas con el maximo y minimo de coincidencia a identificadores
    //con .map(string => string.replace(/\r/g, "")) se esta eliminando el retorno de carro de cada string del array
    /*
    const id_max_tasks_from_A = convertirACamelCase(maxTaskFromAArray).map(string => string.replace(/\r/g, ""));
    const id_min_tasks_from_A = convertirACamelCase(minTaskFromAArray).map(string => string.replace(/\r/g, ""));
    const id_max_tasks_from_B = convertirACamelCase(maxTaskFromBArray).map(string => string.replace(/\r/g, ""));
    const id_min_tasks_from_B = convertirACamelCase(minTaskFromBArray).map(string => string.replace(/\r/g, ""));
    console.log("ID de la lista de maxima coincidencia para A",id_max_tasks_from_A);
    console.log("ID de la lista de maxima coincidencia para B",id_max_tasks_from_B);
    console.log("ID de la lista de minima coincidencia para A",id_min_tasks_from_A);
    console.log("ID de la lista de minima coincidencia para B",id_min_tasks_from_B);
    */

    //En proceso
    const id_max_tasks_from_A = maxTaskFromAArray.map(string => string.replace(/\r/g, ""));
    const id_min_tasks_from_A = minTaskFromAArray.map(string => string.replace(/\r/g, ""));
    const id_max_tasks_from_B = maxTaskFromBArray.map(string => string.replace(/\r/g, ""));
    const id_min_tasks_from_B = minTaskFromBArray.map(string => string.replace(/\r/g, ""));
    console.log("ID de la lista de maxima coincidencia para A",id_max_tasks_from_A);
    console.log("ID de la lista de maxima coincidencia para B",id_max_tasks_from_B);
    console.log("ID de la lista de minima coincidencia para A",id_min_tasks_from_A);
    console.log("ID de la lista de minima coincidencia para B",id_min_tasks_from_B);
    //Hasta aqui

    var selected = localStorage.getItem("selected");
    console.log("Selected: " + selected);

    if(selected == 1){  //Si se selecciona la opcion de mostrar las tareas con menor similitud

        // En proceso
        //Se colorean las tareas del diagrama A con baja coincidencia respecto a tareas del diagrama B
        for(cont=0; cont < id_min_tasks_from_A.length; cont++){
            //bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'high-match');
            //console.log("/AAAAAAAAA/", id_max_tasks_from_A[cont]);
            bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_min_tasks_from_A[cont], 'low-match');
        }
        //Hasta aqui

        //En proceso
        //Se colorean las tareas del diagrama B con baja coincidencia respecto a tareas del diagrama A
        for(cont=0; cont < id_min_tasks_from_B.length; cont++){
            //bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_B[cont], 'high-match');
            console.log("/BBBBBBBBB/", id_min_tasks_from_B[cont]);
            bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_min_tasks_from_B[cont], 'low-match');
        }
        //Hasta aqui

        //En proceso
        for(cont=0; cont < id_min_tasks_from_A.length; cont++){
            //bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'low-match');
            console.log("/CCCCCCCC/", id_min_tasks_from_A[cont]);
            bpmnVisualization.bpmnElementsRegistry.addOverlays(id_min_tasks_from_A[cont], {
                position: 'top-center',
                label: `${minTaskFromAValuesArray[cont]}`,
                style: {
                    font: { color: 'black', size: 16 },
                    fill: { color: 'white', opacity: 100 },
                    stroke: { color: 'black', width: 4 },
                },
            });
        }
        //Hasta aqui

        //En proceso
        for(cont=0; cont < id_min_tasks_from_B.length; cont++){
            //bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'low-match');
            console.log("/DDDDDDDD/", id_min_tasks_from_B[cont]);
            bpmnVisualization2.bpmnElementsRegistry.addOverlays(id_min_tasks_from_B[cont], {
                position: 'top-center',
                label: `${minTaskFromAValuesArray[cont]}`, //Nota: maxTaskFromAValuesArray tiene el mismo valor para A que para B
                style: {
                    font: { color: 'black', size: 16 },
                    fill: { color: 'white', opacity: 100 },
                    stroke: { color: 'black', width: 4 },
                },
            });
        }
        //Hasta aqui
    }
    else if(selected == 2){     //Si se selecciona la opcion de mostrar las tareas con menor similitud y especial
        // En proceso
        //Se colorean las tareeas del diagrama A con baja coincidencia respecto a tareas del diagrama B
        for(cont=0; cont < id_min_tasks_from_A.length; cont++){
            //bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'high-match');
            //console.log("/AAAAAAAAA/", id_max_tasks_from_A[cont]);
            if(minTaskFromAValuesArray[cont] <= (1/3)){
                bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_min_tasks_from_A[cont], 'low-match');
            }
            else if(minTaskFromAValuesArray[cont] > (1/3) && minTaskFromAValuesArray[cont] <= (2/3)){
                bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_min_tasks_from_A[cont], 'medium-match');
            }
            else{
                bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_min_tasks_from_A[cont], 'high-match');
            }
        }
        //Hasta aqui

        //En proceso
        //Se colorean las tareeas del diagrama B con baja coincidencia respecto a tareas del diagrama A
        for(cont=0; cont < id_min_tasks_from_B.length; cont++){
            //bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_B[cont], 'high-match');
            console.log("/BBBBBBBBB/", id_min_tasks_from_B[cont]);
            if(minTaskFromAValuesArray[cont] <= (1/3)){
                bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_min_tasks_from_B[cont], 'low-match');
            }
            else if(minTaskFromAValuesArray[cont] > (1/3) && minTaskFromAValuesArray[cont] <= (2/3)){
                bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_min_tasks_from_B[cont], 'medium-match');
            }
            else{
                bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_min_tasks_from_B[cont], 'high-match');
            }
        }
        //Hasta aqui

        //En proceso
        for(cont=0; cont < id_min_tasks_from_A.length; cont++){
            //bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'low-match');
            console.log("/CCCCCCCC/", id_min_tasks_from_A[cont]);
            bpmnVisualization.bpmnElementsRegistry.addOverlays(id_min_tasks_from_A[cont], {
                position: 'top-center',
                label: `${minTaskFromAValuesArray[cont]}`,
                style: {
                    font: { color: 'black', size: 16 },
                    fill: { color: 'white', opacity: 100 },
                    stroke: { color: 'black', width: 4 },
                },
            });
        }
        //Hasta aqui

        //En proceso
        for(cont=0; cont < id_min_tasks_from_B.length; cont++){
            //bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'low-match');
            console.log("/DDDDDDDD/", id_min_tasks_from_B[cont]);
            bpmnVisualization2.bpmnElementsRegistry.addOverlays(id_min_tasks_from_B[cont], {
                position: 'top-center',
                label: `${minTaskFromAValuesArray[cont]}`, //Nota: maxTaskFromAValuesArray tiene el mismo valor para A que para B
                style: {
                    font: { color: 'black', size: 16 },
                    fill: { color: 'white', opacity: 100 },
                    stroke: { color: 'black', width: 4 },
                },
            });
        }
        //Hasta aqui
    }
    else if(selected == 3){    //Si se selecciona la opcion de mostrar las tareas con mayor similitud

        //Se colorean las tareeas del diagrama A con alta coincidencia respecto a tareas del diagrama B
        for(cont=0; cont < id_max_tasks_from_A.length; cont++){
            //bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'high-match');
            //console.log("/AAAAAAAAA/", id_max_tasks_from_A[cont]);
            bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'high-match');
            
        }

        //Se colorean las tareeas del diagrama B con alta coincidencia respecto a tareas del diagrama A
        for(cont=0; cont < id_max_tasks_from_B.length; cont++){
            //bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_B[cont], 'high-match');
            console.log("/BBBBBBBBB/", id_max_tasks_from_B[cont]);
            bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_B[cont], 'high-match');
        }

        //PRUEBA PARA AGREGAR OVERLAY
        
        for(cont=0; cont < id_max_tasks_from_A.length; cont++){
            //bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'low-match');
            console.log("/CCCCCCCC/", id_max_tasks_from_A[cont]);
            bpmnVisualization.bpmnElementsRegistry.addOverlays(id_max_tasks_from_A[cont], {
                position: 'top-center',
                label: `${maxTaskFromAValuesArray[cont]}`,
                style: {
                    font: { color: 'black', size: 16 },
                    fill: { color: 'white', opacity: 100 },
                    stroke: { color: 'black', width: 4 },
                },
            });
        }
        
        for(cont=0; cont < id_max_tasks_from_B.length; cont++){
            //bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'low-match');
            console.log("/DDDDDDDD/", id_max_tasks_from_B[cont]);
            bpmnVisualization2.bpmnElementsRegistry.addOverlays(id_max_tasks_from_B[cont], {
                position: 'top-center',
                label: `${maxTaskFromAValuesArray[cont]}`, //Nota: maxTaskFromAValuesArray tiene el mismo valor para A que para B
                style: {
                    font: { color: 'black', size: 16 },
                    fill: { color: 'white', opacity: 100 },
                    stroke: { color: 'black', width: 4 },
                },
            });
        }
        
    }
    else if(selected == 4){     //Si se selecciona la opcion de mostrar las tareas con mayor similitud y especial
        
        //Se colorean las tareeas del diagrama A con alta coincidencia respecto a tareas del diagrama B
        for(cont=0; cont < id_max_tasks_from_A.length; cont++){
            //bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'high-match');
            //console.log("/AAAAAAAAA/", id_max_tasks_from_A[cont]);
            if(maxTaskFromAValuesArray[cont] <= (1/3)){
                bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'low-match');
            }
            else if(maxTaskFromAValuesArray[cont] > (1/3) && maxTaskFromAValuesArray[cont] <= (2/3)){
                bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'medium-match');
            }
            else{
                bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'high-match');
            }
        }

        
        //Se colorean las tareeas del diagrama B con alta coincidencia respecto a tareas del diagrama A
        for(cont=0; cont < id_max_tasks_from_B.length; cont++){
            //bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_B[cont], 'high-match');
            console.log("/BBBBBBBBB/", id_max_tasks_from_B[cont]);
            if(maxTaskFromAValuesArray[cont] <= (1/3)){
                bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_B[cont], 'low-match');
            }
            else if(maxTaskFromAValuesArray[cont] > (1/3) && maxTaskFromAValuesArray[cont] <= (2/3)){
                bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_B[cont], 'medium-match');
            }
            else{
                bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_B[cont], 'high-match');
            }
        }
        

        //PRUEBA PARA AGREGAR OVERLAY
        
        for(cont=0; cont < id_max_tasks_from_A.length; cont++){
            //bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'low-match');
            console.log("/CCCCCCCC/", id_max_tasks_from_A[cont]);
            bpmnVisualization.bpmnElementsRegistry.addOverlays(id_max_tasks_from_A[cont], {
                position: 'top-center',
                label: `${maxTaskFromAValuesArray[cont]}`,
                style: {
                    font: { color: 'black', size: 16 },
                    fill: { color: 'white', opacity: 100 },
                    stroke: { color: 'black', width: 4 },
                },
            });
        }
        

        
        for(cont=0; cont < id_max_tasks_from_B.length; cont++){
            //bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'low-match');
            console.log("/DDDDDDDD/", id_max_tasks_from_B[cont]);
            bpmnVisualization2.bpmnElementsRegistry.addOverlays(id_max_tasks_from_B[cont], {
                position: 'top-center',
                label: `${maxTaskFromAValuesArray[cont]}`, //Nota: maxTaskFromAValuesArray tiene el mismo valor para A que para B
                style: {
                    font: { color: 'black', size: 16 },
                    fill: { color: 'white', opacity: 100 },
                    stroke: { color: 'black', width: 4 },
                },
            });
        }
        
    }
    
    //FIN DE LA PRUEBA
    
    //Variables para guardar los id de tareas con mayor y menor similitud, junto con el valor de similitud
    const id_max_similitudes = [];
    const id_min_similitudes = [];
    //Reseteo de contador para el bucle
    cont=0;
    //cont2=0;
    while(id_max_tasks_from_A[cont] !== undefined || id_max_tasks_from_B[cont] !== undefined ){
        //id_max_similitudes.push("La tarea del diagrama <b>A</b> con id <b>" + id_max_tasks_from_A[cont] + "</b> tiene un mayor parecido con la tarea del diagrama <b>B</b> <b>" + id_max_tasks_from_B[cont] + "</b> con un valor de " + maxTaskFromAValuesArray[cont]);
        id_max_similitudes.push("The task in diagram <b>A</b> with id <b>" + id_max_tasks_from_A[cont] + "</b> has a greater similarity with the task in diagram <b>B</b> <b>" + id_max_tasks_from_B[cont] + "</b> with a value of <b>" + maxTaskFromAValuesArray[cont] + "</b>");
        cont++;
    }cont=0;
    console.log(id_max_similitudes);
    while(id_min_tasks_from_A[cont] !== undefined || id_min_tasks_from_B[cont] !== undefined ){
        //id_min_similitudes.push("La tarea del diagrama <b>A</b> con id <b>" + id_min_tasks_from_A[cont] + "</b> tiene un menor parecido con la tarea del diagrama <b>B</b> <b>" + id_min_tasks_from_B[cont] + "</b> con un valor de " + minTaskFromAValuesArray[cont]);
        id_min_similitudes.push("The task in diagram <b>A</b> with id <b>" + id_min_tasks_from_A[cont] + "</b> has less similarity with the task in diagram <b>B</b> <b>" + id_min_tasks_from_B[cont] + "</b> with a value of <b>" + minTaskFromAValuesArray[cont] + "</b>");
        cont++;
    }cont=0;
    console.log(id_min_similitudes);

    
    
    /*
    Al descomentar las 2 lineas de abajo, se descargan 2 csv con las maximas y minimas similitudes
    de los ids de las tareas del diagrama A respecto a los del diagrama B, junto con el valor de similitud
    */
    //escribirArrayEnCSV('id_max_similitudes.csv', id_max_similitudes);
    //escribirArrayEnCSV('id_min_similitudes.csv', id_min_similitudes);

    const res = document.getElementById("results");
    res.innerHTML += "<h2 style=background-color:red>Maximum similarity results </h2><br>";
    for(cont=0; cont < id_max_similitudes.length; cont++){
        res.innerHTML += id_max_similitudes[cont] + "<br>";
    }
    res.innerHTML += "<h2 style=background-color:lightgreen>Minimum similarity results </h2><br>";
    for(cont=0; cont < id_min_similitudes.length; cont++){
        res.innerHTML += id_min_similitudes[cont] + "<br>";
    }



    // ######### PRUEBA DE OVERLAY Y COLOREADO #########
    /*
    var prueba_clasificacion = ['obtain-allConference','obtain-allConference2','chooseConference','obtainConference'];
    var prueba_valores = [0.32,0.33,0.66,0.67];

    for(cont=0; cont < prueba_clasificacion.length; cont++){
        //bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'low-match');
        console.log("/¿?¿?¿?¿?¿?/", prueba_clasificacion[cont]);
        //clasificarValoresA(prueba_clasificacion, cont);
        if(prueba_valores[cont] <= (1/3) ){
            bpmnVisualization.bpmnElementsRegistry.addCssClasses(prueba_clasificacion[cont], 'low-match');
            console.log("VVVVVVVVVVVVVVVVVEEEEEEEEEEEEEEEERRRRRRRRRDDDDDDDDDDDDDDDEEEEEEEEE")
        } else if((1/3) < prueba_valores[cont] && prueba_valores[cont] <= (2/3) ){
            bpmnVisualization.bpmnElementsRegistry.addCssClasses(prueba_clasificacion[cont], 'medium-match');
            console.log("AAAAAAAMMMMMMAAAAAAAAAAAARRRRRRRIIIIIIIIILLLLLLLLLOOOOOOOOO");
        } else {
            bpmnVisualization.bpmnElementsRegistry.addCssClasses(prueba_clasificacion[cont], 'high-match');
            console.log("RRRRRRRRROOOOOOOOOOOOOOJJJJJJJJJJJOOOOOOOOOOOOO");
        }
        bpmnVisualization.bpmnElementsRegistry.addOverlays(prueba_clasificacion[cont], {
            position: 'top-center',
            label: `${prueba_valores[cont]}`, //Nota: maxTaskFromAValuesArray tiene el mismo valor para A que para B
            style: {
                font: { color: 'black', size: 16 },
                fill: { color: 'white', opacity: 100 },
                stroke: { color: 'black', width: 4 },
            },
        });
    }
    */
    // ######### FIN PRUEBA DE OVERLAY Y COLOREADO #########

})();







//Pruebas de ID y tag name utilizando el DOM
/*
let parser = new DOMParser();
let xmlDoc = parser.parseFromString(diagram2, "text/xml");
console.log(xmlDoc);
const element2 = xmlDoc.querySelector("[data-bpmn-id='asignarPuesto']");

console.log('##############################');
console.log(element2);

console.log(bpmnVisualization2.bpmnElementsRegistry);
const a = bpmnVisualization2.bpmnElementsRegistry;
const e = a.getElementsByIds('asignarPuesto');
console.log(e);
bpmnVisualization2.bpmnElementsRegistry.addCssClasses('asignarPuesto', 'low-match');


if(element2 != null){
    let container = element2.parentNode;
    let containerId = container.getAttribute("data-bpmn-id");
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
    element2.style.color = "red";
    element2.innerHTML = "Scan Invoiceddd";
}
*/

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

// ######################################## FUNCIONES ########################################

//Función para leer un archivo CSV y obtener un array con los nombres de las tareas
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

//Esta función recibe un array con los nombres de las tareas
//Devuelve un array con los id de las tareas siendo el nombre de la tarea convertido a camelCase
//Si aparece una misma tarea mas de una vez, se agrega un numero al final indicando la ocurrencia 
function convertirACamelCase(cadenas) {
    // Crea un objeto para contar las ocurrencias de cada cadena
    const contadores = {};
    
    // Convierte cada cadena en un array de palabras y aplica la función de transformación
    const camelCased = cadenas.map(cadena => {
        // Divide la cadena en palabras
        const palabras = cadena.split(' ');
        
        // Convierte la primera palabra a minúsculas y las demás a mayúsculas
        const camelCased = palabras.map((palabra, index) => {
            if (index === 0) {
                return palabra.toLowerCase();
            }
            return palabra[0].toUpperCase() + palabra.slice(1).toLowerCase();
        });
        
        // Une las palabras en una cadena y añade un sufijo si se ha repetido la cadena
        const resultado = camelCased.join('');
        if (contadores[resultado]) {
            contadores[resultado] += 1;
            return resultado + contadores[resultado];
        }
        contadores[resultado] = 1;
        return resultado;
    });
    
    return camelCased;
}

//This function receives a string or an array of strings and returns an array of strings
//The strings are converted to normal names
//Use this to convert the ids of the tasks to the task names
function convertToNames(inputStr){
    
    if(typeof inputStr === 'string'){
        inputStr = [inputStr];
    }
    let transformed = [];

    for(let string of inputStr){
        //Remove the numbers at the end of the string
        string = string.replace(/[0-9]+$/g, '');
        //Put the first letter in lowercase and split words
        let words = [string[0].toLowerCase()];

        for(let i = 1; i < string.length; i++){
            if(string[i].toUpperCase() === string[i]){
                if(words[words.length - 1].slice(-1) !== '-'){
                    words[words.length - 1] += ' ';
                }
                words[words.length - 1] += string[i].toLowerCase();
            }
            else{
                words[words.length - 1] += string[i].toLowerCase();
            }
        }
        //Put the first letter in uppercase
        words = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
        transformed.push(words.join(' ').replace(/ -/g, '-'));
    }
    return transformed;
}

function escribirArrayEnCSV(nombreArchivo, array) {
    // Comprueba que el navegador soporta la API de archivos
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        alert('Tu navegador no soporta la API de archivos');
        return;
    }
    
    // Crea un archivo Blob con los datos del array
    const datos = array.join('\n');  // une los elementos del array con saltos de línea
    const blob = new Blob([datos], { type: 'text/csv' });
    
    // Descarga el archivo
    
    const link = document.createElement('a');
    link.download = nombreArchivo;
    link.href = URL.createObjectURL(blob);
    link.click();
    
}

// Ejemplo de uso: escribe un array de strings en un archivo CSV llamado "miArchivo.csv"
//const miArray = ['Hola', 'Mundo', 'CSV'];
//escribirArrayEnCSV('miArchivo.csv', miArray);


function clasificarValoresA(valores, cont){
    if(valores[cont] <= (1/3) ){
        bpmnVisualization.bpmnElementsRegistry.addCssClasses(valores[cont], 'low-match');
        console.log(valores[cont]);
    } else if((1/3) < valores[cont][cont2] && valores[cont][cont2] <= (2/3) ){
        bpmnVisualization.bpmnElementsRegistry.addCssClasses(valores[cont], 'medium-match');
    } else {
        bpmnVisualization.bpmnElementsRegistry.addCssClasses(valores[cont], 'high-match');
    }
}

function clasificarValoresB(valores, cont){
    if(valores[cont] <= (1/3) ){
        bpmnVisualization2.bpmnElementsRegistry.addCssClasses(valores[cont], 'low-match');
    } else if((1/3) < valores[cont][cont2] && valores[cont][cont2] <= (2/3) ){
        bpmnVisualization2.bpmnElementsRegistry.addCssClasses(valores[cont], 'medium-match');
    } else {
        bpmnVisualization2.bpmnElementsRegistry.addCssClasses(valores[cont], 'high-match');
    }
}