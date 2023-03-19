#this function recieves a string with the name of a task and converts it to camel case for using it later to be the id of the task
def convertToCamelCase(strings):
    #object for counting each string ocurrence
    counters={}
    #split the full string into words
    words = strings.split(" ")
    
    #convert the first word to lower case and the rest of them to upper case
    camelCased = [word.lower() if i == 0 else word[0].upper() + word[1:].lower() for i, word in enumerate(words)]
    
    #join the words into a string and add a suffix if the string has been repeated
    result = "".join(camelCased)
    if result in counters:
        counters[result] += 1
        return result + str(counters[result])
    counters[result] = 1
    return result

import re

def modifyBpmnFile(file):
    #regular expression for searching tasks
    regexTask = re.compile(r'Task[\s\S]*?id="([\s\S]*?)"[\s\S]*?name="([\s\S]*?)"')
    
    modifiedFile = file
    taskNames = {}
    
    #search tasks in the file
    for match in regexTask.finditer(file):
        if (match.group(2) != "" and (match.group(2) != None)):
            taskName = convertToCamelCase(match.group(2))
        else:
            taskName = match.group(1)
        
        #if a task with that name has already been found, add a number to the end of it
        if taskName in taskNames:
            count = taskNames[taskName]
            taskNames[taskName] = count + 2
            taskName += str(count)
        else:
            taskNames[taskName] = 2
            
        #replace the task id with the named converted to camel case
        modifiedId = taskName
        idRegex = re.compile(re.escape(match.group(1)))
        modifiedFile = re.sub(idRegex, modifiedId, modifiedFile)
        
    return modifiedFile

import glob

def main():
    path = "./bpmn_diagrams/*.bpmn"
    files = glob.glob(path)

    for name in files:
        print(name)
        with open(name) as f:
            content = f.read()
            modified_file = modifyBpmnFile(content)
            name2 = name
            with open(name2, "w") as f:
                f.write(modified_file)

main()