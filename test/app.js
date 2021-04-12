const createApp = require("../index");
const path = require("path");

createApp(path.join(__dirname,"./option"),{
    port:8888,
    static:{
        "/":["./public"]
    },
    proxy:"http://127.0.0.1:5009"
});