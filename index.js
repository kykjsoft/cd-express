const path = require("path");
const express = require('express');
const plugin = require("./plugin/index")
const defaultConfig = {
    cwd:null,
    port:3000,
    log:false,
    static:{
        "/":["./"],
    },
    open:{
        enabled:false,
        app: 'chrome',
        url:"/"
    },
    router:{
        
    }
}

const debug = true;
const log = function(msg){debug&&console.log(msg);}



async function createApp(cwd,pconfig){
    console.log("confing:",pconfig)
    const config = Object.assign({},defaultConfig,pconfig)
    config.cwd = cwd || process.cwd();
    let app = express();
    
    app.log = log;
    app.config = config;
    app.uselog = function uselog(callback,msg){
        return app.config.log?function(req,res,next){
            console.log(`[响应] ${msg}`);
            callback.apply(null,arguments);
        }:callback;
    };
    
    if(config.log){
        app.log("[log] 已开启");
    }

    if(config.log){
        app.use(function(req,res,next){
            app.log(`[${req.method}] ${req.url}`);
            next();
        })
    }

    await plugin(app,config);

    return new Promise(resolve=>{
        app.listen(config.port,function(){
            var addr = this.address();
            console.log("[express-server] 服务已启动 "+'http://127.0.0.1:'+addr.port||addr);
            if(config.open.enabled){
                const open = require('open');
                let url = path.join(config.port.toString(),config.open.url).replace(/\\/g,"/");
                url = 'http://127.0.0.1:'+url;
                log(url);
                open(url,{app:config.open.app});
                resolve();
            }
        });
    })
}

module.exports = createApp;