import { BpmnVisualization, FitType } from 'bpmn-visualization';
import '/src/css/styles.css';
import { readMatrixFromCsv } from '/src/js/read_csv.js';

// Variable to store the diagram on the left side of the screen
const bpmnVisualization = new BpmnVisualization({
    container: 'parte-izquierda',
    navigation: { enabled: true },
});
// Variable to store the diagram on the right side of the screen
const bpmnVisualization2 = new BpmnVisualization({
    container: 'parte-derecha',
    navigation: { enabled: true },
});

// Just for displaying my title and version of the tool
const footer = document.querySelector('footer');
const version = bpmnVisualization.getVersion();
footer.innerText = `TFG-tool-version-${version.lib}`;

var diagramA = localStorage.getItem("diagramA");
var diagramB = localStorage.getItem("diagramB");

var diagram1;
var diagram1Raw;
var diagram2;
var diagram2Raw;
    
if(diagramA != null && diagramB != null && diagramA != undefined && diagramB != undefined){
    
    switch (diagramA) {
        case 'crs-createarticle.bpmn':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-createarticle.bpmn');
            diagram1Raw = await diagram1.text();
        break;
        case 'crs-updatereviewer.bpmn':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-updatereviewer.bpmn');
            diagram1Raw = await diagram1.text();
        break;
        case 'crs-updatearticle.bpmn':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-updatearticle.bpmn');
            diagram1Raw = await diagram1.text();
        break;
        case 'crs-deletetrack.bpmn':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-deletetrack.bpmn');
            diagram1Raw = await diagram1.text();
        break;
        /*
        case '':
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/');
            diagram1Raw = await diagram1.text();
        break;
        */
        default:
            diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-createarticle.bpmn');
            diagram1Raw = await diagram1.text();
    }

    switch (diagramB) {
        case 'crs-deletetrack.bpmn':
            diagram2 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-deletetrack.bpmn');
            diagram2Raw = await diagram2.text();
        break;
        case 'crs-updatetrack.bpmn':
            diagram2 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-updatetrack.bpmn');
            diagram2Raw = await diagram2.text();
        break;
        case 'crs-getreport.bpmn':
            diagram2 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-getreport.bpmn');
            diagram2Raw = await diagram2.text();
        break;
        case 'crs-getpaper.bpmn':
            diagram2 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-getpaper.bpmn');
            diagram2Raw = await diagram2.text();
        break;
        /*
        case '':
            diagram2 = await fetch('http://localhost:5173/src/bpmn_diagrams/');
            diagram2Raw = await diagram2.text();
        break;
        */
        default:
            diagram2 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-deletetrack.bpmn');
            diagram2Raw = await diagram2.text();
    }

}else{
    //Carga de diagramas por defecto
    if(diagram1 === null || diagram1 === undefined){
        diagram1 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-createarticle.bpmn');
        diagram1Raw = await diagram1.text();
    }
    if(diagram2 === null || diagram2 === undefined){
        diagram2 = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-deletetrack.bpmn');
        diagram2Raw = await diagram2.text();
    }
}

// Load diagram from left side of screen
bpmnVisualization.load(diagram1Raw, {
    fit: { type: FitType.Horizontal }
});

// Load diagram from right side of screen
bpmnVisualization2.load(diagram2Raw, {
    fit: { type: FitType.Center }
});

// Counters to be used for the processing of diagram tasks
// Counter for iterating over the tasks in diagram A
var cont=0;
// Counter for iterating over the tasks in diagram B
var cont2=0;
// Diagram A tasks
var pr;
// Diagram B tasks
var pr2;
// Values of the similarity matrix
var sim;
// Pools of the tasks in diagram A
var poolsA;
// Pools of the tasks in diagram B
var poolsB;

