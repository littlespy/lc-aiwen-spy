'use strict'
const guoke = require('./guokelist.js');
const start = 11;
const end = 50;

guoke.getBiogyList(start, end, function () {
    guoke.getInternet(start, end, function () {
        guoke.getMath(start, end, function () {
            guoke.getInterview(start, end, function () {
            })
        });
    });
});





