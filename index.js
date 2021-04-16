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
    
    app.log = log;
    
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