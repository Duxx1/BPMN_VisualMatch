//De momento no se usa
function processBPMNFile(file) {
    // Expresión regular para buscar las tareas
    const regexTask = /<(.*?)Task.*?name="(.*?)".*?id="(.*?)"/g;
    let modifiedFile = file;
    
    // Crear un mapa para almacenar los nombres de tareas y su número de aparición
    let taskNames = new Map();
    
    // Aplicar la expresión regular al archivo y buscar todas las tareas
    while (regexTask.exec(file) !== null) {
        console.log("HAY MATCH #############################");
        let taskType = match[1];
        let taskName = match[2];
        let taskId = match[3];
        
        // Convertir el nombre de la tarea a camel case
        taskName = taskName.replace(/\s+(.)/g, function($1) { return $1.toUpperCase(); });
        taskName = taskName.replace(/\s/g, '');
        taskName = taskName[0].toLowerCase() + taskName.slice(1);
        
        // Si ya se ha encontrado una tarea con este nombre, añadirle un número al final
        if (taskNames.has(taskName)) {
            let count = taskNames.get(taskName);
            taskNames.set(taskName, count + 1);
            taskName += count;
        } else {
            taskNames.set(taskName, 1);
        }
        
        console.log(taskName);
        names.push(taskName);
        
        // Reemplazar el id de la tarea por el nombre convertido a camel case
        modifiedFile = modifiedFile.replace(`<${taskType}Task.*?name="${taskName}" id="${taskId}"`, `<${taskType}Task.*?name="${taskName}" id="${taskName}"`);
    }
    
    // Devolver el archivo modificado
    return modifiedFile;
}




//Esta función recibe el texto raw de un archivo .bpmn y lo parsea
//Devuelve un archivo .bpmn raw con los id de las tareas ya puestos a partir de los nombres
function modifyBpmnFile(file) {
    // Expresión regular para buscar tareas
    let regexTask = /Task[\s\S]*?id="([\s\S]*?)"[\s\S]*?name="([\s\S]*?)"/g;
    let modifiedFile = file;
    let taskNames = new Map();
    let match;
    
    // Buscar tareas en el archivo
    while ((match = regexTask.exec(file)) !== null) {
        console.log("HAY MATCH #############################");        
        console.log("MATCH[0] -> "+match[0]);
        console.log("MATCH[1] -> "+match[1]);
        console.log("MATCH[2] -> "+match[2]);
        console.log("MATCH[3] -> "+match[3]);
        
        /*
        let task=match[0];
        let taskWithId = task.replace(match[1],match[2]);
        console.log("CADENA->"+taskWithId);
        */

        let taskName = "";

        if(match[2] != "" && match[2] != null && match[2] != undefined){
            taskName = convertirACamelCase(match[2]);
        }
        else{
            taskName = match[1];
        }
        // Convertir el nombre a camel case
        // original
        // let taskName = convertirACamelCase(match[2]);
        
        // Si ya se ha encontrado una tarea con este nombre, añadirle un número al final
        //original
        
        if (taskNames.has(taskName)) {
            let count = taskNames.get(taskName);
            taskNames.set(taskName, count + 2);
            taskName += count;
        } else {
            taskNames.set(taskName, 2);
        }
        // Reemplazar el id de la tarea con el nombre convertido a camel case
        let modifiedId = taskName;
        console.log("MODIFIED ID -> "+modifiedId);
        let idRegex = new RegExp(match[1], "g");
        //
        console.log(taskName);
        //
        modifiedFile = modifiedFile.replace(idRegex, modifiedId);
    }
    return modifiedFile;
}

//De momento no se usa
function detectar(file) {
    // Expresión regular para buscar tareas
    let regexTask = /Task[\s\S]*?id="([\s\S]*?)"[\s\S]*?name="([\s\S]*?)"/g;
    
    let modifiedFile = file;
    let taskNames = new Map();
    let match;
    
    // Buscar tareas en el archivo
    while ((match = regexTask.exec(file)) !== null) {
        console.log("HAY MATCH #############################");        
        console.log("MATCH[0] -> "+match[0]);
        console.log("MATCH[1] -> "+match[1]);
        console.log("MATCH[2] -> "+match[2]);
        console.log("MATCH[3] -> "+match[3]);
        /*let taskType = match[1];
        console.log("TIPO->"+taskType);
        let taskName = match[2];
        console.log("TAREA->"+taskName);
        let taskId = match[3];
        console.log("ID->"+taskId);*/
        let task=match[0];
        let taskWithId = task.replace(match[1],match[2]);
        console.log("CADENA->"+taskWithId);
    }
}


//const file = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-update-conference-old.bpmn');
//const rawFile = await file.text();


//let modifiedFile = modifyBpmnFile(rawFile);
//console.log(modifiedFile);

//Para descargar el archivo tras parsearlo
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


//detectar(rawFile);

//console.log(names);

//let pasar = "Obtain-all Conference";
//let dev = convertirACamelCase(pasar);
//console.log(dev);

//Se usa en la función modifyBpmnFile para llevar a cabo el parseo de name a id
function convertirACamelCase(cadenas) {
    // Crea un objeto para contar las ocurrencias de cada cadena
    const contadores = {};
    
    
    // Divide la cadena en palabras
    const palabras = cadenas.split(' ');
    
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
}


// El objeto FileReader te permite leer los archivos en el directorio y utilizar su contenido como desees.

let input = document.getElementById("file-input");
let unprocessedFiles = [];
//let firstPart = 'http://localhost:5173/src/bpmn_diagrams/';
let firstPart = 'http://localhost:5173/src/unparsed/';
let fullPart= '';
//const file = await fetch('http://localhost:5173/src/bpmn_diagrams/crs-update-conference-old.bpmn');
//const rawFile = await file.text();
//guardarArchivoDeTexto(modifiedFile, "archivo2.bpmn");


//iterar sobre la lista de archivos bpmn de la carpeta subida y aplica el parseo a cada uno
input.addEventListener("change", function(e) {
    let files = e.target.files;
    // files es una lista de objetos File, representando cada archivo en el directorio seleccionado
    // puedes iterar sobre esta lista y aplicar la función ya existente
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        // aplicar función ya existente a cada archivo
        console.log("Nombre del archivo -> " + file.name);
        unprocessedFiles.push(file.name);
        fullPart = firstPart + file.name;
        console.log(`Itteracion ${i} ` + fullPart);

        process(fullPart, file.name);
        //const unprocessed = fetch(fullPart);
        //const rawUnprocessed = unprocessed.text();
        //console.log(rawUnprocessed);
    }
    //Debe hacerse aquí
    //console.log(unprocessedFiles);
    //Idea: probar a hacer un fetch de cada archivo y luego parsearlos
    
    /*for(let i = 0; i < unprocessedFiles.length; i++){
        fullPart = firstPart + unprocessedFiles[i];
        console.log(`Itteracion ${i} ` + fullPart);
    }*/
});

//Para procesar cada archivo bpmn
async function process(fullPart, fileName){
    const unprocessed = await fetch(fullPart);
    const rawUnprocessed = await unprocessed.text();
    //console.log(rawUnprocessed);
    let modifiedFile = modifyBpmnFile(rawUnprocessed);
    console.log(modifiedFile);
    guardarArchivoDeTexto(modifiedFile, fileName);
}