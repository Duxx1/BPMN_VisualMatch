// La función recibe como parámetro el contenido del fichero .bpmn como un string
function getTaskNames(bpmnXml: string): string[] {
    // Creamos un nuevo parser de XML
    let parser = new DOMParser();
    // Parseamos el contenido del fichero .bpmn como un documento XML
    let xmlDoc = parser.parseFromString(bpmnXml, "text/xml");
    // Obtenemos todos los elementos "task" del documento
    let tasks = xmlDoc.getElementsByTagName("task");
    // Creamos un array vacío para almacenar los nombres de las tareas
    let taskNames: string[] = [];
    // Iteramos sobre los elementos "task"
    for (let i = 0; i < tasks.length; i++) {
        // Obtenemos el elemento "task" actual
        let task = tasks[i];
        // Añadimos el valor del atributo "name" del elemento "task" al array de nombres
        taskNames.push(task.getAttribute("name"));
    }
    // Devolvemos el array de nombres de tareas
    return taskNames;
}