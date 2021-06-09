const socket = require("./socket");
const static = require("./static");
const router = require("./router");
const proxy = require("./proxy");
const markdown = require("./markdown");

module.exports = async function(app,config){
    await markdown(app,config)
    await router(app,config)
    await static(app,config)
    await proxy(app,config)
    await socket(app,config)
}