'use strict'

const config = require('../../config.js');
const biologylist = require('./biologylist.js');
const internetlist = require('./internetlist.js');
const mathlist = require('./mathlist.js');
const _log = require('../../util.js')._log;
const request = require('superagent');

const savingList = function (tag, resultArr, index, length, AV, callback) {
    if (index < length) {
        setTimeout(function () {
            let url = resultArr[index].resource_url;
            getDetailData(tag, url, AV, function () {
                index++;
                savingList(tag, resultArr, index, length, AV, callback);
            })
        }, 500);
    } else {
        callback();
    }
}

function getDetailData(tag, url, AV, callback) {
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
                postArticle(tag, articalData, AV, function () {

                });
                callback();
            }
        });
}

/**
 * post article 到 avoscloud
 */
function postArticle(tag, data, AV, callback) {
    if (tag === 'biology') {
        biologylist.postBiology(data, AV, function () {
            callback();
        })
    }
    if (tag === 'internet') {
        internetlist.postInternet(data, AV, function () {
            callback();
        })
    }
    if (tag === 'math') {
        mathlist.postMath(data, AV, function () {
            callback();
        })
    }
}

module.exports = {
    savingList: savingList,
}