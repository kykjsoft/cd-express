const path = require('path');
const express = require('express');
module.exports = async function(app,config){
  if(!config.static){return;}
  for(var name in config.static){
    let paths = config.static[name];
    if(typeof paths == "string"){
        paths = [paths];
    }
    paths.forEach(item=>{
        if(name=="~"){ name = "/"}
        app.log("[static] "+name +" " + item);
        item = path.isAbsolute(item)?item:path.join(process.cwd(),item)
        app.use(name,express.static(item));
    })
  }
}