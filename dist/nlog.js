"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_1 = require("./date");
const fs = require("fs");
const path = require("path");
const os_1 = require("./os");
function setConfig(opt) {
    Object.assign(options, opt);
}
exports.setConfig = setConfig;
const options = {
    BUFFER_CHECK_TIME: 2000,
    BUFFER_FLUSH_LENGTH: 1024 * 8,
    LOG_DIR: '',
    env: 'local',
};
const LOG_DIRECTORY = options.LOG_DIR || path.resolve(`./logs-${options.env}/`);
class MyDate extends Date {
    constructor() {
        super(...arguments);
        this.formatMap = {};
    }
    // tslint:disable-next-line:no-shadowed-variable
    getFromFormat(format) {
        if (!this.formatMap[format]) {
            this.formatMap[format] = date_1.date_format(this, format);
        }
        return this.formatMap[format];
    }
}
let dnow = new MyDate();
let is_inited = false;
function initInterval() {
    if (!is_inited) {
        setInterval(() => {
            dnow = new MyDate();
            register_logs.forEach((log) => {
                log.log.resetStream(get_file_path(log));
            });
        }, 1000);
        is_inited = true;
    }
}
// tslint:disable-next-line:max-classes-per-file
class LogFile {
    constructor(filePath) {
        this.buffers = '';
        this.filePath = filePath;
        this.stream = fs.createWriteStream(this.filePath, { flags: 'a' });
        setInterval(this.flush.bind(this), options.BUFFER_CHECK_TIME);
    }
    resetStream(filePath) {
        if (this.filePath === filePath) {
            return;
        }
        this.filePath = filePath;
        this.stream.end();
        this.stream.destroy();
        this.stream = fs.createWriteStream(this.filePath, { flags: 'a' });
    }
    flush() {
        this.stream.write(this.buffers);
        this.buffers = '';
    }
    push(str) {
        this.buffers += str;
        if (this.buffers.length > options.BUFFER_FLUSH_LENGTH) {
            this.flush();
        }
    }
}
const register_logs = [];
function get_file_path(opt) {
    const dir = path.resolve(LOG_DIRECTORY, opt.type);
    os_1.mkdirs(dir);
    return path.resolve(dir, dnow.getFromFormat(opt.timeFormat)) + opt.extname;
}
function format(str) {
    return str.replace(/[\r\n]/g, '##') + '\n';
}
function format_with_time(str) {
    return dnow.getFromFormat('[YYYY-MM-DD hh:mm:ss]') + '\t' + str.replace(/[\r\n]/g, '##') + '\n';
}
/**
 * @param type String
 * @param timeFormat String "YYYY-MM-DD hh:mm:ss"
 * @param opt Object {extname:"",debug:false,record_time:false}
 */
function register(type, timeFormat, opt = {}) {
    if (typeof type !== 'string' || typeof timeFormat !== 'string') {
        throw new Error('type and timeFormat is required string');
    }
    initInterval();
    opt.extname = opt.extname || `.${type}.log`;
    const file_path_opt = { type, timeFormat, extname: opt.extname };
    const log = new LogFile(get_file_path(file_path_opt));
    register_logs.push(Object.assign({ log: log }, file_path_opt));
    const format_fn = opt.record_time ? format_with_time : format;
    if (opt.debug) {
        return (str) => {
            console.log(str);
            log.push(format_fn(str));
        };
    }
    else {
        return (str) => {
            log.push(format_fn(str));
        };
    }
}
exports.default = register;
