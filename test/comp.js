const globby = require('globby')
const path = require('path')


let basePath = path.join(process.cwd(),'packages')

let res = globby.sync(['**/index.js'],{
    cwd: basePath
})



res = res.reduce((accur,item)=>{
    accur[path.dirname(item)] = path.join(basePath,item) 
    return accur
},{})

console.log(res)

