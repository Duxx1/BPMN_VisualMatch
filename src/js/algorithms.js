/**
* @returns {Map<string, Object>} key: BPMN element id / value: running instances
*/
export function getActivitiesRunningInstances() {
    return new Map([
        ['assignApprover', { onTime: 5, risky: 0, critical: 0 }],
        ['approveInvoice', { onTime: 2, risky: 3, critical: 0 }],
        ['reviewInvoice', { onTime: 4, risky: 1, critical: 2 }],
        ['prepareBankTransfer', { onTime: 0, risky: 0, critical: 0 }],
        ['archiveInvoice', { onTime: 0, risky: 0, critical: 0 }],
    ]);
}

/**
* @returns {Map<string, number>} key: BPMN element id / value: number waiting instances
*/
export function getEdgesWaitingInstances() {
    return new Map([['invoiceApproved', 2]]);
}

export function getPrueba() {
    return new Map([
        ['sid-46F35BF5-0263-4AB7-8E16-AEEEF86C99C9', { onTime: 5, risky: 0, mytical: 0 }],
        ['approveInvoice', { onTime: 2, risky: 3, mytical: 0 }],
        ['reviewInvoice', { onTime: 4, risky: 1, mytical: 2 }],
        ['prepareBankTransfer', { onTime: 0, risky: 0, mytical: 0 }],
        ['archiveInvoice', { onTime: 0, risky: 0, mytical: 0 }],
    ]);
}

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