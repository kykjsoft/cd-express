const path = require('path');
module.exports = async function(app,config){
  const cwd = config && config.cwd || process.cwd();
  if(!config.router){return;}
  for(var name in config.router){
    let paths = config.router[name];
    if(typeof paths == "string"){
        paths = [paths];
    }
    paths.forEach(item=>{
        if(name=="~"){ name = "/"}
        app.log("[router] "+name +" " + item);
        item = path.isAbsolute(item)?item:path.join(cwd,item)
        try{
          app.use(name,require(item));
        }catch(ex){
          console.error("加载router失败：", ex.message)
        }
    })
  }
}