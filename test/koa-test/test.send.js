const Koa = require("koa")
const send = require("koa-send");
const path = require("path");

app = new Koa();
app.use(function(ctx,next){
    send(ctx,"index.html",{
        root:path.join(__dirname,"public")
    })
})
app.listen(3400)
