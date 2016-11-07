'use strict'

const config = require('../../config.js');
const biologylist = require('./biologylist.js');
const internetlist = require('./internetlist.js');
const mathlist = require('./mathlist.js');
const interviewlist = require('./interviewlist.js');
const _log = require('../../util.js')._log;
const request = require('superagent');

const savingList = function (tag, taglist,resultArr, index, length, AV, callback) {
    if (index < length) {
        setTimeout(function () {
            let url = resultArr[index].resource_url;
            getDetailData(tag, taglist,url, AV, function () {
                index++;
                savingList(tag,taglist, resultArr, index, length, AV, callback);
            })
        }, 500);
    } else {
        callback();
    }
}

function getDetailData(tag, taglist,url, AV, callback) {
    request.get(url)
        .end(function (err, res) {
            if (err) {
                console.log('err');
                _log(err);
            } else {
                let resultObj = res.body.result;
                let articalData = {};
                if (!resultObj || !resultObj.id) {
                    return;
                }
                articalData.id = resultObj.id;
                articalData.content = resultObj.content;
                articalData.subject = resultObj.subject;
                articalData.author = resultObj.author;
                articalData.tag = config.tagList[tag].id;
                articalData.listimg = resultObj.image_info;
                articalData.summary = resultObj.summary;
                articalData.title = resultObj.title;
                articalData.updatetime = resultObj.date_modified;
                articalData.image_info = resultObj.image_info;
                postArticle(tag, taglist,articalData, AV, function () {

                });
                callback();
            }
        });
}

/**
 * post article 到 avoscloud
 */
function postArticle(tag, taglist,data, AV, callback) {
    postAction(tag,taglist,data, AV, callback)
    // if (tag === 'biology') {
    //     biologylist.postBiology(data, AV, function () {
    //         callback();
    //     })
    // }
    // if (tag === 'internet') {
    //     internetlist.postInternet(data, AV, function () {
    //         callback();
    //     })
    // }
    // if (tag === 'math') {
    //     mathlist.postMath(data, AV, function () {
    //         callback();
    //     })
    // }
    // if (tag === 'interview') {
    //     interviewlist.postInterview(data, AV, function () {
    //         callback();
    //     })
    // }
}

function postAction(tag,taglist,data, AV, callback){
    const listobj = AV.Object.extend(taglist); //文章列表对象
    let obj = new listobj();
    if (!data.id) return
    let objid = data.id;
    findArticleById(tag, objid, AV,function (flag) {
        if (flag) return;
        // 设置数据
        obj.set('data_id', data.id);
        obj.set('update_time', data.updatetime);
        obj.set('content', data.content);
        obj.set('name', data.subject.name);
        obj.set('key', data.subject.key);
        obj.set('authorname', data.author.nickname);
        obj.set('authorintroduction', data.author.introduction);
        obj.set('avatarsmall', data.author.avatar.small);
        obj.set('avatarlarge', data.author.avatar.large);
        obj.set('avatarnormal', data.author.avatar.normal);
        obj.set('listimg', data.listimg.url);
        obj.set('listimgwidth', data.listimg.width);
        obj.set('listimgheight', data.listimg.height);
        obj.set('tag', data.tag);
        obj.set('summary', data.summary);
        obj.set('title', data.title);
        obj.save().then(function (obj) {
            //对象保存成功
            console.log(tag+'数据保存成功');
        }, function (error) {
            //对象保存失败，处理 error
            _log(error)
        }).always(function () {
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
function findArticleById(tag, id, AV, callback) {
    let queryAt = new AV.Query(config.tagList[tag].object)
    queryAt.equalTo(tag + "_id", id)
    queryAt.find({
        success: function (results) {
            if (results.length > 0) {
                console.log('存在', id, results.length)
                callback && callback(true)
            } else {
                callback && callback(false)
            }
        },
        error: function (error) {
            callback && callback(false)
        }
    })
}

module.exports = {
    savingList: savingList,
}