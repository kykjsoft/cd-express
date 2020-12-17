# cd-express
using express through configuration


start

```
cd-express
```

create config

```
cd-express init
```




```js
module.exports = {
    static:{
        "~":"./examples"
    },
    open:{
        enabled:true,
        url:"demo.html",
        app:"chrome"
    }
}
```