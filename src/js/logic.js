var utils = require('./utils.js');
var $ = require('jquery');
var Event = require('./event.js');

// var staff = require('../data/staff.json');
var staff = require('../data/wuliStaffXGHL.json');
var reward = require('../data/reward.json');


var staffInfo;
var rewrdResult;
var init = function() {
    staffInfo = null;
    if (utils.getItem('staffInfo') === null) {
        staffInfo = staff;
        utils.setItem('staffInfo', staffInfo);
    } else {
        staffInfo = utils.getItem('staffInfo');
    }
    if (utils.getItem('rewrdResult') === null) {
         rewrdResult = {
            '0': [],
            '1': [],
        };
        utils.setItem('rewrdResult', rewrdResult);
    } else {
        rewrdResult = utils.getItem('rewrdResult');
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


Event.on('start', function(obj) {
    // drawLottery(obj);
})





