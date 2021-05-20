#!/usr/bin/env node

if(process.argv[2]=="init"){
    require("./init.js");
}else{

    const path = require("path");
    const fs = require("fs");
    const cwd = process.cwd();
    const serve = require('../index');
    const arg = require("arg")
    const pkg = require("../package.json")
    const option = require("../lib/option")

    const args = arg({
        // Types
        '--help':    Boolean,
        '--init':    Boolean,
        '--debug':    Boolean,
        '--version': Boolean,
        '--config': String,
        '--verbose': arg.COUNT,   // Counts the number of times --verbose is passed
        '--port':    Number,      // --port <number> or --port=<number>
        // Aliases
        '-p':        '--port',
        '-v':        '--version',
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


    option.getConfig(cwd,{
        file:args["--config"]
    })
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
        serve(cwd,config);
    }).catch(function(err){
        console.error(err);
    })
}