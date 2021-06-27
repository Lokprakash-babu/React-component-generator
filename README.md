React Component Generator
====

A light weight react component generator for creating a component at ease without any extra loading. 


* [Usage](#usage)
* [Commands](#commands)

# usage

```sh-session
$ npm install -g component-generator-react
$ r --version
2.0.2
$ r g -p "component name"
```
# commands

* [`r g -p [directory/componentName]`]

# `[r g -p [directory/componentName]]`

This command will create a component inside the directory mentioned with the given component name.

### Note
* By default components are created under "src" directory.
* Do not include .jsx extension with the component name. 
  
```
Options: 
$ r g -p admin/dashboard

This will create an admin folder if it didn't exist and create a dashboard component inside src/admin

-c  defaults to false. Setting it to true will create class based component

$ r g -p admin/dashboard -c true

This will create a class component
```

  

