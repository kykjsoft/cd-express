const {readFile,writeFile,access} = require("fs").promises;
const {join} = require("path");
const json5 = require("json5");
const isDebug = true;
// 获取默认配置：

/**
 * 参数：
 *   cwd：工作目录，默认取 process.cwd()
 * 说明：
 * 1. 存在 cd-express.json 文件 则 返回该文件内容，否则处理以下内容
 * 2. 存在 public 目录 则 配置 static : ["./public"]
 * 3. 存在 docs 目录 则 配置 static : ["./docs"]
 * 4. 存在 router 目录 则 配置 routerdir : "./router"
 */
async function init(cwd,opt){
    if(!cwd){ throw new Error("必须传入目录地址");}
    opt = Object.assign({
        log:false
    },opt)
    
    cwd=cwd||process.cwd;
    const cfgfilename = await hasConfig(cwd);
    if(cfgfilename){
        isDebug && console.log(`已存在配置文件 ${cfgfilename}`);
        return;
    }

    try{
        let config = await getConfigByDir(cwd);
        config = merge(await defaults(),config);
        await createConfigFile(cwd,merge(await defaults(),config));
        isDebug && console.log("已生成配置文件 cd-express.json");
        isDebug && console.log("执行 cd-express 即可运行");
        return;
    }catch(ex){
        isDebug && console.log("配置文件生成失败",ex);
    }
}

async function hasConfig(cwd,opt){
    if(!cwd){ throw new Error("必须传入目录地址");}

    opt = Object.assign({
        log:false
    },opt)

    try{
        const cfgpath = join(cwd,"cd-express.js");
        await access(cfgpath);
        return cfgpath
    }catch(ex){
        opt.log && console.log("读取配置文件 cd-express.js 失败");
    }
    try{
        const cfgpath = join(cwd,"cd-express.json");
        await access(cfgpath);
        return cfgpath
    }catch(ex){
        opt.log && console.log("读取配置文件 cd-express.json 失败");
    }
    return null;
}

async function getConfig(cwd){
    if(!cwd){ throw new Error("必须传入目录地址");}
    try{
        return await require(join(cwd,"cd-express.js"));
    }catch(ex){
        // isDebug && console.log('读取配置文件失败 cd-express.js',ex.message);
    }
    try{
        return await getJSON5Config(join(cwd,"cd-express.json"))
    }catch(ex){
        // isDebug && console.log('读取配置文件失败 cd-express.json',ex.message);
    }
    return defaults();
}

// 根据 目录结构生成 配置
async function getConfigByDir(cwd){
    if(!cwd){ throw new Error("必须传入目录地址");}
    const rev = {static:{"/":[]}};
    try{
        await access(join(cwd,"public"))
        rev.static["/"].push("./public")
    }catch(ex){}
    
    try{
        await access(join(cwd,"docs"))
        rev.static["/"].push("./docs")
    }catch(ex){}
    
    try{
        await access(join(cwd,"router"))
        rev.router = rev.router || {};
        rev.router["/"]=rev.router["/"]||[];
        rev.router["/"].push("./router")
    }catch(ex){}
    
    if(!rev.static["/"].length){
        rev.static["/"].push("./")
    }
    return rev
}

async function createConfigFile(cwd,option){
    if(!cwd){ throw new Error("必须传入目录地址");}
    option["$schema"]="https://configure-driver.github.io/cd-express/schemas/cd-express.json"
    let text = JSON.stringify(option,null,4);
    text="//doc: https://configure-driver.github.io/cd-express/\n"+text;
    writeFile(join(cwd,"cd-express.json"),text)
}
let defaultOption = null;
// 返回默认配置
async function defaults(){
    if(!defaultOption){
        defaultOption = await getJSON5Config(join(__dirname,"./default.json"));
        isDebug && console.log(defaultOption);
    }
    return defaultOption
}

async function getJSON5Config(filename){
    const filetext = await readFile(filename,"utf-8");
    return json5.parse(filetext);
}

function merge (...args){
    return Object.assign.apply(Object,args)
}

module.exports = {
    defaults,
    init,
    getConfig,
    createConfigFile,
    getConfigByDir,
    hasConfig,
    merge
}