// Función para leer un archivo CSV y obtener una matriz de valores
/*export async function readMatrixFromCsv(fileUrl) {
    // Obtiene el contenido del archivo CSV
    const response = await fetch(fileUrl);
    const csvString = await response.text();
    
    // Divide el contenido del archivo en líneas
    const lines = csvString.split('\n');
    
    // Divide cada línea en una matriz de valores y almacena los valores en una matriz
    const values = lines.map(line => line.split(','));
    
    return values;
}*/

// Función para leer un archivo CSV y obtener una matriz de valores
export async function readMatrixFromCsv(fileUrl) {
    // Obtiene el contenido del archivo CSV
    const response = await fetch(fileUrl);
    const csvString = await response.text();
    
    //Elimina los caracteres de retorno de carro
    const cleanCsvString = csvString.replace(/\r/g, "");

    // Divide el contenido del archivo en líneas
    const lines = cleanCsvString.split('\n');
    
    // Divide cada línea en una matriz de valores y almacena los valores en una matriz
    const values = lines.map(line => line.split(','));
    
    return values;
}

//.map(string => string.replace(/\r/g, ""))

// Ejemplo de uso de la función
/*
(async () => {
    const values = await readMatrixFromCsv('../matrix/similaritymatrix_CRS - Get conference_CRS - Update conference.csv');
    console.log(values);  // Imprime la matriz de valores leída del archivo CSV
    //console.log(colorMatrix(values));
})();*/

//Función para leer un archivo CSV y obtener un array con los nombres de las tareas
export async function getTaskNamesFromCsv(fileUrl) {
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
/*
(async () => {
    const taskNames = await getTaskNamesFromCsv('/src/csv_files/Get_conference.bpmn.csv');
    console.log("Tareas leídas del archivo CSV Get conference");
    console.log(taskNames);  // Imprime el array con los nombres de las tareas leídas del archivo CSV
})();*/