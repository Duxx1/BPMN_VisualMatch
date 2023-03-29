import { BpmnVisualization, FitType, FlowKind, ShapeBpmnElementKind } from 'bpmn-visualization';
import './styles.css';
import { getActivitiesRunningInstances, getEdgesWaitingInstances, getPrueba } from './js/algorithms.js';
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
footer.innerText = `TFG-tool-version-${version.lib}`;

// ################ ZONA DE PRUEBAS ################
//Cargar en una variable el texto raw de los diagramas y luego renderizarlos en el load
var diagramA = localStorage.getItem("diagramA");
var diagramB = localStorage.getItem("diagramB");
//console.log(diagramA);
//console.log(diagramB);
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

// Cargar diagrama de la parte izquierda de la pantalla
bpmnVisualization.load(diagram1Raw, {
    fit: { type: FitType.Horizontal }
});

// Cargar diagrama de la parte derecha de la pantalla
bpmnVisualization2.load(diagram2Raw, {
    fit: { type: FitType.Center }
});

//Contadores que se usaran para el procesamiento de las tareas de los diagramas
//Contador para iterar sobre las tareas del diagrama A
var cont=0;
//Contador para iterar sobre las tareas del diagrama B
var cont2=0;
//Tareas del diagrama A
var pr;
//Tareas del diagrama B
var pr2;
//Valores de la matriz de similitud
var sim;
//Pools de las tareas del diagrama A
var poolsA;
//Pools de las tareas del diagrama B
var poolsB;

