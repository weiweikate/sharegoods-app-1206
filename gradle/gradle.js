var fs = require("fs");

// 异步读取
fs.readFile('config.json', function (err, data) {
            if (err) {
            return console.error(err);
            }
            let obj = JSON.parse(data.toString());//转对象
    for (let key in obj){
        let item = obj[key]
        fs.stat(item.bulid_path, function (err, stats) {
            if (stats&&stats.isFile&&stats.isFile()){//是否存在文件

                fs.writeFile(item.bulid_path, item.content,  function(err) {
                    if (err) {
                        console.log("\n'***********************《" + key +"》***********************")
                        console.log('错误路径路径：' + item.bulid_path)
                        // console.error(err);
                        throw err;
                    }
                    console.log("\n***********************《" + key +"》***********************")
                    console.log('内容：' + item.content);
                    console.log('路径：' + item.bulid_path);
                });

            }else {
                console.log("\n***********************《" + key +"》***********************")
                console.log('错误路径：' + item.bulid_path )
                throw err;
                // return console.error(err);
            }
        })
    }

    });
