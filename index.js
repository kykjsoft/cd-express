
const path = require("path");
const express = require('express');
const load = require('./lib/load');
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
};

const debug = false;
const log = function(msg){debug&&console.log(msg);}

function createApp(cwd,pconfig){
    const config = Object.assign({},defaultConfig,pconfig)
    log(config);
    let app = express();
    //router
    for(var attr in config.router){
        app.use(attr,load(cwd,config.router[attr]));
    }

    //static
    for(var name in config.static){
        let paths = config.static[name];
        if(typeof paths == "string"){
            paths = [paths];
        }
        paths.forEach(item=>{
            if(name=="~"){
                app.use(express.static(path.join(cwd,item)));
            }else{
                app.use(name,express.static(path.join(cwd,item)));
            }
            log("[static] "+name +" " + path.join(cwd,item));
        })
    }


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