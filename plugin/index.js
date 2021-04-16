const socket = require("./socket");
const static = require("./static");
const router = require("./router");
const proxy = require("./proxy");

module.exports = async function(app,config){
    await router(app,config)
    await static(app,config)
    await proxy(app,config)
    await socket(app,config)
}