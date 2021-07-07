#!/usr/bin/env node
let option = require("../dist/option")

if(process.argv[2]=="init"){
    option.init(process.cwd())
    .then(message=>console.log(message))
}else{

    const path = require("path");
    const fs = require("fs");
    const cwd = process.cwd();
    const serve = require('../index');
    const arg = require("arg")
    const pkg = require("../package.json")
    const option = require("../dist/option")

    const args = arg({
        // Types
        '--help':    Boolean,
        '--init':    Boolean,
        '--debug':    Boolean,
        '--markdown':    Boolean,
        '--version': Boolean,
        '--debug': Boolean,
        '--config': String,
        '--verbose': arg.COUNT,   // Counts the number of times --verbose is passed
        '--port':    Number,      // --port <number> or --port=<number>
        // Aliases
        '-p':        '--port',
        '-v':        '--version',
        '-m':        '--markdown',
        '-h':        '--help',
        '-c':        '--config',
    });

    if(args["--help"]){
        console.log(`
            cd-express -p 5000 
        `)
        return ;
    }
    if(args["--version"]){
        console.log(pkg.version)
        return ;
    }

    const debug = function(){
        if(args["--debug"]){
            console.log.apply(console,arguments);
        }
    }

    debug(__dirname);
    debug(cwd);
    debug(process.argv);
    debug(process.argv0);
    
    debug(args);


    //let starter = Promise.resolve(cwd);


    option.getConfig(cwd,args["--config"])
    .then(function(config){
        if(args["--open"]){
            config.open = config.open || {}
            config.open.enabled = true;
        }
        if(args["--debug"]){
            config.debug = true;
        }
        if(args["--port"]){
            config.port = args["--port"];
        }
        if(args["--markdown"]){
            config.markdown = args["--markdown"];
        }
        serve(cwd,config);
    }).catch(function(err){
        console.error(err);
    })
}