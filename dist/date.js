"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
function md5(text) {
    if (!text) {
        return '';
    }
    return crypto.createHash('md5').update(text).digest('hex').toLowerCase();
}
exports.md5 = md5;
function date_format(date, fmt) {
    let o = {
        "M+": date.getMonth() + 1,
        "D+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(Y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            let v = o[k].toString();
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (v) : (("00" + v).substr((v.toString()).length)));
        }
    }
    return fmt;
}
exports.date_format = date_format;
/**
 * get date at 00:00:00
 * @param d date to transform
 * @param options {y:year+-,m:month+-,d:day+-}
 */
function get_ymd(d = new Date(), options = {}) {
    options.y = options.y || 0;
    options.m = options.m || 0;
    options.d = options.d || 0;
    return new Date(d.getFullYear() + options.y, d.getMonth() + options.m, d.getDate() + options.d);
}
exports.get_ymd = get_ymd;
//# sourceMappingURL=date.js.map