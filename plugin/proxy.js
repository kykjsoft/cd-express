const createProxy = require("../lib/proxy")

module.exports = async function(app,config){
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
}