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
