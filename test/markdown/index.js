const express = require("express")
const path = require("path")
const md = require("../../plugin/markdown.js")
const app = express();

md(app,{markdown:true})
app.use(express.static(path.join(__dirname,"../../docs")))

app.listen(3002,function(){
    var addr = this.address();
    console.log("[express-server] 服务已启动 "+'http://127.0.0.1:'+addr.port||addr);   
})