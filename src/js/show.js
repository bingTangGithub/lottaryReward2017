var $ = require('jquery');
var ease = require('./easing.js');
var Event = require('./event.js');
var utils = require('./utils.js');
var staff = require('../data/wuliStaffXGHL.json');
var reward = require('../data/reward.json');


var staffInfo;
var firstAward = [0, 0];
var rewrdResult = {
    '0': [],
    '1': [],
};


var html = {
    tpl: {
        base: '<li><img src="src/images/xinguagn2.png"></li>',
        staffList: (function() {
            var _current = [];                      
            for (var i = 0; i < staff.length; i++) {
              var current = staff[i];
              var genTpl = function(i, empName, department, awardedPreaching, image) {
                  return '<img index="' + i + '" name="' + empName + '" department="' + department + ' "awardedPreaching="' + awardedPreaching + '" class="staff-item" src="' + image + '"/>';
              };
              var tpl = genTpl(i, current.empName, current.department, current.awardedPreaching, current.IMAGE);
              _current.push(tpl);
            }

            return '<li class="people"><div class="staff-list">' + _current.join('') + '</div></li>';
        })()
    },
    createHtml: function(htmlTpl, length) {
        $('.list').html(htmlTpl);

        var newArr = [];
        for (var i = 0; i < length; i++) {
            var index = parseInt(Math.random() * staff.length);
            while (isInArray(index, newArr)) {
                index = Math.floor(Math.random() * 18);
            }

            newArr.push(index);
        }
        console.log(newArr);
        
        $('.staff-list').each(function(index) {
            $(this).css({
                'top': -(newArr[index] * 222) + 'px',
            });
        });
    },
    createList: function(obj) {
        var type = obj.type;
        var tpl = this.tpl;
        var genListTpl = function(tpl, baseCount, staffCount) {
            if (baseCount < 0 || staffCount < 0) {
               throw new Error('baseCount or staffCount cannot be negative in createList::genListTpl function');
            }

            var base = tpl.base;
            var halfBaseCount = Math.floor(baseCount / 2);
            var staff = tpl.staffList;
            var result = [];

            while (staffCount > 0) {
                result.push(staff);
                staffCount--;
            }

            while (halfBaseCount > 0) {
                result.unshift(base);
                result.push(base);
                halfBaseCount--;
            }
        
            return result.join('');
        };

        switch (type) {   
            case '0':  
                var temp = genListTpl(tpl, 2, 3);
                this.createHtml(temp, 3);   
                break;
            case '1':
                var temp = genListTpl(tpl, 4, 1);
                this.createHtml(temp, 1);
                break;
        }
    }
}

var rewardListSwtich = function() {
    var $triangle = $('.triangle');
    var $bonusSetUl = $('.bonus_set ul');

    if ($triangle.hasClass('on')) {
        $triangle.css({
            '-webkit-transform': 'translateY(-50%) rotate(-90deg)'
        }).addClass('off').removeClass('on');

        $bonusSetUl.css({
            'height': '0px',
            'border-top': 'none',
            'border-bottom': 'none'
        });
    } else {
        $triangle.css({
            '-webkit-transform': 'translateY(-50%) rotate(0deg)'
        }).addClass('on').removeClass('off');

        $bonusSetUl.css({
            'display': 'block',
            'height': '150px',
            'border-top': '3px solid #ff95a8',
            'border-bottom': '3px solid #ff95a8'
        });
    }
}

// staff-list 动画
var ani = {
    oneTime: 50, // 每人动画时间 100ms
    ing: false,
    oneHeight: 222,
    staffLen: staff.length,
    extraTime: 100,
    obj: {},
    linearLoopAni: function(ele) { // 循环匀速运行
        var _this = this;
        var animationTime = _this.oneTime * (_this.staffLen - 1);

        ele.animate({
            'top': -(_this.oneHeight * (_this.staffLen - 1)) + 'px'
        }, animationTime, 'linear', function() {
            ele.css('top', '0');
            _this.linearLoopAni(ele);
        });
    },
    easeInAni: function(ele, cb, obj) { // 加速运行到最底部
        var _this = this;
        var currentIndex = Math.round(Math.abs(parseInt(ele.css('top'), 10) / ani.oneHeight));

        ++indexStop;
        ani.obj = obj;

        ele.animate({
            'top': -(_this.oneHeight * (_this.staffLen - 1)) + 'px'
        }, _this.oneTime * (_this.staffLen - currentIndex), 'easeInQuad', function() {
            ele.css('top', '0');
            cb && cb(ele);
        });
    },
    easeOutAni: function(ele, cb) { // 减速运行到目标位置
        obj = ani.obj;
        var type = obj.type;
        var totalArray = rewrdResult[0].concat(rewrdResult[1]);
        var _this = this;
        var index = ele.index('.staff-list');
        var resultCon = $('.message li').eq($('.people').eq(index).index())[0];
        var currentTop = ele.css('top');
        var absTop = Math.abs(parseInt(currentTop, 10));   
        var awardIndex =  parseFloat(absTop / ani.oneHeight).toFixed(2) ; 
        var reducedIndex = Math.floor(awardIndex);

        console.log('reducedIndex:' + reducedIndex);

        if(rewrdResult[0].length > 12 && !isInArray(165,rewrdResult[0])){
            reducedIndex = 164;
        }

        while (isInArray(reducedIndex, totalArray)) {
            reducedIndex = Math.floor(Math.random() * staff.length);
        }

        rewrdResult[type].push(reducedIndex);
        
        if (rewrdResult[type].length === parseInt(reward[type].number,10)) {
            firstAward[type] = 1;
        }
     
        console.log('一等奖获奖人员:' + rewrdResult[0]);
        console.log('特等奖获奖人员:' + rewrdResult[1]);
        var imgAward = $('.staff-list').eq(index).find('img[index= ' + reducedIndex + ']');
        var name = imgAward.attr('name');
        var awardedPreaching = imgAward.attr('awardedPreaching');
        var department = imgAward.attr('department');
        var awardedPreaching = imgAward.attr('awardedPreaching');

        ele.css({
            'top': -(reducedIndex * 222) + 'px'
        });

        resultCon.innerHTML = '<div>' + name + '&nbsp||&nbsp;' + department + '</div><div style="text-align:left;">' + awardedPreaching + '</div>';
    }
}

