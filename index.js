#! /usr/bin/env node
const yargs = require("yargs");
const fs = require('fs');
const chalk = require("chalk");
const log = console.log;
const npath = require("path");

yargs.version("1.0.0");

function genFile(path, content, name, argV){
    fs.writeFile(path, content, function (err) {
        if (err) throw err;
        log(chalk.blue(`Component is created`));
        log(chalk.green(`import ${name} from "src/${argV.p}";`));
      });
}

function getName(argV){
    const name = argV.p.split("/");
    return name[name.length-1];
}

function checkPath(path){
    const pathCheck = path.split("/");
    pathCheck.pop();
    const newPath = pathCheck.join("/");
    return new Promise((res, _)=>{
        fs.access(newPath, function(error){
             error?res(false):res(true);
        });
    });
}

function generateDir(path){

    path = path.split("/");
    path.pop();
    path = path.join("/");
    return new Promise((res, rej)=>{
        fs.mkdir(path, {recursive: true}, (err)=>{
            err?rej(err):res("success in creating the directory");
        });  
    });
}

yargs.command({
    command: "g",
    describe:"Generate react component",
    builder: {
        p:{
            describe: "Enter the path where the new component is to be created",
            demandOption : true,
            type: "string"
        },
        c:{
            describe:`Component needs to be created using class or functional`,
            demandOption: false,
            type: "boolean"
        }
    },
    handler: function (argv){
        createComponent(argv);
    }
})

yargs.parse();


async function createComponent(argV){
    log(npath.dirname(require.main.filename));   
    const homePath =npath.dirname(require.main.filename);
    let name = getName(argV);
    name = name.slice(0,1).toUpperCase()+name.slice(1);

// function component file content
    let fc = `
import React from 'react';

const ${name} = ()=>{
    return(
        <div>${name} works</div>
    );
}

export default ${name};
`;

//if class component to be generated argV.c = true
    if(argV.c){
        fc=`
import React, {Component} from 'react';

class ${name} extends Component{
    render() {
        return <h1>${name} works</h1>;
    }
}

export default ${name};
`;
    }

    //checking path of the directory 
    const pathCheck = await checkPath(homePath+"/src/"+argV.p); 
    if(pathCheck){
        genFile(homePath+"/src/"+argV.p+".jsx", fc, name, argV);
    }
    else{
        await generateDir(homePath+"/src/"+argV.p+".jsx");
        genFile(homePath+"/src/"+argV.p+".jsx", fc, name, argV);
    }
}


