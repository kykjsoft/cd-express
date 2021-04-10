const express = require("express");
const index = express();

index.get("/",function(req,res){
    res.writeHead("")
})

exports.index = index;