//引用文件系统模块
var fs = require("fs");
// 1. 读当前文件夹下的所有图片文件
var getFiles = {
    //读取文件夹下的所有列表
    readFileList: function(path, filesList){
        var files = fs.readdirSync(path);
        // console.log('files', files);
        files.forEach(function (itm, index) {
            var stat = fs.statSync(path + itm);
            if (stat.isDirectory()) {
                //递归读取文件
                readFileList(path + itm + "/", filesList)
            } else {
                var obj = {};//定义一个对象存放文件的路径和名字
                obj.path = path;//路径
                obj.filename = itm//名字
                filesList.push(obj);
            }
        });
    },
    //获取文件夹下的所有文件
    getFileList: function (path) {
        var filesList = [];
        this.readFileList(path, filesList);
        return filesList;
    },
    //获取文件夹下的所有图片
    getImageFiles: function (path) {
        var imageList = [];
        var isImageFormat = function (filename) {
            return /\.(jpg|bmp|png|gif)$/gi.test(filename);
        };

        this.getFileList(path).forEach((item) => {
            if (isImageFormat(item.filename)) {
                imageList.push(item.filename)
            }
        });
        // console.log('imageList', imageList);
        return imageList;
    }
};

//获取文件夹下的所有图片
var imageFiles = getFiles.getImageFiles("../staffImage/");
// console.log('我是所有图片'+getFiles.getImageFiles("../staffImage/"));

// 2. 根据生成固定的json格式
function generatePersonInfo(list) {
//
    function checkDuplicates(el, arr){
        var empName = el.split("-")[2];
        var department = el.split("-")[1];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].empName === empName) {
                if(arr[i].department === department){
                    return true;
                }  
            }
        }

        return false;
    }

    var result = [];
    for (var i = 0, item, res, empName; i < list.length; i++) {
        item = list[i];
        res = item.split("-");
        console.log('我是第'+i+'个:'+res[2]);
        if(checkDuplicates(item,result)){
            console.log('我重复了，我是:' + item.split("-")[2]);
            continue;
        }
        result.push({
            "EMPLOYEE_ID": res[0],
            "empName": res[2],
            "department": res[1],
            "awardedPreaching": res[3].split('.')[0],
            "IMAGE": "src/staffImage/" + item
        });
    }
    console.log('总共参加人数：' + result.length);
    return result;
}

var personInfo = generatePersonInfo(imageFiles);
// console.log('我是所有图片文字222222'+relult2);

// 3. 导出成json文件
function writeJson(arr, callback) {
    fs.writeFile('../data/wuliStaffXGHL.json', JSON.stringify(arr), 'utf8', function(err) {
        if (err) throw err;
        console.log('我是生成的json文件'); 
    });
}

writeJson(personInfo);