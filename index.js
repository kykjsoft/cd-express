const path = require("path");
const express = require('express');
const load = require('./lib/load');
const createProxy = require("./lib/proxy")
const plugin = require("./plugin/index")
const defaultConfig = {
    port:3000,
    debug:false,
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

function createApp(cwd,pconfig){
    const config = Object.assign({},defaultConfig,pconfig)
    
    let app = express();
    //static
    for(let name in config.router){
        let paths = config.router[name];
        if(typeof paths == "string"){
            paths = [paths];
        }
        paths.forEach(item=>{
            if(name=="~"){ name = "/"}
            app.use(name,load(path.join(cwd,item)));
            log("[router] "+name +" " + path.join(cwd,item));
        })
    }

    //static
    for(var name in config.static){
        let paths = config.static[name];
        if(typeof paths == "string"){
            paths = [paths];
        }
        paths.forEach(item=>{
            if(name=="~"){ name = "/"}
            app.use(name,express.static(path.join(cwd,item)));
            log("[static] "+name +" " + path.join(cwd,item));
        })
    }

    // proxy 
    if(typeof config.proxy == "string"){
        config.proxy = {"/":[{target:config.proxy}]}
    }
    
    for(var name in config.proxy){
        let paths = config.proxy[name];
        if(typeof paths == "string"){
            paths = [{target:paths}];
        }
        
        if(paths.constructor && paths.constructor === Array){
            paths.forEach(item=>{
                let opt = item;
                if(typeof opt == "string"){
                    opt = {target:opt}
                }
                if(name=="~"){ name = "/"}
                app.use(name,createProxy(opt));
                log("[proxy] "+name +" " + opt.target);
            })
        }
    }
    
    plugin(app,config);

    return new Promise(resolve=>{
        app.listen(config.port,function(){
            console.log("[express-server] 服务已启动 "+'http://127.0.0.1:'+config.port)
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