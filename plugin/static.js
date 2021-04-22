const path = require('path');
const express = require('express');
module.exports = async function(app,config){
  const cwd = config && config.cwd || process.cwd();
  if(!config.static){return;}
  for(var name in config.static){
    let paths = config.static[name];
    if(typeof paths == "string"){
        paths = [paths];
    }
    paths.forEach(item=>{
        if(name=="~"){ name = "/"}
        app.log("[static] "+name +" " + item);
        let aitem = path.isAbsolute(item)?item:path.join(cwd,item)
        app.use(name,app.uselog(express.static(aitem),aitem));
    })
  }
}