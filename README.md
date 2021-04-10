# cd-express
using express through configuration

```js
module.exports = {
    static:{
        "/":"./public"
    },
    proxy:{
        "/":"http://127.0.0.1:5009"
    },
    router:{
        "/index":"./router/index"
    },
    open:{
        enabled:true,
        url:"demo.html",
        app:"chrome"
    }
}
```
