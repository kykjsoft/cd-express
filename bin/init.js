#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const cwd = process.cwd();
const arg = require("arg")
const pkg = require("../package.json")
const option = require("../lib/option")

const args = arg({
    // Types
    '--help':    Boolean,
    '--outfile': String,
    '--version': Boolean,
    '--verbose': arg.COUNT,   // Counts the number of times --verbose is passed
    // Aliases
    '-h':        '--help',
    '-o':        '--outfile',
    '-v':        '--version',
});

if(args["--help"]){
    console.log(`

创建配置文件

命令：cd-express init [-o cd-express.json]

示例：
    cd-express init
    cd-express init -o cd-express.dev.json
`)
}

if(args["--version"]){
    console.log(pkg.version)
    return ;
}

let file = args["--outfile"]
option.init(cwd,{file:file}).then((rev)=>{
    if(rev.error){
        console.log(rev.error)
    }else{
        console.log("配置文件"+(file?` [ ${file} ] `:"")+"已创建")
    }
});