(async () => {
    
    switch (diagramA) {
        case 'crs-createarticle.bpmn':
            pr = await getTaskNames("/src/csv_files/tasks_crs-createarticle.csv");
            pr = pr.map(string => string.replace(/\r/g, ""));
            //sim = await readMatrixFromCsv("/src/similarity_matrix/similarity_matrixLin_crs-createarticle_crs-deletetrack.csv");
            poolsA = await getTaskNames("/src/csv_files/crs-createarticle.bpmnpools.csv");
            poolsA = poolsA.map(string => string.replace(/\r/g, ""));
        break;
        case 'crs-updatereviewer.bpmn':
            pr = await getTaskNames("/src/csv_files/tasks_crs-updatereviewer.csv");
            pr = pr.map(string => string.replace(/\r/g, ""));
            //sim = await readMatrixFromCsv("/src/similarity_matrix/similarity_matrixLin_crs-updatereviewer_crs-updatetrack.csv");
            poolsA = await getTaskNames("/src/csv_files/crs-updatereviewer.bpmnpools.csv");
            poolsA = poolsA.map(string => string.replace(/\r/g, ""));
        break;
        case 'crs-updatearticle.bpmn':
            pr = await getTaskNames("/src/csv_files/tasks_crs-updatearticle.csv");
            pr = pr.map(string => string.replace(/\r/g, ""));
            //sim = await readMatrixFromCsv("/src/similarity_matrix/similarity_matrixLin_crs-updatearticle_crs-getreport.csv");
            poolsA = await getTaskNames("/src/csv_files/crs-updatearticle.bpmnpools.csv");
            poolsA = poolsA.map(string => string.replace(/\r/g, ""));
        break;
        case 'crs-deletetrack.bpmn':
            pr = await getTaskNames("/src/csv_files/tasks_crs-deletetrack.csv");
            pr = pr.map(string => string.replace(/\r/g, ""));
            //sim = await readMatrixFromCsv("/src/similarity_matrix/");
            poolsA = await getTaskNames("/src/csv_files/crs-deletetrack.bpmnpools.csv");
            poolsA = poolsA.map(string => string.replace(/\r/g, ""));
        break;
        /*
        case '':
            pr = await getTaskNames("/src/csv_files/");
            pr = pr.map(string => string.replace(/\r/g, ""));
            //sim = await readMatrixFromCsv("/src/similarity_matrix/");
            poolsA = await getTaskNames("/src/csv_files/");
            poolsA = poolsA.map(string => string.replace(/\r/g, ""));
        break;
        */
        default:
            pr = await getTaskNames("/src/csv_files/tasks_crs-createarticle.csv");
            pr = pr.map(string => string.replace(/\r/g, ""));
            //sim = await readMatrixFromCsv("/src/similarity_matrix/similarity_matrixLin_crs-createarticle_crs-deletetrack.csv");
            poolsA = await getTaskNames("/src/csv_files/crs-createarticle.bpmnpools.csv");
            poolsA = poolsA.map(string => string.replace(/\r/g, ""));
    }

    switch (diagramB) {
        case 'crs-deletetrack.bpmn':
            pr2 = await getTaskNames("/src/csv_files/tasks_crs-deletetrack.csv");
            pr2 = pr2.map(string => string.replace(/\r/g, ""));
            //sim = await readMatrixFromCsv("/src/similarity_matrix/similarity_matrixLin_crs-createarticle_crs-deletetrack.csv");
            poolsB = await getTaskNames("/src/csv_files/crs-deletetrack.bpmnpools.csv");
            poolsB = poolsB.map(string => string.replace(/\r/g, ""));
        break;
        case 'crs-updatetrack.bpmn':
            pr2 = await getTaskNames("/src/csv_files/tasks_crs-updatetrack.csv");
            pr2 = pr2.map(string => string.replace(/\r/g, ""));
            //sim = await readMatrixFromCsv("/src/similarity_matrix/similarity_matrixLin_crs-updatereviewer_crs-updatetrack.csv");
            poolsB = await getTaskNames("/src/csv_files/crs-updatetrack.bpmnpools.csv");
            poolsB = poolsB.map(string => string.replace(/\r/g, ""));
        break;
        case 'crs-getreport.bpmn':
            pr2 = await getTaskNames("/src/csv_files/tasks_crs-getreport.csv");
            pr2 = pr2.map(string => string.replace(/\r/g, ""));
            //sim = await readMatrixFromCsv("/src/similarity_matrix/similarity_matrixLin_crs-updatearticle_crs-getreport.csv");
            poolsB = await getTaskNames("/src/csv_files/crs-getreport.bpmnpools.csv");
            poolsB = poolsB.map(string => string.replace(/\r/g, ""));
        break;
        case 'crs-getpaper.bpmn':
            pr2 = await getTaskNames("/src/csv_files/tasks_crs-getpaper.csv");
            pr2 = pr2.map(string => string.replace(/\r/g, ""));
            //sim = await readMatrixFromCsv("/src/similarity_matrix/");
            poolsB = await getTaskNames("/src/csv_files/crs-getpaper.bpmnpools.csv");
            poolsB = poolsB.map(string => string.replace(/\r/g, ""));
        break;
        /*
        case '':
            pr2 = await getTaskNames("/src/csv_files/");
            pr2 = pr2.map(string => string.replace(/\r/g, ""));
            //sim = await readMatrixFromCsv("/src/similarity_matrix/");
            poolsB = await getTaskNames("/src/csv_files/");
            poolsB = poolsB.map(string => string.replace(/\r/g, ""));
        break;
        */
        default:
            pr2 = await getTaskNames("/src/csv_files/tasks_crs-deletetrack.csv");
            pr2 = pr2.map(string => string.replace(/\r/g, ""));
            //sim = await readMatrixFromCsv("/src/similarity_matrix/similarity_matrixLin_crs-createarticle_crs-deletetrack.csv");
            poolsB = await getTaskNames("/src/csv_files/crs-deletetrack.bpmnpools.csv");
            poolsB = poolsB.map(string => string.replace(/\r/g, ""));
    }

    // Decide which similarity matrix to use according to the diagrams
    if(diagramA == 'crs-createarticle.bpmn' && diagramB == 'crs-deletetrack.bpmn'){
        sim = await readMatrixFromCsv("/src/similarity_matrix/similarity_matrixLin_crs-createarticle_crs-deletetrack.csv");
    }
    else if(diagramA == 'crs-updatereviewer.bpmn' && diagramB == 'crs-updatetrack.bpmn'){
        sim = await readMatrixFromCsv("/src/similarity_matrix/similarity_matrixLin_crs-updatereviewer_crs-updatetrack.csv");
    }
    else if(diagramA == 'crs-updatearticle.bpmn' && diagramB == 'crs-getreport.bpmn'){
        sim = await readMatrixFromCsv("/src/similarity_matrix/similarity_matrixLin_crs-updatearticle_crs-getreport.csv");
    }
    else if(diagramA == 'crs-deletetrack.bpmn' && diagramB == 'crs-updatetrack.bpmn'){
        sim = await readMatrixFromCsv("/src/similarity_matrix/similarity_matrixLin_crs-deletetrack_crs-updatetrack.csv");
    }
    else if(diagramA == 'crs-updatearticle.bpmn' && diagramB == 'crs-getpaper.bpmn'){
        sim = await readMatrixFromCsv("/src/similarity_matrix/similarity_matrixLin_crs-updatearticle_crs-getpaper.csv");
    }
    /*
    else if(diagramA == '' && diagramB == ''){
        sim = await readMatrixFromCsv("/src/similarity_matrix/");
    }
    */
    else{
        sim = await readMatrixFromCsv("/src/similarity_matrix/similarity_matrixLin_crs-createarticle_crs-deletetrack.csv");
        alert("Warning. The selected diagrams are not suported together.\nPlease go to the info page and and read which diagrams you can compare.\nShowing preloaded comparison.")
        //sim = await readMatrixFromCsv("/src/similarity_matrix/");
    }
    
    // The ids of the tasks in diagram A converted to camelCase from the task names are stored in idsFromA
    let idsFromA = convertToCamelCase(pr).map(string => string.replace(/\r/g, "")).map(string => string.replace(/\r/g, ""));;
    // The ids of the tasks in diagram B converted to camelCase from the task names are stored in idsFromB
    let idsFromB = convertToCamelCase(pr2).map(string => string.replace(/\r/g, "")).map(string => string.replace(/\r/g, ""));;
    
    const namesFromA = convertToNames(idsFromA).map(string => string.replace(/\r/g, ""));
    const namesFromB = convertToNames(idsFromB).map(string => string.replace(/\r/g, ""));

    let idPoolsA = new Map();
    for(var i=0; i<pr.length; i++){
        idPoolsA.set(idsFromA[i], poolsA[i]);
    }
    //idPoolsA.map(string => string.replace(/\r/g, ""));
    
    let idPoolsB = new Map();
    for(var i=0; i<pr2.length; i++){
        idPoolsB.set(idsFromB[i], poolsB[i]);
    }

    // Maximum similarity value between two tasks for each row of the matrix
    let max_match = 0;
    // Minimum similarity value between two tasks for each row of the matrix
    let min_match = 1;
    
    // ID of the task with most similarity in diagram A
    let taskFromA_max = null;
    // ID of the task with most similarity in diagram B
    let taskFromB_max = null;
    // ID of the task with less similarity in diagram A
    let taskFromA_min = null;
    // ID of the task with less similarity in diagram B
    let taskFromB_min = null;

    // Pool for the task in diagram A with the highest similarity in each iteration
    let maxTmpPoolA = null;
    // Pool for the task in diagram B with the highest similarity in each iteration
    let maxTmpPoolB = null;
    // Pool for the task in diagram A with the lowest similarity in each iteration
    let minTmpPoolA = null;
    // Pool for the task in diagram B with the lowest similarity in each iteration
    let minTmpPoolB = null;
    // Pool for the task in diagram A with the highest similarity in the previous iteration
    let oldMaxTmpPoolA = null;
    // Pool for the task in diagram B with the highest similarity in the previous iteration
    let oldMaxTmpPoolB = null;
    // Pool for the task in diagram A with the lowest similarity in the previous iteration
    let oldMinTmpPoolA = null;
    // Pool for the task in diagram B with the lowest similarity in the previous iteration
    let oldMinTmpPoolB = null;
    
    // IDs of tasks in diagram A with the highest similarity in each row of the matrix
    let maxTaskFromAArray = [];
    // IDs of tasks in diagram A with the lowest similarity in each row of the matrix
    let minTaskFromAArray = [];
    // IDs of tasks in diagram B with the highest similarity in each row of the matrix
    let maxTaskFromBArray = [];
    // IDs of tasks in diagram B with the lowest similarity in each row of the matrix
    let minTaskFromBArray = [];

    // Maximum similarity values for the tasks of A in each row of the matrix
    // Note: it is the same as for the tasks in B
    let maxTaskFromAValuesArray = [];
    // Minimum similarity values for the tasks of A in each row of the matrix
    // Note: it is the same as for the tasks in B
    let minTaskFromAValuesArray = [];
    
    // Stores the value of the pool for the ids of the tasks from A with the highest similarity in each row of the matrix
    let maxTaskFromAPoolsArray = [];
    // Stores the value of the pool for the ids of the tasks from B with the highest similarity in each row of the matrix
    let maxTaskFromBPoolsArray = [];
    // Stores the value of the pool for the ids of the tasks from A with the lowest similarity in each row of the matrix
    // Synchronized with the array of minTaskFromAArray
    let minTaskFromAPoolsArray = [];
    // Stores the value of the pool for the ids of the tasks from B with the highest similarity in each row of the matrix
    // Synchronized with the array of minTaskFromBArray
    let minTaskFromBPoolsArray = [];

    for(cont = 0; cont < idsFromA.length; cont++){
        for(cont2 = 0; cont2 < idsFromB.length; cont2++){
            
            // It does a better so far to get the maximum and minimum in each row, along with the tasks
            if(sim[cont][cont2] > max_match){
                max_match = sim[cont][cont2];
                taskFromA_max = idsFromA[cont];
                taskFromB_max = idsFromB[cont2]; //taskFromB_max = pr2[cont];
                // The pools of tasks with the highest similarity are saved
                oldMaxTmpPoolA = poolsA[cont];
                oldMaxTmpPoolB = poolsB[cont2];
            }
            if(sim[cont][cont2] == max_match){
                
                // If the tasks have the same similarity, it is checked if the pool of A's task is the same as that of B's task
                if(oldMaxTmpPoolA == poolsB[cont2]){
                //if(oldMaxTmpPoolA == poolsB[cont2]){
                    // When they are in the same pool, the task with the most similarity is updated
                    max_match = sim[cont][cont2];
                    taskFromA_max = idsFromA[cont];
                    taskFromB_max = idsFromB[cont2];
                    // The pools of the tasks with the highest similarity are saved 
                    // in case in the next iteration there is another task with the same similarity so that the pools can be checked again
                    oldMaxTmpPoolA = poolsA[cont];
                    oldMaxTmpPoolB = poolsB[cont2];
                }
                
            }

            if(sim[cont][cont2] < min_match){
                min_match = sim[cont][cont2];
                taskFromA_min = idsFromA[cont];
                taskFromB_min = idsFromB[cont2];
                // The pools of the tasks with the lowest similarity are saved
                oldMinTmpPoolA = poolsA[cont];
                oldMinTmpPoolB = poolsB[cont2];
            }
            //if(sim[cont][cont2] >= min_match){
            if(sim[cont][cont2] == min_match){
                if(oldMinTmpPoolA != poolsB[cont2]){
                    // When they are in different pools, the task with the least similarity is updated
                    min_match = sim[cont][cont2];
                    taskFromA_min = idsFromA[cont];
                    taskFromB_min = idsFromB[cont2];

                    // The pools of the tasks with the lowest similarity are saved
                    oldMinTmpPoolA = poolsA[cont];
                    oldMinTmpPoolB = poolsB[cont2];
                    
                }
            }
        }
        
        // The tasks are put into the arrays and the same with the maximum and minimum similarity values
        maxTaskFromAArray.push(taskFromA_max);
        minTaskFromAArray.push(taskFromA_min);
        maxTaskFromBArray.push(taskFromB_max);
        minTaskFromBArray.push(taskFromB_min);
        maxTaskFromAValuesArray.push(max_match);
        minTaskFromAValuesArray.push(min_match);

        // The pools of the tasks with the highest and lowest similarity are obtained
        maxTmpPoolA = idPoolsA.get(taskFromA_max);
        maxTaskFromAPoolsArray.push(maxTmpPoolA);

        maxTmpPoolB = idPoolsB.get(taskFromB_max);
        maxTaskFromBPoolsArray.push(maxTmpPoolB);

        minTmpPoolA = idPoolsA.get(taskFromA_min);
        minTaskFromAPoolsArray.push(minTmpPoolA);

        minTmpPoolB = idPoolsB.get(taskFromB_min);
        minTaskFromBPoolsArray.push(minTmpPoolB);
        
        // Reset the maximum and minimum values for the next iteration
        max_match = 0;
        min_match = 1;
    }

    //By using .map(string => string.replace(/\r/g, "")) the carriage return of each string in the array is being eliminated

    const id_max_tasks_from_A = maxTaskFromAArray.map(string => string.replace(/\r/g, ""));
    const id_min_tasks_from_A = minTaskFromAArray.map(string => string.replace(/\r/g, ""));
    const id_max_tasks_from_B = maxTaskFromBArray.map(string => string.replace(/\r/g, ""));
    const id_min_tasks_from_B = minTaskFromBArray.map(string => string.replace(/\r/g, ""));

    var selected = localStorage.getItem("selected");

    if(selected == 1){  // If you select the option to display the tasks with the lowest similarity

        // The tasks in diagram A with low similarity with respect to tasks in diagram B are colored
        for(cont=0; cont < id_min_tasks_from_A.length; cont++){
            //bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'high-match');
            bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_min_tasks_from_A[cont], 'low-match');
        }

        // The tasks in diagram B with low similarity with respect to tasks in diagram A are colored
        for(cont=0; cont < id_min_tasks_from_B.length; cont++){
            //bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_B[cont], 'high-match');
            bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_min_tasks_from_B[cont], 'low-match');
        }

        for(cont=0; cont < id_min_tasks_from_A.length; cont++){
            //bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'low-match');
            bpmnVisualization.bpmnElementsRegistry.removeAllOverlays(id_min_tasks_from_A[cont]);
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
            bpmnVisualization2.bpmnElementsRegistry.removeAllOverlays(id_min_tasks_from_B[cont]);
            bpmnVisualization2.bpmnElementsRegistry.addOverlays(id_min_tasks_from_B[cont], {
                position: 'top-center',
                label: `${minTaskFromAValuesArray[cont]}`, //Note: maxTaskFromAValuesArray has the same value for A as for B
                style: {
                    font: { color: 'black', size: 16 },
                    fill: { color: 'white', opacity: 100 },
                    stroke: { color: 'black', width: 4 },
                },
            });
        }
    }
    else if(selected == 2){     // If you select the option to display the tasks with less similarity and special
        // The tasks in diagram A with low similarity with respect to tasks in diagram B are colored
        for(cont=0; cont < id_min_tasks_from_A.length; cont++){
            //bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'high-match');
            if(minTaskFromAValuesArray[cont] <= (1/3)){
                bpmnVisualization.bpmnElementsRegistry.removeCssClasses(id_min_tasks_from_A[cont], 'medium-match');
                bpmnVisualization.bpmnElementsRegistry.removeCssClasses(id_min_tasks_from_A[cont], 'high-match');
                bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_min_tasks_from_A[cont], 'low-match');
            }
            else if(minTaskFromAValuesArray[cont] > (1/3) && minTaskFromAValuesArray[cont] <= (2/3)){
                bpmnVisualization.bpmnElementsRegistry.removeCssClasses(id_min_tasks_from_A[cont], 'low-match');
                bpmnVisualization.bpmnElementsRegistry.removeCssClasses(id_min_tasks_from_A[cont], 'high-match');
                bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_min_tasks_from_A[cont], 'medium-match');
            }
            else{
                bpmnVisualization.bpmnElementsRegistry.removeCssClasses(id_min_tasks_from_A[cont], 'low-match');
                bpmnVisualization.bpmnElementsRegistry.removeCssClasses(id_min_tasks_from_A[cont], 'medium-match');
                bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_min_tasks_from_A[cont], 'high-match');
            }
        }

        // The tasks in diagram B with low similarity with respect to tasks in diagram A are colored
        for(cont=0; cont < id_min_tasks_from_B.length; cont++){
            //bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_B[cont], 'high-match');
            if(minTaskFromAValuesArray[cont] <= (1/3)){
                bpmnVisualization2.bpmnElementsRegistry.removeCssClasses(id_min_tasks_from_B[cont], 'medium-match');
                bpmnVisualization2.bpmnElementsRegistry.removeCssClasses(id_min_tasks_from_B[cont], 'high-match');
                bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_min_tasks_from_B[cont], 'low-match');
            }
            else if(minTaskFromAValuesArray[cont] > (1/3) && minTaskFromAValuesArray[cont] <= (2/3)){
                bpmnVisualization2.bpmnElementsRegistry.removeCssClasses(id_min_tasks_from_B[cont], 'low-match');
                bpmnVisualization2.bpmnElementsRegistry.removeCssClasses(id_min_tasks_from_B[cont], 'high-match');
                bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_min_tasks_from_B[cont], 'medium-match');
            }
            else{
                bpmnVisualization2.bpmnElementsRegistry.removeCssClasses(id_min_tasks_from_B[cont], 'medium-match');
                bpmnVisualization2.bpmnElementsRegistry.removeCssClasses(id_min_tasks_from_B[cont], 'low-match');
                bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_min_tasks_from_B[cont], 'high-match');
            }
        }

        for(cont=0; cont < id_min_tasks_from_A.length; cont++){
            //bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'low-match');
            bpmnVisualization.bpmnElementsRegistry.removeAllOverlays(id_min_tasks_from_A[cont]);
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
            bpmnVisualization2.bpmnElementsRegistry.removeAllOverlays(id_min_tasks_from_B[cont]);
            bpmnVisualization2.bpmnElementsRegistry.addOverlays(id_min_tasks_from_B[cont], {
                position: 'top-center',
                label: `${minTaskFromAValuesArray[cont]}`, // Note: maxTaskFromAValuesArray has the same value for A as for B
                style: {
                    font: { color: 'black', size: 16 },
                    fill: { color: 'white', opacity: 100 },
                    stroke: { color: 'black', width: 4 },
                },
            });
        }
    }
    else if(selected == 3){    // If you select the option to show the tasks with the highest similarity

        // The tasks in diagram A with high similarity with respect to tasks in diagram B are colored
        for(cont=0; cont < id_max_tasks_from_A.length; cont++){
            //bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'high-match');
            bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'high-match');
            
        }

        // The tasks in diagram B with high similarity with respect to tasks in diagram A are colored
        for(cont=0; cont < id_max_tasks_from_B.length; cont++){
            //bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_B[cont], 'high-match');
            bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_B[cont], 'high-match');
        }
        
        for(cont=0; cont < id_max_tasks_from_A.length; cont++){
            //bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'low-match');
            bpmnVisualization.bpmnElementsRegistry.removeAllOverlays(id_max_tasks_from_A[cont]);
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
            bpmnVisualization2.bpmnElementsRegistry.removeAllOverlays(id_max_tasks_from_B[cont]);
            bpmnVisualization2.bpmnElementsRegistry.addOverlays(id_max_tasks_from_B[cont], {
                position: 'top-center',
                label: `${maxTaskFromAValuesArray[cont]}`, // Note: maxTaskFromAValuesArray has the same value for A as for B
                style: {
                    font: { color: 'black', size: 16 },
                    fill: { color: 'white', opacity: 100 },
                    stroke: { color: 'black', width: 4 },
                },
            });
        }
        
    }
    else if(selected == 4){     // If you select the option to display the tasks with the most similarity and special
        
        // The tasks in diagram A with high similarity with respect to tasks in diagram B are colored
        for(cont=0; cont < id_max_tasks_from_A.length; cont++){
            //bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'high-match');
            if(maxTaskFromAValuesArray[cont] <= (1/3)){
                bpmnVisualization.bpmnElementsRegistry.removeCssClasses(id_max_tasks_from_A[cont], 'medium-match');
                bpmnVisualization.bpmnElementsRegistry.removeCssClasses(id_max_tasks_from_A[cont], 'high-match');
                bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'low-match');
            }
            else if(maxTaskFromAValuesArray[cont] > (1/3) && maxTaskFromAValuesArray[cont] <= (2/3)){
                bpmnVisualization.bpmnElementsRegistry.removeCssClasses(id_max_tasks_from_A[cont], 'low-match');
                bpmnVisualization.bpmnElementsRegistry.removeCssClasses(id_max_tasks_from_A[cont], 'high-match');
                bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'medium-match');
            }
            else{
                bpmnVisualization.bpmnElementsRegistry.removeCssClasses(id_max_tasks_from_A[cont], 'low-match');
                bpmnVisualization.bpmnElementsRegistry.removeCssClasses(id_max_tasks_from_A[cont], 'medium-match');
                bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'high-match');
            }
        }
        
        // The tasks in diagram B with high similarity with respect to tasks in diagram A are colored
        for(cont=0; cont < id_max_tasks_from_B.length; cont++){
            //bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_B[cont], 'high-match');
            if(maxTaskFromAValuesArray[cont] <= (1/3)){
                bpmnVisualization2.bpmnElementsRegistry.removeCssClasses(id_max_tasks_from_B[cont], 'medium-match');
                bpmnVisualization2.bpmnElementsRegistry.removeCssClasses(id_max_tasks_from_B[cont], 'high-match');
                bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_B[cont], 'low-match');
            }
            else if(maxTaskFromAValuesArray[cont] > (1/3) && maxTaskFromAValuesArray[cont] <= (2/3)){
                bpmnVisualization2.bpmnElementsRegistry.removeCssClasses(id_max_tasks_from_B[cont], 'low-match');
                bpmnVisualization2.bpmnElementsRegistry.removeCssClasses(id_max_tasks_from_B[cont], 'high-match');
                bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_B[cont], 'medium-match');
            }
            else{
                bpmnVisualization2.bpmnElementsRegistry.removeCssClasses(id_max_tasks_from_B[cont], 'low-match');
                bpmnVisualization2.bpmnElementsRegistry.removeCssClasses(id_max_tasks_from_B[cont], 'medium-match');
                bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_B[cont], 'high-match');
            }
        }
        
        for(cont=0; cont < id_max_tasks_from_A.length; cont++){
            //bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'low-match');
            bpmnVisualization.bpmnElementsRegistry.removeAllOverlays(id_max_tasks_from_A[cont]);
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
            bpmnVisualization2.bpmnElementsRegistry.removeAllOverlays(id_max_tasks_from_B[cont]);
            bpmnVisualization2.bpmnElementsRegistry.addOverlays(id_max_tasks_from_B[cont], {
                position: 'top-center',
                label: `${maxTaskFromAValuesArray[cont]}`, //Note: maxTaskFromAValuesArray has the same value for A as for B
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
            bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_min_tasks_from_A[cont], 'low-match');
        }

        //Se colorean las tareas del diagrama B con baja coincidencia respecto a tareas del diagrama A
        for(cont=0; cont < id_min_tasks_from_B.length; cont++){
            //bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_B[cont], 'high-match');
            bpmnVisualization2.bpmnElementsRegistry.addCssClasses(id_min_tasks_from_B[cont], 'low-match');
        }

        for(cont=0; cont < id_min_tasks_from_A.length; cont++){
            //bpmnVisualization.bpmnElementsRegistry.addCssClasses(id_max_tasks_from_A[cont], 'low-match');
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
    
    
    // Variables to store the ids of tasks with higher and lower similarity, together with the similarity value
    const id_max_similitudes = [];
    const id_min_similitudes = [];
    const names_max_similitudes = [];
    const names_min_similitudes = [];
    // Counter reset for the loop
    cont=0;
    let taskNamesArrayFromA_max = [];
    let taskNamesArrayFromB_max = [];
    taskNamesArrayFromA_max = convertToNames(id_max_tasks_from_A);
    taskNamesArrayFromB_max = convertToNames(id_max_tasks_from_B);

    let taskNamesArrayFromA_min = [];
    let taskNamesArrayFromB_min = [];
    taskNamesArrayFromA_min = convertToNames(id_min_tasks_from_A);
    taskNamesArrayFromB_min = convertToNames(id_min_tasks_from_B);

    while(id_max_tasks_from_A[cont] !== undefined || id_max_tasks_from_B[cont] !== undefined ){
        //id_max_similitudes.push("La tarea del diagrama <b>A</b> con id <b>" + id_max_tasks_from_A[cont] + "</b> tiene un mayor parecido con la tarea del diagrama <b>B</b> <b>" + id_max_tasks_from_B[cont] + "</b> con un valor de " + maxTaskFromAValuesArray[cont]);
        //id_max_similitudes.push("The task in diagram <b>A</b> with id <b>" + id_max_tasks_from_A[cont] + "</b> has a greater similarity with the task in diagram <b>B</b> <b>" + id_max_tasks_from_B[cont] + "</b> with a value of <b>" + maxTaskFromAValuesArray[cont] + "</b>");
        names_max_similitudes.push("The task in diagram <b>A</b> with name <b>" + taskNamesArrayFromA_max[cont] + "</b> in <b>pool " + maxTaskFromAPoolsArray[cont] + "</b> has a greater similarity with the task in diagram <b>B</b> <b>" + taskNamesArrayFromB_max[cont] + "</b> in <b>pool " + maxTaskFromBPoolsArray[cont] + "</b> with a value of <b>" + maxTaskFromAValuesArray[cont] + "</b>");
        cont++;
    }cont=0;
    while(id_min_tasks_from_A[cont] !== undefined || id_min_tasks_from_B[cont] !== undefined ){
        //id_min_similitudes.push("La tarea del diagrama <b>A</b> con id <b>" + id_min_tasks_from_A[cont] + "</b> tiene un menor parecido con la tarea del diagrama <b>B</b> <b>" + id_min_tasks_from_B[cont] + "</b> con un valor de " + minTaskFromAValuesArray[cont]);
        //id_min_similitudes.push("The task in diagram <b>A</b> with id <b>" + id_min_tasks_from_A[cont] + "</b> has less similarity with the task in diagram <b>B</b> <b>" + id_min_tasks_from_B[cont] + "</b> with a value of <b>" + minTaskFromAValuesArray[cont] + "</b>");
        names_min_similitudes.push("The task in diagram <b>A</b> with name <b>" + taskNamesArrayFromA_min[cont] + "</b> in <b>pool "+ minTaskFromAPoolsArray[cont] + "</b> has less similarity with the task in diagram <b>B</b> <b>" + taskNamesArrayFromB_min[cont] + "</b> in <b>pool " + minTaskFromBPoolsArray[cont] + "</b> with a value of <b>" + minTaskFromAValuesArray[cont] + "</b>");
        cont++;
    }cont=0;

    
    //cont2=0;
    /*while(id_max_tasks_from_A[cont] !== undefined || id_max_tasks_from_B[cont] !== undefined ){
        //id_max_similitudes.push("La tarea del diagrama <b>A</b> con id <b>" + id_max_tasks_from_A[cont] + "</b> tiene un mayor parecido con la tarea del diagrama <b>B</b> <b>" + id_max_tasks_from_B[cont] + "</b> con un valor de " + maxTaskFromAValuesArray[cont]);
        id_max_similitudes.push("The task in diagram <b>A</b> with id <b>" + id_max_tasks_from_A[cont] + "</b> has a greater similarity with the task in diagram <b>B</b> <b>" + id_max_tasks_from_B[cont] + "</b> with a value of <b>" + maxTaskFromAValuesArray[cont] + "</b>");
        cont++;
    }cont=0;
    while(id_min_tasks_from_A[cont] !== undefined || id_min_tasks_from_B[cont] !== undefined ){
        //id_min_similitudes.push("La tarea del diagrama <b>A</b> con id <b>" + id_min_tasks_from_A[cont] + "</b> tiene un menor parecido con la tarea del diagrama <b>B</b> <b>" + id_min_tasks_from_B[cont] + "</b> con un valor de " + minTaskFromAValuesArray[cont]);
        id_min_similitudes.push("The task in diagram <b>A</b> with id <b>" + id_min_tasks_from_A[cont] + "</b> has less similarity with the task in diagram <b>B</b> <b>" + id_min_tasks_from_B[cont] + "</b> with a value of <b>" + minTaskFromAValuesArray[cont] + "</b>");
        cont++;
    }cont=0;
    */

    let maxTotalSimilarity = checkTotalSimilarity(maxTaskFromAValuesArray);
    let minTotalSimilarity = checkTotalSimilarity(minTaskFromAValuesArray);
    
    /*
    By uncommenting the 2 lines below, 2 csv are downloaded with the maximum and minimum similarities 
    of the ids of the tasks in diagram A with respect to those in diagram B, together with the similarity value.
    */
    //writeArrayToCSV('id_max_similitudes.csv', id_max_similitudes);
    //writeArrayToCSV('id_min_similitudes.csv', id_min_similitudes);

    const res = document.getElementById("results");
    res.innerHTML += "<h2 style=background-color:lightgreen>Maximum similarity results </h2><br>";
    for(cont=0; cont < names_max_similitudes.length; cont++){
        //res.innerHTML += id_max_similitudes[cont] + "<br>";
        res.innerHTML += "<hr>"+ names_max_similitudes[cont] + "<br>";
    }
    res.innerHTML += "<hr><br><h2 style=background-color:lightcoral>Minimum similarity results </h2><br>";
    for(cont=0; cont < names_min_similitudes.length; cont++){
        //res.innerHTML += id_min_similitudes[cont] + "<br>";
        res.innerHTML += "<hr>"+ names_min_similitudes[cont] + "<br>";
    }


    // Get a reference to the DOM canvas element
    const $chart = document.querySelector("#chart");
    // The labels are those that go on the X-axis
    const tags = ["Average similarity between diagramas"]
    
    var maxSimData = {
        label: 'Maximum similarity',
        data: [maxTotalSimilarity],
        backgroundColor: 'rgba(220, 250, 205, 1)',
        borderColor: 'rgba(75, 255, 10, 1)',
        borderWidth: 2 // Edge width
    };
    var minSimData = {
        label: 'Minimum similarity',
        data: [minTotalSimilarity],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2 // Edge width
    };
    var chartDiagramsData = {
        labels: ["Maximum similarity", "Minimum similarity"],
        datasets: [maxSimData, minSimData]
    };
    new Chart($chart, {
        type: 'bar', // Bar plot
        data: {
            labels: tags,
            datasets: [
                maxSimData,
                minSimData,
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                },
            }
        }
    });


})();



