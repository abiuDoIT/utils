//joffe 流方式日志模块
const fs = require('fs');
const path = require('path');
let curday = new Date().getDate();
const BUFFER_CHECK_INTERVAL = 2000;//2s
const BUFFER_FLUSH_LEN = 4096;
const env = process.env.env||'local';
const LOG_DIRECTORY = path.resolve(`./logs-${env}/`);
let dnow = new MyDate();
setInterval(()=>{
    dnow = new MyDate();
},800)
function MyDate(){
    let date = new Date();
    date.formatMap = {};
    date.getFromFormat = function(format){
        if(!date.formatMap[format])
            date.formatMap[format] = date.Format(format)
        return date.formatMap[format];        
    }
    return date;
}
MyDate.prototype.Format = function (fmt) { 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


//logFile 类.用流来写入log 更高效,避免爆仓
//http://segmentfault.com/blog/chshouyu/1190000000519006
function LogFile(path){
    this.buffers = [];
    this.bufferCheckInterval = BUFFER_CHECK_INTERVAL;
    this.init(path);
}

LogFile.prototype.init = function(path) {
    let self = this;
    this.path = path;
    this.stream = fs.createWriteStream(path, {
        flags : 'a' //全部权限,读写
    });

    this.bufferCheckTimer = setInterval(function() {
        self._flush(); //定时保存
    }, this.bufferCheckInterval);

};

LogFile.prototype.destroy = function() {
    this._flush();

    if (this.bufferCheckTimer) {
        clearInterval(this.bufferCheckTimer);
        this.bufferCheckTimer = null;
    }
    if (this.stream) {
        this.stream.end();
        this.stream.destroySoon();
        this.stream = null;
    }
};

LogFile.prototype.restart = function(path) {
    this.destroy();
    this.init(path);
};

LogFile.prototype.push = function(str) {
    this.buffers.push(str);
    if (this.buffers.length >= BUFFER_FLUSH_LEN) {
        this._flush();
    }
};

LogFile.prototype._flush = function() {
    if (this.buffers.length > 0 && this.stream) {
        this.buffers.push('');
        let str = this.buffers.join('\n');
        this.stream.write(str);
        this.buffers = [];
    }
};



function format(str,not_need_time){
    if(not_need_time){
        return (str+'').replace(/[\r\n]/g,"##");
    }else{
         return dnow.getFromFormat('YYYY-MM-dd hh:mm:ss') +'\t' + str.replace(/[\r\n]/g,"##");
    }
    
}
function mkdirs(file_path){
    if(fs.existsSync(file_path))
        return true;
    mkdirs(path.dirname(file_path))
    fs.mkdirSync(file_path)
}
/**
 * @param type String 
 * @param timeFormat String "yyyy-MM-dd hh:mm:ss"
 * @param options Object {extname:"",debug:false,not_need_time:false}
 */
exports.register = function(type,timeFormat,options){
    options = options||{};
    if(exports[type])
        return;
    if(!type||!timeFormat)
        throw "type and timeFormat is required "
    let extname = options.extname||`.${type}.log`;
    let dir = path.resolve(LOG_DIRECTORY,type);
    mkdirs(dir);
    let log = new LogFile(path.resolve(dir,dnow.getFromFormat(timeFormat))+extname)
    exports[type] = function(str){
        str = str.toString();
        if(options.debug)
            console.log(str);
        if(log.path!=dnow.getFromFormat(timeFormat))
            log.restart(path.resolve(dir,dnow.getFromFormat(timeFormat))+extname)
        log.push(format(str,options.not_need_time))
    }
}


