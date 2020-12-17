
const path = require("path");
const express = require('express');
const cwd = process.cwd();
const defaultConfig = {
    port:3000,
    debug:false,
    static:{
        "~":["./"],
    },
    open:{
        enabled:false,
        app: 'chrome',
        url:"/"
    }
};

let debug = false;
const log = function(msg){
    debug&&console.log(msg);
}
const serve = function(pconfig){
    debug = pconfig && pconfig.debug;
    log("传入");
    log(pconfig);
    config = Object.assign({},defaultConfig,pconfig);
    if(pconfig.open){
        config.open = Object.assign({},defaultConfig.open,pconfig.open);
    }
    log("合并后");
    log(config);
    let app = express();
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
                let url = path.join(config.port.toString(),config.open.url);
                url = 'http://127.0.0.1:'+url;
                log(url);
                open(url,{app:config.open.app});
                resolve();
            }
        });
    })
}

module.exports = serve;