// ###########################################################################################
// ######################################## FUNTIONS ########################################
// ###########################################################################################

// Function to read a CSV file and obtain an array of task names
async function getTaskNames(fileUrl) {
    // Gets the content of the CSV file
    const response = await fetch(fileUrl);
    const csvString = await response.text();
    
    // Splits the contents of the file into lines
    const lines = csvString.split('\n');
    
    // Splits each line into an array of values and extracts the first value (task name)
    const taskNames = lines.map(line => line.split(',')[0]);
    
    return taskNames;
}

// This function receives an array with the task names
// Returns an array with the task ids being the task name converted to camelCase
// If the same task appears more than once, a number is added at the end indicating the occurrence
function convertToCamelCase(strings) {
    // Creates an object to count the occurrences of each string
    const counters = {};
    
    // Convert each string to an array of words and apply the transformation function
    const camelCased = strings.map(str => {
        // Splits the string into words
        const words = str.split(' ');
        
        // Convert the first word to lowercase and the rest to uppercase
        const camelCased = words.map((word, index) => {
            if (index === 0) {
                return word.toLowerCase();
            }
            return word[0].toUpperCase() + word.slice(1).toLowerCase();
        });
        
        // Joins words in a string and adds a suffix if the string has been repeated
        const result = camelCased.join('');
        if (counters[result]) {
            counters[result] += 1;
            return result + counters[result];
        }
        counters[result] = 1;
        return result;
    });
    
    return camelCased;
}

