const serve = require("../../packages/serve/index")


serve(__dirname,{
    static:"./public",
    port:3050
})