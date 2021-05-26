
const mergeOptionDeep = function(){
    const fn = createMergeMethod((rev,last,key)=>{
        if(typeof last[key] == "object" && last[key].constructor===Object){
            rev[key]={};
            fn(rev[key],last[key])
        } else if (last[key]!==undefined){
            rev[key] = last[key];
        }
    })
    return fn;
}()

const mergeOption = createMergeMethod((rev,last,key)=>{
    if(last[key]!==undefined){
        rev[key] = last[key];
    }
})

function createMergeMethod(fn){
    const rfn = function(...args){
      if(!args.length){return}
      if(args.length===1){args[0]}
  
      const first = args[0];
      const second = args[1];
      for(var a in second){
        fn(first,second,a);
      }
      if(args.length>2){
          return rfn.call(this,first,...args.slice(2))
      }
      return first;
    }
    return rfn;
}

module.exports = {
    mergeOptionDeep,
    mergeOption,
    createMergeMethod
}