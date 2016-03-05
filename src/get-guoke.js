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

getBiogyList(0,11,function(){
    console.log('done');
    //getBiogyList(100,200,function(){
    //    console.log('done');
    //})
});

/**
 * 爬去数据
 * @param offset
 * @param size
 */
function getBiogyList(offset,size,callback) {
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
            savePostingData(resultArr,0,resultArr.length,callback)
            //for(var i = 0;i < resultArr.length;i++){
            //    var detailUrl = resultArr[i].resource_url;
            //    savePostingData(detailUrl,function(){
            //        callback();
            //    });
            //
            //
            //}
        });
}

/**
 * 持久化推送数据
 * @param url
 * @param callback
 */
function savePostingData(resultArr,index,length,callback){
    console.log(index);
    if(index < length-1){
        setTimeout(function(){
            index++;
            var url = resultArr[index].resource_url;
            getDetailData(url,function(){
                savePostingData(resultArr,index,length,callback);
            })
        },1000);
    }else{
        callback();
    }
}

function getDetailData(url,callback){
    request.get(url)
        .end(function(err, res){
            if(err){
                console.log('err');
                _log(err);
            }else{
                var resultObj = res.body.result;
                var articalData = {};
                if(!resultObj || !resultObj.id){
                    return;
                }
                articalData.id = resultObj.id;
                articalData.content = resultObj.content;
                articalData.subject = resultObj.subject;
                articalData.author = resultObj.author;
                articalData.tag = 'biology';
                articalData.listimg = resultObj.image_info;
                articalData.summary = resultObj.summary;
                articalData.title = resultObj.title;
                articalData.updatetime = resultObj.date_modified;
                articalData.image_info = resultObj.image_info;
                postArticle(articalData);
                callback();
            }
        });
}

/**
 * 编写日志
 * @param content  日志内容
 * @private
 */
function _log(content){
    _stream.write(content)
}


/**
 * post article 到 avoscloud
 */
function postArticle (data, callback){
    var bio = new biologylist();

    if(!data.id) return

    var bioid = data.id

    findArticleById(bioid, function(flag){
        if(flag) return;
        // 设置数据

        bio.set('bio_id', data.id);
        bio.set('update_time', data.updatetime);
        bio.set('content', data.content);
        bio.set('name', data.subject.name);
        bio.set('key', data.subject.key);
        bio.set('authorname', data.author.nickname);
        bio.set('authorintroduction', data.author.introduction);
        bio.set('avatarsmall', data.author.avatar.small);
        bio.set('avatarlarge', data.author.avatar.large);
        bio.set('avatarnormal', data.author.avatar.normal);
        bio.set('listimg', data.listimg.url);
        bio.set('listimgwidth', data.listimg.width);
        bio.set('listimgheight', data.listimg.height);
        bio.set('tag', data.tag);
        bio.set('summary', data.summary);
        bio.set('title', data.title);
        bio.save().then(function (obj) {
            //对象保存成功
            console.log('保存成功')
            // console.log(obj)
        }, function (error) {
            //对象保存失败，处理 error
            _log(error)
        }).always(function(){
            //无论成功还是失败，都调用到这里
            callback && callback('done')
        })
    })

}


/**
 * 根据id查询文章
 * @param id
 * @param callback
 */
function findArticleById(id, callback){
    var queryAt = new AV.Query('biologylist')

    queryAt.equalTo("bio_id", id)

    queryAt.find({
        success: function(results) {
            if(results.length > 0){
                console.log('存在', id, results.length)
                callback && callback(true)
            }else{
                callback && callback(false)
            }
        },
        error: function(error) {
            callback && callback(false)
        }
    })
}