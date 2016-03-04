'use strict'

/**
 * 数据api接口请求爬虫
 */

var fmt = require('util').format;
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var init = require('./init');
var AV = require('leanengine');
var request = require('superagent');
var colors = require('colors');
var base = 'http://www.guokr.com/apis/minisite/article.json';
var config = {
    tagList: [{
        "id": "biology",
        "name": "生物"
    }]
};

var biologylist = AV.Object.extend('biologylist');  //生物文章列表对象

//console.log(123);
getBiogyList();
function getBiogyList() {
    var tag = config.tagList[0]
    var tid = tag.id;
    var tname = tag.name
   //url http://www.guokr.com/apis/minisite/article.json?retrieve_type=by_subject&subject_key=biology&limit=20&offset=0&_=1457054116268
    var params = {
        retrieve_type:'by_subject',
        subject_key:tid,
        limit:100,
        offset:0,
        _:new Date().getTime()
    }
    request.get(base)
        .query(params)
        .end(function(err, res){
            //console.log(res.text);
            console.log(res.body);
        })
}

//function getPageFormTag(){
//    var tag = config.tagList[0]
//    var tid = tag.id;
//    var tname = tag.name
//    var base = 'http://www.guokr.com/scientific/subject/'
//
//    var url = base + tid + '/'
//
//    getPageDelay(url, 0, tag, function(){
//        index ++
//        if(index > config.tagList.length -1) return
//        getPageFormTag()
//    })
//}