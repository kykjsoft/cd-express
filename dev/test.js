const serve = require("../index")
const config = require("./config")
const cwd = process.cwd();

serve(cwd,config)