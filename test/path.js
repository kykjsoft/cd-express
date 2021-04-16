const path = require('path');

console.log(path.isAbsolute("backup/doc"))

process.chdir("G:/")
console.log(process.cwd())
console.log(path.relative(__dirname,""))
console.log(path.relative(process.cwd(),"../../a.html"))
console.log(path.relative(process.cwd(),"G:/zhuqiang-doc/backup/doc"))

