const socket = require("./socket");

module.exports = function(app,config){
    socket(app,config)
}