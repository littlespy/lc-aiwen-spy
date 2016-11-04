'use strict'


const dao = require('./dao.js');
const _log = require('../../util.js')._log;
const config = require('../../config.js');

const postBiology = function (data, AV, callback) {
    const biologylist = AV.Object.extend('biologylist'); //生物文章列表对象
    let bio = new biologylist();
    if (!data.id) return
    let bioid = data.id;
    findArticleById('biology', bioid, AV,function (flag) {
         if (flag) return;
         // 设置数据
         bio.set('data_id', data.id);
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
             console.log('生物数据保存成功')
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
    postBiology: postBiology
}