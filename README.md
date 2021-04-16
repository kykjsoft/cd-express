# cd-express
using express through configuration

## Install

```
$ npm install cd-express
```

## 

## Usage
```
$ cd-express --init
$ cd-express
```

### cd-express.json
```
{
    "$schema":"https://jsonschema-zh-hans.github.io/schemas/cd-express.json",
    "port":8988,
    "debug":true,
    "open":{
        
    },
    "static": { 
        "/": [ "./public" ] 
    },
    "router":{
        "/api":"./router"
    },
    "proxy":{ 
        "/":[
            {"target":"http://127.0.0.1:5009"}
        ] 
    }
}
```

## dev

* git branch -a | 查看所有分支
* git checkout dev | 切换到开发分支
* git pull

* 修改代码

* git pull
* git add .
* git commit -m "注释"
* git push -u origin dev
* git checkout master
* git pull origin master
* git merge dev
* git branch status
* git push origin master
  
### 

* git remote update origin --prune | 更新远程分支
* git branch -a | 查看所有分支
* git push origin --delete Chapater6 | 删除远程分支Chapater6
* git branch -d  Chapater6 | 删除本地分支 Chapater6