function isInArray(el, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === el) {
            return true;
        }
    }
    return false;
}


$('.bonus_set_title').on('click', function() {
    if (!startBoolean) {  //已经点击开始按钮，开始转啦
        return;
    }

    indexStop = 0;
    rewardListSwtich();
});

var visibility1 = 'hidden';
var visibility2 = 'hidden';
var visibility3 = 'hidden';

$('.bonus_set ul li').on('click', function() {
     
    window.drawErr = false;

    var index = $(this).attr('reward');   //几等奖
    rewardListSwtich();
    $('.bonus_set .bonus_set_title').css({
        'background': 'url(' + reward[index]['bg'] + ') no-repeat center '
    });

    html.createList({
        type: index
    });

    $('.bonus_set_title').attr('reward', index);
    
    visibility3 = 'visible';
        
        if(index === '0'){
            visibility2 = 'visible';
        }else{
            visibility2 = 'hidden';
        }
    $('.lottery ul li').html('<img src="src/images/xinguagn2.png">');
    $('.message').html('<li style="visibility:hidden;"><div>***</div><div>*****</div></li><li style="visibility:'+visibility2+';"><div>***</div><div>*****</div></li><li style="visibility:'+visibility3+';"><div>***</div><div>*****</div></li><li style="visibility:'+visibility2+';"><div>***</div><div>*****</div></li><li style="visibility:hidden;"><div>***</div><div>*****</div></li>');
    
})

var startBoolean = true;  //开始按钮是否生效,开始可点
var stopBoolean = false;  //暂停按钮是否生效，开始不可点
var indexStop = 0;  //点击暂停按钮时，总共有几栏转起来了

$('.start').on('click', function() {
    var rewardIndex = $('.bonus_set_title').attr('reward');
    if(rewardIndex === 'null') {
        console.log('先选择抽奖类型哈');
        return;
    }

    var obj = { type: rewardIndex };
    var awards = reward[obj.type];
    var cancleBoolean = false;  

    html.createList({
        type: obj.type
    });
    if (firstAward[obj.type] === 1) {
        utils.confirm('您已抽过' + awards.name + '！是否重新抽取？', function() {
            firstAward[obj.type] = 0;
            rewrdResult[obj.type].length = 0;
        }, function() {
            firstAward[obj.type]  = 1;
            console.log('我不抽了！');
            cancleBoolean = true;
            return;
        });
    }
    
    if (cancleBoolean) { 
        console.log('我不抽了,拜拜！'); 
        return; 
    }

    if (startBoolean) {
        startBoolean = false;
        stopBoolean = true;
        if (ani.ing && rewardIndex == 'null') {
            return;
        }

        ani.ing = true;

        Event.trigger('start', {
            type: rewardIndex
        });

        if (window.drawErr) {
            return;
        }

       visibility3 = 'visible';
        
        if (obj.type === '0') {
            visibility2 = 'visible';
        } else {
            visibility2 = 'hidden';
        }
        $('.message').html('<li style="visibility:hidden;"><div>***</div><div>*****</div></li><li style="visibility:'+visibility2+';"><div>***</div><div>*****</div></li><li style="visibility:'+visibility3+';"><div>***</div><div>*****</div></li><li style="visibility:'+visibility2+';"><div>***</div><div>*****</div></li><li style="visibility:hidden;"><div>***</div><div>*****</div></li>');
    
        $('audio')[0].play();
        $('.staff-list').each(function(index) { 
            var ele = $(this);
            setTimeout(function() {
                ani.easeInAni(ele, function(ele) {
                    ani.linearLoopAni(ele);
                }, obj);    
            }, index * 300);
        });
    } else {
        console.log('请先点击暂停按钮！');
    }
});

// var levels = {
//     'dev': 1,
//     'online': 2,
//     'test': 3
//   };
// function Logger(mode) {
    

//     this.level = levels[mode];
// };
// Logger.prototype = {
//   log: function() {
//     if (window.console && console.log) {
//       if (this.level !== levels['online']) {
//           window.console.apply(console, Array.prototype.slice.call(arguments));
//       }
//     }
//   }
// };

// var logger = new Logger('online');


$('.stop').on('click', function() {
    var type = ani.obj.type;
    var wan = indexStop % 3;
    console.warn('我是余数我是余数我是余数我是余数我是余数我是余数我是余数' + wan);

    if (type === '0' && wan !== 0) {   //一等奖三栏没有都转起来
        console.log('开始时间太短，请稍后！');
        return;
    }

    if (!stopBoolean) {
        return;
    }

    startBoolean = true;
    stopBoolean = false;
    
    if (!ani.ing) {
        return;
    }
    var counter = 0;
    $('.staff-list').each(function(index) {
        var ele = $(this);
        ele.stop();
        ani.easeOutAni(ele, function() {
            counter++;
            if (counter === $('.staff-list').length) {
                ani.ing = false;
                $('audio')[0].pause();
            }
        });
    })

});


