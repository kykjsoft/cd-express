const socket = require("./socket");
const static = require("./static");
const router = require("./router");

module.exports = function(app,config){
    socket(app,config)
    static(app,config)
    router(app,config)
}