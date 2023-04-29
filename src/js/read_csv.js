// Function to read a CSV file and get an array of values
export async function readMatrixFromCsv(fileUrl) {
    // Gets the content of the CSV file
    const response = await fetch(fileUrl);
    const csvString = await response.text();
    
    // Removes carriage return characters
    const cleanCsvString = csvString.replace(/\r/g, "");

    // Splits the contents of the file into lines
    const lines = cleanCsvString.split('\n');
    
    // Divides each line into an array of values and stores the values in an array
    const values = lines.map(line => line.split(','));
    
    return values;
}

// Function to read a CSV file and obtain an array of task names
export async function getTaskNamesFromCsv(fileUrl) {
    // Gets the content of the CSV file
    const response = await fetch(fileUrl);
    const csvString = await response.text();
    
    // Splits the contents of the file into lines
    const lines = csvString.split('\n');
    
    // Splits each line into an array of values and extracts the first value (task name)
    const taskNames = lines.map(line => line.split(',')[0]);
    
    return taskNames;
}