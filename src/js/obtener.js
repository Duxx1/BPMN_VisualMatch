const input1 = document.querySelector('#bpmnFile1');
const fileNameDisplay1 = document.querySelector('#fileName1');

input1.addEventListener('change', () => {
    fileNameDisplay1.textContent = input1.files[0].name;
    localStorage.setItem("diagramA", fileNameDisplay1.textContent);
});

const input2 = document.querySelector('#bpmnFile2');
const fileNameDisplay2 = document.querySelector('#fileName2');

input2.addEventListener('change', () => {
    fileNameDisplay2.textContent = input2.files[0].name;
    localStorage.setItem("diagramB", fileNameDisplay2.textContent);
});

const send = document.querySelector('#send');
send.addEventListener('click', () => {
    console.log(diagramA);
    console.log(diagramB);
    if(localStorage.getItem("diagramA") !== null && localStorage.getItem("diagramB") !== null
    && localStorage.getItem("diagramA") !== undefined && localStorage.getItem("diagramB") !== undefined
    && localStorage.getItem("selected") !== null && localStorage.getItem("selected") !== undefined){
        
        let str = localStorage.getItem("selected");
        if(str == 1){ str="Minimum";}
        else if(str == 2){ str="Special Minimum";}
        else if(str == 3){ str="Maximum";}
        else if(str == 4){ str="Special Maximum";}

        alert("Diagrams have been correctly selected.\nDiagram A -> " + localStorage.getItem("diagramA") + "\nDiagram B -> " + localStorage.getItem("diagramB") + "\nOption selected: " + str + "\nPlease return to Home.");

    } 
    else{
        alert("Please select two .bpmn diagrams. " + "\nAfter that, select one option.");
        localStorage.clear();
    }
});

const clean = document.querySelector('#clean');
clean.addEventListener('click', () => {
    localStorage.clear();
});

var diagramA = localStorage.getItem("diagramA");
var diagramB = localStorage.getItem("diagramB");

console.log(diagramA);
console.log(diagramB);

const min = document.querySelector("#min");
const min_sp = document.querySelector("#min_sp");
const max = document.querySelector("#max");
const max_sp = document.querySelector("#max_sp");

// valores de selected: min = 1 # min_sp = 2 # max = 3 # max_sp = 4


min.addEventListener("change", () => {
    localStorage.setItem("selected", 1);
    
    /* if(diagramA != null && diagramB != null){
        localStorage.clear();
        localStorage.setItem("diagramA", diagramA);
        localStorage.setItem("diagramB", diagramB);
        localStorage.setItem("selected", 1);
    } */
});

min_sp.addEventListener("change", () => {
    localStorage.setItem("selected", 2);
    
    /* if(diagramA != null && diagramB != null){
        localStorage.clear();
        localStorage.setItem("diagramA", diagramA);
        localStorage.setItem("diagramB", diagramB);
        localStorage.setItem("selected", 2);
    } */
});

max.addEventListener("change", () => {
    localStorage.setItem("selected", 3);
    
    /* if(diagramA != null && diagramB != null){
        localStorage.clear();
        localStorage.setItem("diagramA", diagramA);
        localStorage.setItem("diagramB", diagramB);
        localStorage.setItem("selected", 3);
    } */
});

max_sp.addEventListener("change", () => {
    localStorage.setItem("selected", 4);
    
    /* if(diagramA != null && diagramB != null){
        localStorage.clear();
        localStorage.setItem("diagramA", diagramA);
        localStorage.setItem("diagramB", diagramB);
        localStorage.setItem("selected", 4);
    } */
});

function redirect() {
    location.href="/index.html";
}