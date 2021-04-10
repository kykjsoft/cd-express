module.exports = {
    port:3000,
    debug:false,
    static:{
        "~":["./"],
    },
    open:{
        enabled:false,
        app: 'chrome',
        url:"/"
    }
}