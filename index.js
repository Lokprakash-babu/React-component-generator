#! /usr/bin/env node
const yargs = require("yargs");
const fs = require('fs');
const chalk = require("chalk");
const log = console.log;
const npath = require("path");
const { exec } = require("child_process");

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
    // console.log("pathCheck", pathCheck);
    const newPath = pathCheck.join("/");
    // console.log("new path", newPath);
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
    // console.log("path in mkdir", path);
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
    exec("pwd", async(err, stdOut, stdErr)=>{
        if(err){
            console.log("error", err);
            return;
        }
        if(stdErr){
            console.log("stdErr", stdErr);
            return;
        }
        stdOut = stdOut.split("\\").slice(2).join("/");
        // console.log("stdOut", npath.resolve(stdOut));
        const homePath =npath.resolve(stdOut);
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
        // console.log("path to check", homePath+"/src/"+argV.p);
        const pathCheck = await checkPath(homePath+"/src/"+argV.p); 
        if(pathCheck){
            genFile(homePath+"/src/"+argV.p+".jsx", fc, name, argV);
        }
        else{
            try{

                await generateDir(homePath+"/src/"+argV.p+".jsx");
                genFile(homePath+"/src/"+argV.p+".jsx", fc, name, argV);
            }
            catch(err){
                console.error("error in the else block", err);
            }
        }
    })
    
}


