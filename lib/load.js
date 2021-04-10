const path = require("path");
module.exports = function(cwd,filepath){
    console.log(cwd);
    console.log(filepath);
    return require(path.join(cwd,filepath));
}