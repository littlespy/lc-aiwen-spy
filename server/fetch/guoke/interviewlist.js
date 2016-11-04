'use strict'


const dao = require('./dao.js');
const _log = require('../../util.js')._log;
const config = require('../../config.js');

const postInterview = function (data, AV, callback) {
    const interviewlist = AV.Object.extend('interviewlist'); //专访列表对象
    let interview = new interviewlist();
    if (!data.id) return
    let interviewid = data.id;
    findArticleById('interview', interviewid, AV,function (flag) {
        if (flag) return;
        // 设置数据
        interview.set('data_id', data.id);
        interview.set('update_time', data.updatetime);
        interview.set('content', data.content);
        interview.set('name', data.subject.name);
        interview.set('key', data.subject.key);
        interview.set('authorname', data.author.nickname);
        interview.set('authorintroduction', data.author.introduction);
        interview.set('avatarsmall', data.author.avatar.small);
        interview.set('avatarlarge', data.author.avatar.large);
        interview.set('avatarnormal', data.author.avatar.normal);
        interview.set('listimg', data.listimg.url);
        interview.set('listimgwidth', data.listimg.width);
        interview.set('listimgheight', data.listimg.height);
        interview.set('tag', data.tag);
        interview.set('summary', data.summary);
        interview.set('title', data.title);
        interview.save().then(function (obj) {
            //对象保存成功
            console.log('专访数据保存成功')
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
    postInterview: postInterview
}