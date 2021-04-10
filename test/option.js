const {init,defaults,getConfigByDir,getConfig,hasConfig,merge} = require("../lib/option")

const { readFileSync } = require("fs");



const assert = require("assert").strict;
const { parse } = require("json5");
const { mkdir,rmdir,rm } = require("fs").promises;
const { join } = require("path");

const defaultOption = parse(readFileSync(join(__dirname,"../lib/option/default.json"),"utf-8"));

describe('option', function() {
    describe('merge()', function() {
        it('无参数', async function() {
            assert.deepEqual(
                merge(),{}
            )
        });
        it('合并对象', async function() {
            assert.deepEqual(
                merge(
                    {
                        port:0,
                        router:{"/":[2222]}
                    },
                    {
                        port:333,
                        router:{"/":[]}
                    }
                ),
                {
                    port:333,
                    router:{"/":[]}
                }
            )
        });
    });
    describe('getConfig()', function() {
        it('getConfig() {static: {"/": ["./"]}}', async function() {
            assert.deepEqual(await getConfig(join(__dirname,"hascfg")),{
                static: {'/': ['./']}
            })
        });
    });
    describe('default()', function() {
        it('应该返回 {static: {"/": ["./"]}}', async function() {
            assert.deepEqual(await defaults(),defaultOption)
        });
    });
    describe('createOptionByDir()', function() {
        it('存在 public router 目录', async function() {
            assert.deepEqual(
                await getConfigByDir(join(__dirname,"option")),
                {
                    static:{
                        "/":["./public","./docs"]
                    },
                    router:{
                        "/":["./router"]
                    }
                }
            )
        });
    });
    describe('init()', function() {
        it('空目录', async function() {
            const dirpath = join(__dirname,"testinit");
            try{ await mkdir(dirpath);}catch(ex){}
            await init(dirpath);
            const cfg = await getConfig(dirpath);
            try{ await rmdir(dirpath,{recursive:true});}catch(ex){
                console.error(ex);
            }
            assert.deepEqual(
                cfg,defaultOption
            )
        });
        it('./option', async function() {
            const dirpath = join(__dirname,"option");
            await init(dirpath);
            const cfg = await getConfig(dirpath);
            try{ 
                //await rm(join(dirpath,"cd-express.json"));
            }
            catch(ex){
                console.error(ex);
            }
            assert.deepEqual(
                cfg,merge({},defaultOption,{
                    static:{
                        "/":["./public","./docs"]
                    },
                    router:{
                        "/":["./router"]
                    }
                })
            )
        });
    });
});