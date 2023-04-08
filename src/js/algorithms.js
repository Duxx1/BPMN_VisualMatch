//export
// Función para leer un archivo CSV y obtener un array con los nombres de las tareas
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
/*
(async () => {
    const taskNames = await getTaskNames('/src/csv_files/Get_conference.bpmn.csv');
    console.log(taskNames);  // Imprime el array con los nombres de las tareas leídas del archivo CSV
})();
*/