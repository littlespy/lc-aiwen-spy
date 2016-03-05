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
var cheerio = require('cheerio');
var config = {
    tagList: [{
        "id": "biology",
        "name": "生物"
    }]
};

var biologylist = AV.Object.extend('biologylist');  //生物文章列表对象
var _stream = fs.createWriteStream('../log/biology.js', {
    flags: 'a',
    encoding: 'utf-8'
})

getBiogyList(0,1);

/**
 * 爬去数据
 * @param offset
 * @param size
 */
function getBiogyList(offset,size) {
    var tag = config.tagList[0]
    var tid = tag.id;
    var tname = tag.name
    var params = {
        retrieve_type:'by_subject',
        subject_key:tid,
        limit:size,
        offset:offset,
        _:new Date().getTime()
    }
   // getPageDelay()
    request.get(base)
        .query(params)
        .end(function(err, res){
            if(err){
                _log(err);
            }
            var resultArr = res.body.result
            for(var i = 0;i < resultArr.length;i++){
                var detailUrl = resultArr[i].resource_url;

                //articalData.id = resultArr[i].id;
                //articalData.type = resultArr[i].subject.name;
                //articalData.key = resultArr[i].subject.key;
                //articalData.author = resultArr[i].author;
                //articalData.listimg = resultArr[i].image_info;
                //articalData.summary = resultArr[i].summary;
                //articalData.title = resultArr[i].title_hide;
                //articalData.updatetime = resultArr[i].date_modified;
                //接着扒取详情页内容数据
                    request.get(detailUrl)
                    .end(function(err, res){
                        if(err){
                            _log(err);
                        }else{
                            var resultObj = res.body.result;
                            var articalData = {};
                            articalData.code='200';
                            articalData.data = {};
                            articalData.id = resultObj.id;
                            articalData.data.content = resultObj.content;
                            articalData.subject = resultObj.subject;
                            articalData.author = resultObj.author;
                            articalData.listimg = resultObj.image_info;
                            articalData.summary = resultObj.summary;
                            articalData.title = resultObj.title;
                            articalData.updatetime = resultObj.date_modified;
                            console.log(JSON.stringify(articalData));
                        }
                    });
            }
        });
}


//function getPageDelay(params, callback){
//    //var url = base + page
//
//    getListFromUrl(params, function (data){
//        data['tag'] = ctag
//        postArticle(data)	// 写入avos
//    },function(){
//        page += 25
//        console.log(index, page)
//        if(page > 925){
//            callback && callback()
//            return
//        }
//        setTimeout(function(){
//            getPageDelay(base, page, ctag, callback)
//        }, 3000)
//    })
//}

/**
 * 编写日志
 * @param content  日志内容
 * @private
 */
function _log(content){
    _stream.write(content)
}

function getListFromUrl(url, cbData, cbDone){
    console.log('get url:', url)
    osmosis
        .config({
            tries: 1,
            timeout: 10 * 60 * 1000,
            concurrency: 1
        })
        .get(url)	// 列表页url
        .find('.pagedlist_item')
        .set({
            'account_avatar': '.profile_photo_img@src',		// 微信公众账号avatar
            'update_time': 'span.timestamp',
            'article_id': '.question_link@href',			// 文章id 对应的是 chuansong.me 上的id
        })
        .data(function (listing){
            _num++
            cbData && cbData(listing)	// 返回数据

            console.log(colors.yellow.underline(_num), colors.yellow(listing.article_id))
            _log(fmt(_num + listing.article_id + '\n'))
        })
        .done(function(s){
            cbDone && cbDone()	// 一次爬虫完毕
        })
        .error(function(err){
            _log(fmt(err))
        })
}

/**
 * fing article by id in leancloud
 */
//function findArticleById(id, callback){
//    var queryAt = new AV.Query('Article')
//
//    queryAt.equalTo("article_id", id)
//
//    queryAt.find({
//        success: function(results) {
//            if(results.length > 0){
//                console.log('存在', id, results.length)
//                callback && callback(true)
//            }else{
//                callback && callback(false)
//            }
//        },
//        error: function(error) {
//            callback && callback(false)
//        }
//    })
//}

/**
 * 延迟推送
 * @param base
 * @param page
 * @param ctag
 * @param callback
 */
//function getPageDelay(base, page, ctag, callback){
//    var url = base + page
//
//    getListFromUrl(url, function (data){
//        data['tag'] = ctag
//        postArticle(data)	// 写入avos
//    },function(){
//        page += 25
//        console.log(index, page)
//        if(page > 925){
//            callback && callback()
//            return
//        }
//        setTimeout(function(){
//            getPageDelay(base, page, ctag, callback)
//        }, 3000)
//    })
//}

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