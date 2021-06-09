const Koa = require('koa');
const plugin = require("./plugin/index")

const defaultConfig = {
    cwd:null,
    port:3000,
    log:false,
    static:{
        "/":["./"],
    },
    open:{
        enabled:false,
        app: 'chrome',
        url:"/"
    },
    router:{
        
    }
}

const debug = true;
const log = function(msg){debug&&console.log(msg);}

module.exports = function(cwd,pconfig){

    console.log("confing:",pconfig)
    const config = Object.assign({},defaultConfig,pconfig)
    config.cwd = cwd || process.cwd();

    const app = new Koa();
    
    app.log = log
    app.config = config;


    app.use(async (ctx, next) => {
        await next();
        console.log(ctx.body);
        const rt = ctx.response.get('X-Response-Time');
        console.log(`${ctx.method} ${ctx.url} - ${rt}`);
    });
    
    plugin(app,config)
    
    // x-response-time
    
    app.use(async (ctx, next) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        ctx.set('X-Response-Time', `${ms}ms`);
    });
    
    // response
    
    app.use(async ctx => {
        //ctx.body = 'Hello World';
    });
    
    app.listen(config.port,function(){
        var addr = this.address();
        console.log("[express-server] 服务已启动 "+'http://127.0.0.1:'+addr.port||addr);
        
    });
}