// This function receives a string or an array of strings and returns an array of strings
// The strings are converted to normal names
// Use this function to convert the ids of the tasks to the task names
function convertToNames(inputStr){
    
    if(typeof inputStr === 'string'){
        inputStr = [inputStr];
    }
    let transformed = [];

    for(let string of inputStr){
        // Remove the numbers at the end of the string
        string = string.replace(/[0-9]+$/g, '');
        // Put the first letter in lowercase and split words
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
        // Put the first letter in uppercase
        words = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
        transformed.push(words.join(' ').replace(/ -/g, '-'));
    }
    return transformed;
}

function writeArrayToCSV(fileName, array) {
    // Check if the browser supports file API
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        alert('Your browser does not support the File API');
        return;
    }
    
    // Creates a blob file with array data
    const data = array.join('\n');  // joins array elements with line break
    const blob = new Blob([data], { type: 'text/csv' });
    
    // Descarga el archivo
    
    const link = document.createElement('a');
    link.download = fileName;
    link.href = URL.createObjectURL(blob);
    link.click();
    
}

// Calculates the total similarity from an array of values
function checkTotalSimilarity(values) {
    let accumulator = 0;
    let length = values.length;
    
    for(let i=0; i<values.length; i++){
        accumulator += parseFloat(values[i]);
    }
    return accumulator/length;
}
