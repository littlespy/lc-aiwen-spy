'use strict'
const guoke = require('./guokelist.js');

guoke.getBiogyList(0, 100, function () {
    console.log('done');
});


guoke.getInternet(0, 100, function () {
    console.log('done');
});


guoke.getMath(0, 100, function () {
    console.log('done');
});