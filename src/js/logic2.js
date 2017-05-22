var utils = require('./utils.js');

var Event = require('./event.js');

var staff = require('../data/staff.json');
var reward = require('../data/reward.json');


var staffInfo;
var rewrdResult;
var dedupAwardArray;
var init = function() {
    staffInfo = null;
    if (utils.getItem('staffInfo') === null) {
        staffInfo = staff;
        utils.setItem('staffInfo', staffInfo);
    } else {
        staffInfo = utils.getItem('staffInfo');
    }

    if (utils.getItem('rewrdResult') === null) {
    // if (utils.getItem('dedupAwardArray') === null) {
        // rewrdResult = {
        //     '0': [],
        //     '1': [],
        //     '2': [],
        //     '3': [],
        //     '4': [],
        // };
        rewrdResult = {
            '0': [],
            '1': [],
        };
        //  dedupAwardArray = {
        //     '0': [],
        //     '1': [],
        // };

        // utils.setItem('dedupAwardArray', dedupAwardArray);
        utils.setItem('rewrdResult', rewrdResult);
    } else {
        rewrdResult = utils.getItem('rewrdResult');
        // dedupAwardArray = utils.getItem('dedupAwardArray');
    }
}
init();

window.addEventListener('beforeunload', function(e) {  //beforeunload,在即将离开当前页面(刷新或关闭)时执行 JavaScript :
    if (staffInfo !== null) {
        utils.setItem('staffInfo', staffInfo);
    }
    if (rewrdResult !== null) {
        utils.setItem('rewrdResult', rewrdResult);
    }
    // if (dedupAwardArray !== null) {
    //     utils.setItem('dedupAwardArray', dedupAwardArray);
    // }
    var message = "是否退出抽奖？";
    e.returnValue = message;
    return message;
});

// ctrl+shift+alt+i 初始化抽奖程序
window.addEventListener('keyup', function(e) {
    if (e.ctrlKey && e.shiftKey && e.altKey && e.keyCode === 73) {
        utils.confirm('是否初始化抽奖程序？', function() {
            for (i in localStorage) {
                staffInfo = null;
                utils.removeItem(i);
            }
            init();
            console.log("has init all!");
        }, function() {
            console.log('no init all!');
        })
    }
})

var Zwes = function(arr, type) {   //将每次抽奖中的人 （比如一次中3人）  放入newArr数组
    var len;
    if (reward[type].step > 0 && reward[type].number > 0) {
        len = reward[type].number / reward[type].step;   
    }
    if (reward[type].step == '-1') {
        len = 1;
    }
    var newArr = [];
    for (var i = 0; i < len; i++) {
        var index = parseInt(Math.random() * arr.length);
        newArr.push(arr[index]);
        arr.splice(index, 1);
    }
    return newArr;
}

var drawLottery = function(obj) {     //抽奖
    var type = obj.type;
    var awards = reward[obj.type];
    var result;
    if (checkDraw(obj)) {  //需要再次抽取或者是现金红包
        result = Zwes(staffInfo, type);
        for (var i = 0; i < result.length; i++) {
            // rewrdResult[type].push(result[i])
            rewrdResult[type].push(result[i])
        }
        window.currentResult = result;
        utils.setItem('rewrdResult', rewrdResult);
        utils.setItem('staffInfo', staffInfo);
    } else {　　//刚已经抽完了中奖人即砸鸡蛋的已经抽完
        utils.confirm('您已抽过' + awards.name + '！是否重新抽取？', function() {
            // var _current = rewrdResult[type];
            var _current = rewrdResult[type];
            for (var i = 0; i < _current.length; i++) {
                staffInfo.push(_current[i]);
            }
            rewrdResult[type].length = 0;
            drawLottery(obj);
            window.drawErr = false;
        }, function() {
            window.drawErr = true;
            return;
        })
    }
}

var cnt = 0;
var checkDraw = function(obj) {  //检查抽奖  是否需要下一轮
    var type = obj.type;
    var awards = reward[obj.type];
    // console.log('===============>>>>>', cnt++);
    // console.log(rewrdResult[0].length);
    // console.log(rewrdResult[1].length);
    // console.log('bbbbbbbbbbbbbbbbbbbbbbbbbb');
    if (rewrdResult[type].length >= awards.number && awards.number !== '-1') {  //一次即可抽完的非现金红包
        return false;
    } else {   //该奖项需要进行下一轮　　或者是现金红包
        return true;
    }
}

Event.on('start', function(obj) {
    drawLottery(obj);
})
