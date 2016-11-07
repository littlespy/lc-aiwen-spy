'use strict'
const guoke = require('./guokelist.js');

guoke.getBiogyList(0, 10, function () {
    console.log('done');
});


guoke.getInternet(0, 10, function () {
    console.log('done');
});


guoke.getMath(0, 10, function () {
    console.log('done');
});

guoke.getInterview(0,10,function(){
    console.log('done!!!');
})