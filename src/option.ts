import {join,extname} from "path"
import {readFile,writeFile,access,readdir} from "fs/promises"
import json5 from "json5"

type IConfig={
    port?:number|string,
    static:{
        [key:string]:string[]
    },
    socket?:string,
    router?:{
        [key:string]:string[]
    }
}

function importModel(p:string){
    return import(p).then((m:{default:any}|any)=>{
        if(typeof m == "object" && m.hasOwnProperty("default") ){
            return m.default;
        }
        return m;
    })
}

/**
 * 从文件中获取JSON
 * @param filename 文件名
 * @returns 
 */
export async function getJSONFile(filename:string){
    return await readFile(filename,"utf-8").then(d=>json5.parse(d));
}

/**
 * 根据工作目录中获取或生成配置
 * @param cwd 
 * @returns 
 */
export async function getConfig(cwd:string,filename:string|null):Promise<IConfig>{
    if(filename){
        return getJSONFile(join(cwd,filename))
    }
    return getJSONFile(join(cwd,"cd-express.json"))
    .catch(()=>{
        return importModel(join(cwd,"cd-express.js"))
        .then((fn:{():IConfig})=>{
            return fn();
        })
    })
    .catch((ex)=>{
        return getDefaultOption()
    })
    .then(config=>mergetConfig(getDefaultOption(),config));
}

export function getConfigFileNameFromDir(cwd:string){
    return access(join(cwd,"cd-express.js"))
    .then(()=>"cd-express.js")
    .catch(()=>
        access(join(cwd,"cd-express.json"))
        .then(()=>"cd-express.json")
        .catch(()=>null)
    )
}

export function mergetConfig(config1:IConfig={static:{"/":["/"]}},config2:IConfig={static:{"/":["/"]}}):IConfig{
    

    if(typeof config2.port === "string" || typeof config2.port === "number"){
        config1.port = config2.port;
    }
    if(config2.socket){
        config1.socket = config2.socket;
    }

    if(config2.static){
        config1.static = config1.static || {};
        for(let a in config2.static){
            if(config2.static[a]){
                config1.static[a] = config1.static[a] || []
                for(var i in config2.static[a]){
                    if(config1.static[a].includes(config2.static[a][i])){continue;}
                    config1.static[a].push(config2.static[a][i])
                }
            }
        }
    }
    if(config2.router){
        config1.router = config1.router || {};
        for(let a in config2.router){
            if(config2.router[a]){
                config1.router[a] = config1.router[a] || []
                for(var i in config2.router[a]){
                    if(config1.router[a].includes(config2.router[a][i])){continue;}
                    config1.router[a].push(config2.router[a][i])
                }
            }
        }
    }
    if(config2.socket){
        config1.socket = config2.socket;
    }
    return config1;
}

/**
 * 获取默认配置
 * @returns 默认配置
 */
export function getDefaultOption():IConfig{
    return {
        "port":3000,    // 端口号
        "static":{      // 静态目录
            "/":["./"]
        },
        "socket":""
    }
}


export async function init(cwd:string){
    let has = await getConfigFileNameFromDir(cwd);
    if(has){
        return "已存在配置文件 "+ join(cwd,has);
    }

    let config = await createConfigByDir(cwd)
    let defaultconfig = getDefaultOption()

    

    config = mergetConfig(defaultconfig,config);

    let configfile:IConfig&{
        $schema?:string
    }=config;
    configfile["$schema"]="https://configure-driver.github.io/cd-express/schemas/cd-express.json"

    let text = JSON.stringify(configfile,null,4);
    text = "//doc: https://configure-driver.github.io/cd-express/\n"+text;
    
    let filename = join(cwd,"cd-express.json");
    await writeFile(filename,text)

    return `已生成配置文件 ${filename}`;
}

/**
 * 根据工作目录生成配置
 * @param cwd 工作目录
 * @returns 
 */
async function createConfigByDir(cwd:string){
    if(!cwd){ throw new Error("必须传入目录地址");}
    const rev:IConfig = {
        static:{
            "/":[]
        }
    };

    await Promise.all([
        access(join(cwd,"public"))
        .then(()=>rev.static["/"].push("./public"))
        .catch(ex=>null),
        access(join(cwd,"docs"))
        .then(()=>rev.static["/"].push("./docs"))
        .catch(ex=>null),
        access(join(cwd,"router")).then(()=>{
            let router = join(cwd,"router");
            return readdir(router).then(list=>{
                rev.router = rev.router || {};
                rev.router["/"]=rev.router["/"]||[]
                for(let a in list){
                    if(extname(list[a])===".js"){
                        rev.router["/"].push("./router/"+list[a]);
                    }
                }
                return rev;
            })
        })
        .catch(ex=>null)
    ])
    
    if(!rev.static || Object.keys(rev.static).length==0){
        rev.static = rev.static || {}
        rev.static["/"] = ["./"]
    }
    return rev
}