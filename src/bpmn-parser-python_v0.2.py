#!/usr/bin/env python
# coding: utf-8

# In[10]:


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
    


# In[11]:


import re

def modifyBpmnFile(file):
    #regular expression for searching tasks
    regexTask = re.compile(r'Task[\s\S]*?id="([\s\S]*?)"[\s\S]*?name="([\s\S]*?)"')
    
    modifiedFile = file
    taskNames = {}
    
    #search tasks in the file
    for match in regexTask.finditer(file):
        taskName = convertToCamelCase(match.group(2))
        
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


# In[12]:


import glob

path = "/src/unparsed/*.bpmn"
files = glob.glob(path)

for name in files:
    print(name)
    with open(name) as f:
        content = f.read()
        modified_file = modifyBpmnFile(content)
        name2 = name+"-PARSEADO.bpmn"
        with open(name2, "w") as f:
            f.write(modified_file)


# %%
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
        taskName = convertToCamelCase(match.group(2))
        
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

path = "./unparsed/*.bpmn"
files = glob.glob(path)

for name in files:
    print(name)
    with open(name) as f:
        content = f.read()
        modified_file = modifyBpmnFile(content)
        name2 = name + "PARSEADO.bpmn"
        with open(name2, "w") as f:
            f.write(modified_file)


# %%
from os import listdir
from os.path import isfile, join
parsing_path =  "./unparsed"
onlyfiles = [f for f in listdir(parsing_path) if isfile(join(parsing_path, f))]
print(onlyfiles)
# %%
