'use strict'


const dao = require('./dao.js');
const _log = require('../../util.js')._log;
const config = require('../../config.js');

const postMath = function (data, AV, callback) {
    const mathlist = AV.Object.extend('mathlist'); //生物文章列表对象
    let math = new mathlist();
    if (!data.id) return
    let mathid = data.id;
    findArticleById('math', mathid, AV,function (flag) {
        if (flag) return;
        // 设置数据
        math.set('data_id', data.id);
        math.set('update_time', data.updatetime);
        math.set('content', data.content);
        math.set('name', data.subject.name);
        math.set('key', data.subject.key);
        math.set('authorname', data.author.nickname);
        math.set('authorintroduction', data.author.introduction);
        math.set('avatarsmall', data.author.avatar.small);
        math.set('avatarlarge', data.author.avatar.large);
        math.set('avatarnormal', data.author.avatar.normal);
        math.set('listimg', data.listimg.url);
        math.set('listimgwidth', data.listimg.width);
        math.set('listimgheight', data.listimg.height);
        math.set('tag', data.tag);
        math.set('summary', data.summary);
        math.set('title', data.title);
        math.save().then(function (obj) {
            //对象保存成功
            console.log('数学数据保存成功')
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
    postMath: postMath
}