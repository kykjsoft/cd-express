const path = require('path');
module.exports = async function(app,config){
  if(!config.router){return;}
  for(var name in config.router){
    let paths = config.router[name];
    if(typeof paths == "string"){
        paths = [paths];
    }
    paths.forEach(item=>{
        if(name=="~"){ name = "/"}
        app.log("[router] "+name +" " + item);
        item = path.isAbsolute(item)?item:path.join(process.cwd(),item)
        app.use(name,require(item));
    })
  }
}