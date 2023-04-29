// It is not used at the moment
function processBPMNFile(file) {
    // Regular expression to search for tasks
    const regexTask = /<(.*?)Task.*?name="(.*?)".*?id="(.*?)"/g;
    let modifiedFile = file;
    
    // Create a map for storing task names and their occurrence number
    let taskNames = new Map();
    
    // Apply regular expression to the file and search for all tasks
    while (regexTask.exec(file) !== null) {

        let taskType = match[1];
        let taskName = match[2];
        let taskId = match[3];
        
        // Convert the task name to camel case
        taskName = taskName.replace(/\s+(.)/g, function($1) { return $1.toUpperCase(); });
        taskName = taskName.replace(/\s/g, '');
        taskName = taskName[0].toLowerCase() + taskName.slice(1);
        
        // If a task with this name has already been found, add a number to the end of it
        if (taskNames.has(taskName)) {
            let count = taskNames.get(taskName);
            taskNames.set(taskName, count + 1);
            taskName += count;
        } else {
            taskNames.set(taskName, 1);
        }
        
        names.push(taskName);
        
        // Replace the task id with the name converted to camel case
        modifiedFile = modifiedFile.replace(`<${taskType}Task.*?name="${taskName}" id="${taskId}"`, `<${taskType}Task.*?name="${taskName}" id="${taskName}"`);
    }
    
    // Return the modified file
    return modifiedFile;
}

// This function receives the raw text from a .bpmn file and parses it
// Returns a raw .bpmn file with the task ids already set from the task names
function modifyBpmnFile(file) {
    // Regular expression to search for tasks
    let regexTask = /Task[\s\S]*?id="([\s\S]*?)"[\s\S]*?name="([\s\S]*?)"/g;
    let modifiedFile = file;
    let taskNames = new Map();
    let match;
    
    // Search for tasks in the file
    while ((match = regexTask.exec(file)) !== null) {
        
        let taskName = "";

        if(match[2] != "" && match[2] != null && match[2] != undefined){
            taskName = convertirACamelCase(match[2]);
        }
        else{
            taskName = match[1];
        }
        
        // If a task with this name has already been found, add a number to the end of it
        
        if (taskNames.has(taskName)) {
            let count = taskNames.get(taskName);
            taskNames.set(taskName, count + 2);
            taskName += count;
        } else {
            taskNames.set(taskName, 2);
        }
        // Replace the task id with the name converted to camel case
        let modifiedId = taskName;
        
        let idRegex = new RegExp(match[1], "g");
        
        modifiedFile = modifiedFile.replace(idRegex, modifiedId);
    }
    return modifiedFile;
}

// It is not used at the moment
function detectar(file) {
    // Regular expression to search for tasks
    let regexTask = /Task[\s\S]*?id="([\s\S]*?)"[\s\S]*?name="([\s\S]*?)"/g;
    
    let modifiedFile = file;
    let taskNames = new Map();
    let match;
    
    // Search for tasks in the file
    while ((match = regexTask.exec(file)) !== null) {
        
        let task=match[0];
        let taskWithId = task.replace(match[1],match[2]);
    }
}

// To download the file after parsing
const guardarArchivoDeTexto = (contenido, nombre) => {
    const a = document.createElement("a");
    const archivo = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(archivo);
    a.href = url;
    a.download = nombre;
    a.click();
    URL.revokeObjectURL(url);
}

const $botonDescargar = document.querySelector("#descargar");
$botonDescargar.onclick = () => {
    guardarArchivoDeTexto(modifiedFile, "archivo2.bpmn");
}

// Used in the modifyBpmnFile function to perform name to id parsing
function convertirACamelCase(cadenas) {
    // Creates an object to count the occurrences of each string
    const contadores = {};
    
    // Divides the string into words
    const palabras = cadenas.split(' ');
    
    // Convert the first word to lowercase and the rest to uppercase
    const camelCased = palabras.map((palabra, index) => {
        if (index === 0) {
            return palabra.toLowerCase();
        }
        return palabra[0].toUpperCase() + palabra.slice(1).toLowerCase();
    });
    
    // Joins the words in a string and adds a suffix if the string has been repeated
    const resultado = camelCased.join('');
    if (contadores[resultado]) {
        contadores[resultado] += 1;
        return resultado + contadores[resultado];
    }
    contadores[resultado] = 1;
    return resultado;
}

function addTaskPosition(rootStr) {
    // The first task will be number 1
    let taskCounter = 1;
    // Parse the bpmn file and get the elements
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(rootStr, "application/xml");
    const taskElems = xmlDoc.getElementsByTagName("*");
    
    for (let i = 0; i < taskElems.length; i++) {
        const elem = taskElems[i];
        const tagName = elem.tagName;
        // If the element is a task, add the attribute taskPosition
        if (tagName.includes("Task")) {
            elem.setAttribute("taskPosition", taskCounter);
            taskCounter++;
        }
    }
    
    return new XMLSerializer().serializeToString(xmlDoc);
}

// Obtain all the process elements from the bpmn and iterate over the elements of each process
// Add the attribute poolNumber to each task element of each process
function addPoolNumber(rootStr){
    // The first pool will be number 1
    let poolNumber = 1;
    // Parse the bpmn file and get the process elements
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(rootStr, "application/xml");
    const processElems = xmlDoc.getElementsByTagName("process");
    
    for (let i = 0; i < processElems.length; i++) {
        // Get task elements of each process
        const taskElems = processElems[i].getElementsByTagName("*");
        for (let j = 0; j < taskElems.length; j++) {
            const elem = taskElems[j];
            const tagName = elem.tagName;
            if (tagName.includes("Task")) {
                // Add the attribute poolNumber to each task element
                elem.setAttribute("poolNumber", poolNumber);
            }
        }
        poolNumber++;
    }
    
    return new XMLSerializer().serializeToString(xmlDoc);
}

let input = document.getElementById("file-input");
let unprocessedFiles = [];
let firstPart = 'http://localhost:5173/src/bpmn_diagrams/';
let fullPart= '';

// Iterate over the list of bpmn files in the uploaded folder and apply parsing to each file
input.addEventListener("change", function(e) {
    let files = e.target.files;
    // files is a list of File objects, representing each file in the selected directory
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        unprocessedFiles.push(file.name);
        fullPart = firstPart + file.name;
        process(fullPart, file.name);
    }
});

// To process each bpmn file
async function process(fullPart, fileName){
    const unprocessed = await fetch(fullPart);
    const rawUnprocessed = await unprocessed.text();
    
    let modifiedFile = modifyBpmnFile(rawUnprocessed);
    let modifiedFile2 = addTaskPosition(modifiedFile);
    let modifiedFile3 = addPoolNumber(modifiedFile2);
    
    guardarArchivoDeTexto(modifiedFile3, fileName);
}