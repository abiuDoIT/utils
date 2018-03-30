
import * as crypto from 'crypto';


function md5(text:string) :String{
    if (!text) {
        return '';
    }
    return crypto.createHash('md5').update(text).digest('hex').toLowerCase();
}

function date_format(date:Date,fmt:string) :string{ 
    let o :{[propName: string]:number} = {
        "M+": date.getMonth() + 1, //月份 
        "D+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(Y+)/.test(fmt)){
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o){
        if (new RegExp("(" + k + ")").test(fmt)){
            let v = o[k].toString();
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (v) : (("00" + v).substr((v.toString()).length)));
        }
    }
    return fmt;
}

/**
 * get date at 00:00:00
 * @param d date to transform
 * @param options {y:year+-,m:month+-,d:day+-}
 */
function get_ymd(date:Date=new Date(),{y=0,m=0,d=0}:{y?:number,m?:number,d?:number}={y:0,m:0,d:0}):Date{
    return new Date(date.getFullYear()+y,date.getMonth()+m,date.getDate()+d);
}

export {md5,date_format,get_ymd}

