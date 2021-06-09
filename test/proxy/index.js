
const app = createApp({
    el:"#app",
    props:{
        a:3,
        b:3,
        c:3
    },
    data:{
        d:5,
    },
    watch:{
        d(oldValue,newValue){
            console.log(`d ${oldValue} => ${newValue}`);
            label.innerHTML = newValue;
            inp.value = newValue;
            sum.innerHTML = this.sum;
        }
    },
    computed:{
        sum(){
            return this.a+this.b+this.c+this.d
        }
    },
    methods:{
        add(){
            this.d++
        },
        input(e){
            this.d =e.target.value;
        },
        click(){
            this.add();
        },
        say:function(){
            console.log(this.sum)
        }
    }
})

console.log(app.a)
app.say();
app.d = 333;

//sum.innerHTML = app.sum;

function createApp(option){
    var root = document.querySelector(option.el);
    return bindApi(root,createApi(option),option)
}

function bindApi(el,api,option){
    if(el.attributes){
        for(let a of el.attributes){
            if(a.name[0]=="@"){
                let name = a.name.slice(1);
                el.addEventListener(name,function(event){
                    api[name](event)
                })
            }
            if(a.name[0]==":"){
                let name = a.name.slice(1);
                el.addEventListener(name,function(event){
                    api[name](event)
                })
            }
        }
    }
    for(let child of el.children){
        bindApi(child,api)
    }
    return api;
}

function has(target,key){
    return Reflect.hasOwnProperty.call(target,key)
};

function createApi(option){
	const target = Object.assign({},option.data,option.props,option.methods,option);
    for(let k in (option.methods)){
        option.methods[k].bind(target)
    }
	let oldv,rev2;
	const rev =  new Proxy(target,{
		get:(target, property, receiver)=>{
            for(let key in ["data","props","methods"]){
                if(option[key] && Reflect.hasOwnProperty.call(option[key],property)){
                    return Reflect.get(option[key], property, receiver)
                }
            }
			if(option.computed && Reflect.hasOwnProperty.call(option.computed,property)){
				return Reflect.get(option.computed, property, receiver).call(rev)
			}
			return Reflect.get(target, property, receiver)
		},
		
		set:(target, property, value, receiver)=>{
			if(option.props && Reflect.hasOwnProperty.call(option.props,property)){
				throw "不能修改组件参数值"
			}
			if(option.computed && Reflect.hasOwnProperty.call(option.computed,property)){
				throw "不能修改计算属性"
			}
			if(option.methods && Reflect.hasOwnProperty.call(option.methods,property)){
				throw "不能修改计算属性"
			}
			if(option.data && Reflect.hasOwnProperty.call(option.data,property)){
                oldv = target[property];
                rev2 = Reflect.set(target, property,value, receiver)
                if(option.watch && has(option.watch,property)){
                    option.watch[property].call(rev,oldv,value)
                }
                return rev2;
			}
            return Reflect.set(target, property,value, receiver)
		}
	})
    return rev;
}