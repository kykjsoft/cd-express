const path = require('path');
const express = require('express');
const marked = require('marked');

function ProxyTarget(target,logName){
    return new Proxy(target,{
        get(target, name, receiver){
            console.log(logName,name);
            return ProxyTarget(Reflect.get(target,name, receiver),logName+"."+name);
        }
    })
}

module.exports = async function(app,config){
    if(config.markdown){
        //app.response = ProxyTarget(app.response,"response");
        
        const send = app.response.send;
        const end = app.response.end;
        const sendFile = app.response.sendFile;
        const sendfile = app.response.sendfile;
        

        app.use(function(req,res,next){
            next();
            return;
            console.log(req.url);
            if(path.extname(req.url)===".md"){
                res.end = function(...args){
                    console.log(args[0]);
                    console.log(args[1]);
                    end.apply(this,args);
                }
                res.sendFile = function(...args){
                    console.log('md sendFile');
                    sendFile.apply(this,args);
                }
                res.send = function(...args){
                    console.log('md');
                    send.apply(this,args);
                }
                res.sendfile = function(...args){
                    console.log('sendfile');
                    send.apply(this,args);
                }
            }else{
                res.end = end;
                res.sendFile = sendFile;
                res.send = send;
                res.sendfile = sendfile;
            }
            next();
        });
    }
}