const Koa = require("koa")

const send = require(".");
const path = require("path");

app = new Koa();
app.use(function(ctx,next){
    send(ctx,path.join(__dirname))
})
