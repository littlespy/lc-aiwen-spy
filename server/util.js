'use strict'

const fs = require('fs');
const path = require('path');

const _stream = fs.createWriteStream('../../../log/biology.js', {
    flags: 'a',
    encoding: 'utf-8'
});

const _log = function(content) {
    _stream.write(content)
}

/**
 * 日志工具
 * @type {{_log: _log}}
 */
module.exports = {
    _log:_log
}