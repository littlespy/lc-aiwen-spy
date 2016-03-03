'use strict'
var fmt = require('util').format;
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var init = require('./init');
var AV = require('leanengine');
var request = require('superagent');
var osmosis = require('osmosis');
var colors = require('colors');

var config ={
    tagList:[{
        "id": "biology",
        "name": "生物"
    }]
}