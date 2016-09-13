'use strict'

/**
 * 数据api接口请求爬虫
 */

const fs = require('fs');
const path = require('path');
const AV = require('leanengine');
const request = require('superagent');
const colors = require('colors');
const cheerio = require('cheerio');
const config = require('../../config.js');
const base = config.site.guoke;
const dao = require('./dao.js');


AV.initialize(config.APP_ID, config.APP_KEY, config.MASTER_KEY);

/**
 * 爬去数据
 * @param offset
 * @param size
 */
const getBiogyList = function (offset, size, callback) {
    let tid = config.tagList.bio.id
    let params = {
        retrieve_type: 'by_subject',
        subject_key: tid,
        limit: size,
        offset: offset,
        _: new Date().getTime()
    }
    request.get(base)
        .query(params)
        .end(function (err, res) {
            if (err) {
                _log(err);
            }
            const resultArr = res.body.result;
            dao.savingList('bio', resultArr, 0, resultArr.length, AV,callback)
        });
}

module.exports = {
    getBiogyList: getBiogyList
}