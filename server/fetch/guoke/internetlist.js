'use strict'


const dao = require('./dao.js');
const _log = require('../../util.js')._log;
const config = require('../../config.js');

const postInternet = function (data, AV, callback) {
    const internetlist = AV.Object.extend('internetlist'); //生物文章列表对象
    let inter = new internetlist();
    if (!data.id) return
    let interid = data.id;
    findArticleById('internet', interid, AV,function (flag) {
         if (flag) return;
         // 设置数据
        inter.set('data_id', data.id);
        inter.set('update_time', data.updatetime);
        inter.set('content', data.content);
        inter.set('name', data.subject.name);
        inter.set('key', data.subject.key);
        inter.set('authorname', data.author.nickname);
        inter.set('authorintroduction', data.author.introduction);
        inter.set('avatarsmall', data.author.avatar.small);
        inter.set('avatarlarge', data.author.avatar.large);
        inter.set('avatarnormal', data.author.avatar.normal);
        inter.set('listimg', data.listimg.url);
        inter.set('listimgwidth', data.listimg.width);
        inter.set('listimgheight', data.listimg.height);
        inter.set('tag', data.tag);
        inter.set('summary', data.summary);
        inter.set('title', data.title);
        inter.save().then(function (obj) {
             //对象保存成功
             console.log('互联网数据保存成功')
             // console.log(obj)
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

/**
 * 生物列表
 * @type {{}}
 */
module.exports = {
    postInternet: postInternet
}