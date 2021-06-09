const path = require('path');
const static = require('../../koa-static');
const Router = require('@koa/router');
module.exports = async function(app,config){
  const router = new Router();
  const s1 = static(path.join(config.cwd,config.static));
  router.get("/test",s1)
  app.use(router.routes());
  //app.use(static(path.join(config.cwd,config.static)));
  return;
  const cwd = config && config.cwd || process.cwd();
  if(!config.static){return;}
  if(typeof config.static === "string"){
    config.static = {"/":config.static}
  }
  for(var name in config.static){
    let paths = config.static[name];
    if(typeof paths == "string"){
        paths = [paths];
    }
    console.log(paths);
    paths.forEach(item=>{
        if(name=="~"){ name = "/"}
        app.log("[static] "+name +" " + item);
        let aitem = path.isAbsolute(item)?item:path.join(cwd,item)
        app.log("[static] "+name +" " + aitem);

        //router.use(name,static(aitem));
        router.all(/((\.html)|(\.htm))$/i, static(aitem, {
          //maxage: options.html*86400*1000
        }));
        //router.all(/.html/i, static(aitem));
    })
  }
}