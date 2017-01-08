var resolve = require('../');
// console.log('__dirname',__dirname);
//打印结果为：__dirname /Users/qingtian/Desktop/node-resolve/example

var res = resolve.sync('tap', { basedir: process.cwd() });
console.log('basedir表示此时从这里开始查找node_modules',res);
//注意：此时我们指定了从process.cwd开始逐层开始查找node_modules集合


// var res = resolve.sync('tap', { basedir: __dirname });
// console.log(res);
//打印：/Users/qingtian/Desktop/node-resolve/node_modules/tap/lib/main.js
//我们的resolve路径是采用node_modules逐层往上查找的
// var notNode_Modules=resolve.sync('qinliang.js',{basedir:__dirname});
// console.log('不在node_modules中的模块',notNode_Modules);
//此时会抛出一个错误,因为它只会寻找node_modules下的文件，如下是搜索路径：
/*
[   '/home/ruanyf/tmp/node_modules',
    '/home/ruanyf/node_modules',
    '/home/node_modules',
    '/node_modules' 
    '/home/ruanyf/.node_modules',
    '/home/ruanyf/.node_libraries'，
     '$Prefix/lib/node' ]
*/
// var notNode_Modules=resolve.sync('./../qinliang.js',{basedir:__dirname});
// console.log('不在node_modules中的模块',notNode_Modules);
//因为这里是相对路径，所以他不会再node_modules中查找，而是会直接查找相应的文件

// console.log('cwd---',process.cwd());
// var notNode_Modules=resolve.sync('./../qinliang.js',{basedir:process.cwd()});
// console.log('不在node_modules中的模块',notNode_Modules);
//process.cwd表示的是运行node的文件夹，而dirname表示存放js的文件路径
