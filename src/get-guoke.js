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

                //接着扒取详情页内容数据
                    request.get(detailUrl)
                    .end(function(err, res){
                        if(err){
                            _log(err);
                        }else{
                            var resultObj = res.body.result;
                            var articalData = {};
                            articalData.bio_id = resultObj.id;
                            articalData.content = resultObj.content;
                            articalData.subject = resultObj.subject;
                            articalData.author = resultObj.author;
                            articalData.tag = 'biology';
                            articalData.listimg = resultObj.image_info;
                            articalData.summary = resultObj.summary;
                            articalData.title = resultObj.title;
                            articalData.updatetime = resultObj.date_modified;
                            articalData.image_info = resultObj.image_info;
                            //console.log(JSON.stringify(articalData));
                            postArticle(articalData,function(){

                            })
                        }
                    });
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

    if(!data.bio_id) return

    var bioid = data.bio_id

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

    queryAt.equalTo("id", id)

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