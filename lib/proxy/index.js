const {createProxyMiddleware} = require('http-proxy-middleware');
const fs = require("fs");
const path = require("path");
var html_404 = fs.readFileSync(path.join(__dirname,"res/404.html"),{encoding:"utf-8"})

module.exports = function createProxy(option) {
    // 开启启代理
    return createProxyMiddleware(Object.assign({
        "changeOrigin": true,
        "target": null,
        "ws": true
        ,
        //向服务器转发请求前，将 [本机IP_端口]kjsoftUserCookie 转为 [目标服务器IP_端口]kjsoftUserCookie
        onProxyReq(proxyReq, req, res) {
            
        },
        //服务器响应后，将 [目标服务器IP_端口]kjsoftUserCookie 转为 [本机IP_端口]kjsoftUserCookie
        onProxyRes(proxyRes, req, res) {
            if(proxyRes.statusCode===404){
                if(req.headers && req.headers.accept && req.headers.accept.indexOf("application/json")>-1){
                    res.writeHead(404, {
                        'Content-Type': 'application/json; charset=UTF-8',
                    });
                    res.end(JSON.stringify({
                        error:1,
                        message:"页面未找到"
                    }));
                }else{
                    res.writeHead(404, {
                        'Content-Type': 'text/html; charset=UTF-8',
                    });
                    res.end(html_404);
                }
            }
        },
        onError(err, req, res) {
            res.writeHead(500, {
                'Content-Type': 'text/plain',
            });
            res.end('转发信息出错。 原始错误：'+err);
        }
    },option));
}