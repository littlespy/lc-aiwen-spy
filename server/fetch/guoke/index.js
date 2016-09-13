'use strict'
const guoke = require('./guokelist.js');

guoke.getBiogyList(0, 20, function () {
    console.log('done');
});