(async () => {
    
    //###### NOTA IMPORTANTISIMA ######
    //De momento solo se pueden comparar dos diagramas entre si, de los cuales se dispongan las tareas en csv y la matriz de similitud
    //Los disponibles son:
    // Get conference - Update conference (con datos reales de un TFG anterior)
    // Delete paper - Delete subject (con datos simulados)
    //###############################

    /*
    ¡¡¡¡¡¡ IMPORTANTE !!!!!!
    
    LA COMPARACION SOLO ES EN UN SENTIDO

    POR EJEMPLO GET - UPDATE

    PERO NO UPDATE -GET 

    Porque la matriz de similitud tiene N x M elementos y en cuanto un diagrama tenga mas tareas que el otro se producira un error
    */

    switch (diagramA) {
        case 'crs-delete-paper-bpmn.bpmn':
            pr = await getTaskNames("/src/csv_files/Delete_paper.bpmn.csv");
            pr = pr.map(string => string.replace(/\r/g, ""));
            sim = await readMatrixFromCsv("/src/similarity_matrix/similaritymatrix_CRS_Delete_paper_CRS-Delete_subject.csv");
        break;
        case 'crs-delete-subject-bpmn.bpmn':
            pr = await getTaskNames("/src/csv_files/Delete_subject.bpmn.csv");
            pr = pr.map(string => string.replace(/\r/g, ""));
            sim = await readMatrixFromCsv("/src/similarity_matrix/similaritymatrix_CRS_Delete_paper_CRS-Delete_subject.csv");
        break;
        case 'crs-get-conference-bpmn.bpmn':
            pr = await getTaskNames("/src/csv_files/Get_conference.bpmn.csv");
            pr = pr.map(string => string.replace(/\r/g, ""));
            sim = await readMatrixFromCsv("/src/similarity_matrix/similaritymatrix_CRS_Get_conference_CRS-Update_conference.csv");
            poolsA = await getTaskNames("/src/csv_files/crs-get-conference-bpmn.bpmnpools.csv");
            poolsA = poolsA.map(string => string.replace(/\r/g, ""));
        break;
        case 'crs-update-conference-bpmn.bpmn':
            pr = await getTaskNames("/src/csv_files/Update_conference.bpmn.csv");
            pr = pr.map(string => string.replace(/\r/g, ""));
            sim = await readMatrixFromCsv("/src/similarity_matrix/similaritymatrix_CRS_Get_conference_CRS-Update_conference.csv");
            poolsA = await getTaskNames("/src/csv_files/crs-update-conference-bpmn.bpmnpools.csv");
            poolsA = poolsA.map(string => string.replace(/\r/g, ""));
        break;
        default:
            pr = await getTaskNames("/src/csv_files/Get_conference.bpmn.csv");
            pr = pr.map(string => string.replace(/\r/g, ""));
            sim = await readMatrixFromCsv("/src/similarity_matrix/similaritymatrix_CRS_Get_conference_CRS-Update_conference.csv");
            poolsA = await getTaskNames("/src/csv_files/crs-get-conference-bpmn.bpmnpools.csv");
            poolsA = poolsA.map(string => string.replace(/\r/g, ""));
    }

    switch (diagramB) {
        case 'crs-delete-paper-bpmn.bpmn':
            pr2 = await getTaskNames("/src/csv_files/Delete_paper.bpmn.csv");
            pr2 = pr2.map(string => string.replace(/\r/g, ""));
            sim = await readMatrixFromCsv("/src/similarity_matrix/similaritymatrix_CRS_Delete_paper_CRS-Delete_subject.csv");
        break;
        case 'crs-delete-subject-bpmn.bpmn':
            pr2 = await getTaskNames("/src/csv_files/Delete_subject.bpmn.csv");
            pr2 = pr2.map(string => string.replace(/\r/g, ""));
            sim = await readMatrixFromCsv("/src/similarity_matrix/similaritymatrix_CRS_Delete_paper_CRS-Delete_subject.csv");
        break;
        case 'crs-get-conference-bpmn.bpmn':
            pr2 = await getTaskNames("/src/csv_files/Get_conference.bpmn.csv");
            pr2 = pr2.map(string => string.replace(/\r/g, ""));
            sim = await readMatrixFromCsv("/src/similarity_matrix/similaritymatrix_CRS_Get_conference_CRS-Update_conference.csv");
            poolsB = await getTaskNames("/src/csv_files/crs-get-conference-bpmn.bpmnpools.csv");
            poolsB = poolsB.map(string => string.replace(/\r/g, ""));
        break;
        default:
            pr2 = await getTaskNames("/src/csv_files/Update_conference.bpmn.csv");
            pr2 = pr2.map(string => string.replace(/\r/g, ""));
            sim = await readMatrixFromCsv("/src/similarity_matrix/similaritymatrix_CRS_Get_conference_CRS-Update_conference.csv");
            poolsB = await getTaskNames("/src/csv_files/crs-update-conference-bpmn.bpmnpools.csv");
            poolsB = poolsB.map(string => string.replace(/\r/g, ""));
    }

    //console.log(pr);
    //console.log(pr2);

    //Se tiene en pr los nombres de las tareas del diagrama A leidas desde el csv
    //console.log("nombres:", pr);
    
    //Se tiene en pr2 los nombres de las tareas del diagrama B leidos desde el csv
    //console.log("nombres:", pr2);
    
    //Se tiene en sim los valores de la matriz de similitud leidos desde el csv
    //console.log(sim);
    
    //Se almacena en idsFromA los ids de las tareas del diagrama A convertidos a camelCase a partir de los nombres de las tareas
    let idsFromA = convertirACamelCase(pr).map(string => string.replace(/\r/g, "")).map(string => string.replace(/\r/g, ""));;
    //Se almacena en idsFromB los ids de las tareas del diagrama B convertidos a camelCase a partir de los nombres de las tareas
    let idsFromB = convertirACamelCase(pr2).map(string => string.replace(/\r/g, "")).map(string => string.replace(/\r/g, ""));;
    console.log("Ids convertidos para el diagrama A: ",idsFromA);
    console.log("Ids convertidos para el diagrama B: ",idsFromB);

    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

    //Nuevo
    console.log("@@@@@@@@@ CONVERTIR ID A NOMBRES @@@@@@@@@@@@");
    const namesFromA = convertToNames(idsFromA).map(string => string.replace(/\r/g, ""));
    console.log("Nombres convertidos para el diagrama A: ", namesFromA);
    const namesFromB = convertToNames(idsFromB).map(string => string.replace(/\r/g, ""));
    console.log("Nombres convertidos para el diagrama B: ", namesFromB);

    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    //Hasta aqui

    console.log("@@@@@@@@@@@@@@@ POOLS DIAGRAMA A @@@@@@@@@@@@@@@@@@@@");
    console.log("Pools del diagrama A: ", poolsA);
    console.log("@@@@@@@@@@@@@@@ POOLS DIAGRAMA B @@@@@@@@@@@@@@@@@@@@");
    console.log("Pools del diagrama B: ", poolsB);

    //Nuevo
    console.log("@@@@@@@@@@@@@@@ TAREAS DIAGRAMA A @@@@@@@@@@@@@@@@@@@@")
    let idPoolsA = new Map();
    for(var i=0; i<pr.length; i++){
        console.log("Tarea: ",pr[i]," - ID: " + idsFromA[i] + " - " + "pool: " + poolsA[i]);
        idPoolsA.set(idsFromA[i], poolsA[i]);
        console.log(idPoolsA.get(idsFromA[i]))
    }
    //idPoolsA.map(string => string.replace(/\r/g, ""));
    console.log({idPoolsA})

    console.log("@@@@@@@@@@@@@@@ TAREAS DIAGRAMA B @@@@@@@@@@@@@@@@@@@@");
    
    let idPoolsB = new Map();
    for(var i=0; i<pr2.length; i++){
        console.log("Tarea ",pr2[i]," - ID: " + idsFromB[i] + " - " + "pool: " + poolsB[i]);
        idPoolsB.set(idsFromB[i], poolsB[i]);
        console.log(idPoolsB.get(idsFromB[i]));
    }
    console.log({idPoolsB});

    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    //Hasta aqui

    //Valor maximo de similitud entre dos tareas para cada fila de la matriz
    let max_match = 0;
    //Valor minimo de similitud entre dos tareas para cada fila de la matriz
    let min_match = 1;
    
    //ID de la tarea del diagrama A con mayor similitud
    let taskFromA_max = null;
    //ID de la tarea del diagrama B con mayor similitud
    let taskFromB_max = null;
    //ID de la tarea del diagrama A con menor similitud
    let taskFromA_min = null;
    //ID de la tarea del diagrama B con menor similitud
    let taskFromB_min = null;

    //Pool para la tarea del diagrama A con mayor similitud en cada iteracion
    let maxTmpPoolA = null;
    //Pool para la tarea del diagrama B con mayor similitud en cada iteracion
    let maxTmpPoolB = null;
    //Pool para la tarea del diagrama A con menor similitud en cada iteracion
    let minTmpPoolA = null;
    //Pool para la tarea del diagrama B con menor similitud en cada iteracion
    let minTmpPoolB = null;
    //Pool para la tarea del diagrama A con mayor similitud anterior en la iteracion
    let oldMaxTmpPoolA = null;
    //Pool para la tarea del diagrama B con mayor similitud anterior en la iteracion
    let oldMaxTmpPoolB = null;
    //Pool para la tarea del diagrama A con menor similitud anterior en la iteracion
    let oldMinTmpPoolA = null;
    //Pool para la tarea del diagrama B con menor similitud anterior en la iteracion
    let oldMinTmpPoolB = null;
    
    //IDs de las tareas del diagrama A con mayor similitud en cada fila de la matriz
    let maxTaskFromAArray = [];
    //IDs de las tareas del diagrama A con menor similitud en cada fila de la matriz
    let minTaskFromAArray = [];
    //IDs de las tareas del diagrama B con mayor similitud en cada fila de la matriz
    let maxTaskFromBArray = [];
    //IDs de las tareas del diagrama B con mayor similitud en cada fila de la matriz
    let minTaskFromBArray = [];

    //Valores de similitud maximos para las tareas de A en cada fila de la matriz 
    //Nota: es el mismo que para las tareas de B
    let maxTaskFromAValuesArray = [];
    //Valores de similitud minimos para las tareas de A en cada fila de la matriz
    //Nota: es el mismo que para las tareas de B
    let minTaskFromAValuesArray = [];
    
    //Guarda el valor del pool para los ids de las tareas de A con mayor similitud en cada fila de la matriz
    let maxTaskFromAPoolsArray = [];
    //Guarda el valor del pool para los ids de las tareas de B con menor similitud en cada fila de la matriz
    let maxTaskFromBPoolsArray = [];
    //Guarda el valor del pool para los ids de las tareas de A con menor similitud en cada fila de la matriz
    //Sincronizado con el array de minTaskFromAArray
    let minTaskFromAPoolsArray = [];
    //Guarda el valor del pool para los ids de las tareas de B con menor similitud en cada fila de la matriz
    //Sincronizado con el array de minTaskFromBArray
    let minTaskFromBPoolsArray = [];
    //Hasta aqui

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
                //Se guardan los pools de las tareas con mayor similitud
                oldMaxTmpPoolA = poolsA[cont];
                oldMaxTmpPoolB = poolsB[cont2];
            }
            if(sim[cont][cont2] == max_match){
                
                //Si las tareas tienen la misma similitud, se comprueba si el pool de la tarea de A es igual al de la tarea de B
                if(oldMaxTmpPoolA == poolsB[cont2]){
                //if(oldMaxTmpPoolA == poolsB[cont2]){
                    //Cuando estan en el mismo pool se actualiza la tarea con mayor similitud
                    max_match = sim[cont][cont2];
                    taskFromA_max = idsFromA[cont];
                    taskFromB_max = idsFromB[cont2];
                    //Se guardan los pools de las tareas con mayor similitud por si en la siguiente iteracion hay otra tarea con la misma similitud
                    //Para poder volver a comprobar los pools
                    oldMaxTmpPoolA = poolsA[cont];
                    oldMaxTmpPoolB = poolsB[cont2];
                }
                
            }

            if(sim[cont][cont2] < min_match){
                min_match = sim[cont][cont2];
                taskFromA_min = idsFromA[cont];
                taskFromB_min = idsFromB[cont2];
                //Se guardan los pools de las tareas con menor similitud
                oldMinTmpPoolA = poolsA[cont];
                oldMinTmpPoolB = poolsB[cont2];
                //console.log("***** MENOR SIM Y PASA POR TAREA DE B: ",taskFromB_min, " - POOL: ",poolsB[cont2], " - SIM: ",sim[cont][cont2], " *****");
            }
            //if(sim[cont][cont2] >= min_match){
            if(sim[cont][cont2] == min_match){
                console.log("########## TAREA B: ", idsFromB[cont2],"  pool ",poolsB[cont2], " SIM: ", sim[cont][cont2], " ########################")
                if(oldMinTmpPoolA != poolsB[cont2]){
                    //Cuando estan en distinto pool se actualiza la tarea con menor similitud
                    min_match = sim[cont][cont2];
                    taskFromA_min = idsFromA[cont];
                    taskFromB_min = idsFromB[cont2];

                    //console.log("Valor min: ",min_match, "task A - ",taskFromA_min, "pool ", poolsA[cont], "task B - ",taskFromB_min, "pool ", poolsB[cont2]);
                    //Se guardan los pools de las tareas con menor similitud
                    oldMinTmpPoolA = poolsA[cont];
                    oldMinTmpPoolB = poolsB[cont2];
                    //
                    /*console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
                    console.log("Se ha actualizado la tarea")
                    console.log("MATCH: ",min_match, " - Task from A: ",taskFromA_min, " - Task from B: ",taskFromB_min);
                    console.log("POOL A: ",poolsA[cont], " - POOL B: ",poolsB[cont2]);
                    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");*/
                    //console.log("----- IGUAL SIM Y PASA POR TAREA DE B: ",taskFromB_min, " - POOL: ",poolsB[cont2], " -----");
                    //
                }
            }
        }
        
        //Se meten las tareas en los arrays y lo mismo con los valores de similitud maximos y minimos
        maxTaskFromAArray.push(taskFromA_max);
        minTaskFromAArray.push(taskFromA_min);
        maxTaskFromBArray.push(taskFromB_max);
        minTaskFromBArray.push(taskFromB_min);
        maxTaskFromAValuesArray.push(max_match);
        minTaskFromAValuesArray.push(min_match);

        //Nuevo
        //Se obtienen los pools de las tareas con mayor y menor similitud
        maxTmpPoolA = idPoolsA.get(taskFromA_max);
        //console.log("maxTmpPoolA: ",maxTmpPoolA);
        maxTaskFromAPoolsArray.push(maxTmpPoolA);

        maxTmpPoolB = idPoolsB.get(taskFromB_max);
        //console.log("maxTmpPoolB: ",maxTmpPoolB);
        maxTaskFromBPoolsArray.push(maxTmpPoolB);

        minTmpPoolA = idPoolsA.get(taskFromA_min);
        //console.log("minTmpPoolA: ",minTmpPoolA);
        minTaskFromAPoolsArray.push(minTmpPoolA);

        minTmpPoolB = idPoolsB.get(taskFromB_min);
        //console.log("minTmpPoolB: ",minTmpPoolB);
        minTaskFromBPoolsArray.push(minTmpPoolB);
        //Hasta aqui
        
        console.log("MAX MATCH: ",max_match, " - Task from A MAX: ",taskFromA_max, "- pool : ",maxTmpPoolA, " - Task from B MAX: ",taskFromB_max,"- pool : ",maxTmpPoolB);
        console.log("MIN MATCH: ",min_match, " - Task from A min: ",taskFromA_min, "- pool : ",minTmpPoolA," - Task from B min: ",taskFromB_min,"- pool : ",minTmpPoolB);
        
        //console.log("Fin de la vuelta");
        //Resetear los valores de maximo y minimo para la siguiente vuelta
        max_match = 0;
        min_match = 1;
    }
    //Hasta aqui

    //Nuevo

    console.log("---------------------- MAX POOLS FROM A AND IDS ----------------------");
    console.log(maxTaskFromAPoolsArray);

    for(let i = 0; i < maxTaskFromAPoolsArray.length; i++){
        console.log("Tarea ",maxTaskFromAArray[i]," pool: ",maxTaskFromAPoolsArray[i]);
    }

    console.log("---------------------- MAX POOLS FROM B AND IDS ----------------------");
    console.log(maxTaskFromBPoolsArray);

    for(let i = 0; i < maxTaskFromBPoolsArray.length; i++){
        console.log("Tarea ",maxTaskFromBArray[i]," pool: ",maxTaskFromBPoolsArray[i]);
    }
    
    console.log("---------------------- MIN POOLS FROM A AND IDS ----------------------");
    console.log(minTaskFromAPoolsArray);

    for(let i = 0; i < minTaskFromAPoolsArray.length; i++){
        console.log("Tarea ",minTaskFromAArray[i]," pool: ",minTaskFromAPoolsArray[i]);
    }

    console.log("---------------------- MIN POOLS FROM B AND IDS ----------------------");
    console.log(minTaskFromBPoolsArray);

    for(let i = 0; i < minTaskFromBPoolsArray.length; i++){
        console.log("Tarea ",minTaskFromBArray[i]," pool: ",minTaskFromBPoolsArray[i]);
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

    //con .map(string => string.replace(/\r/g, "")) se esta eliminando el retorno de carro de cada string del array

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

        //Se colorean las tareas del diagrama A con baja coincidencia respecto a tareas del diagrama B
        for(cont=0; cont < id_min_tasks_from_A.length; cont++){
            //bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'high-match');
            //console.log("/AAAAAAAAA/", id_max_tasks_from_A[cont]);
            bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_min_tasks_from_A[cont], 'low-match');
        }

        //Se colorean las tareas del diagrama B con baja coincidencia respecto a tareas del diagrama A
        for(cont=0; cont < id_min_tasks_from_B.length; cont++){
            //bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_B[cont], 'high-match');
            console.log("/BBBBBBBBB/", id_min_tasks_from_B[cont]);
            bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_min_tasks_from_B[cont], 'low-match');
        }

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
    }
    else if(selected == 2){     //Si se selecciona la opcion de mostrar las tareas con menor similitud y especial
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
    else{
        //Se colorean las tareas del diagrama A con baja coincidencia respecto a tareas del diagrama B
        for(cont=0; cont < id_min_tasks_from_A.length; cont++){
            //bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'high-match');
            //console.log("/AAAAAAAAA/", id_max_tasks_from_A[cont]);
            bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_min_tasks_from_A[cont], 'low-match');
        }

        //Se colorean las tareas del diagrama B con baja coincidencia respecto a tareas del diagrama A
        for(cont=0; cont < id_min_tasks_from_B.length; cont++){
            //bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_B[cont], 'high-match');
            console.log("/BBBBBBBBB/", id_min_tasks_from_B[cont]);
            bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_min_tasks_from_B[cont], 'low-match');
        }

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

})();


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