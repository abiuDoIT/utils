import { date_format } from './date';
import * as fs from 'fs';
import * as path from 'path';
import { mkdirs } from './os';

export interface IOption {
    BUFFER_CHECK_TIME?: number;
    BUFFER_FLUSH_LENGTH?: number;
    LOG_DIR?: string;
    env?: string;
}

export function setConfig (opt: IOption) {
    Object.assign(options, opt);
}

const options = {
    BUFFER_CHECK_TIME: 2000,
    BUFFER_FLUSH_LENGTH: 1024 * 8,
    LOG_DIR: '',
    env: 'local',
};

const LOG_DIRECTORY: string = options.LOG_DIR || path.resolve(`./logs-${options.env}/`);

class MyDate extends Date {
    private formatMap: { [property: string]: string } = {};
    // tslint:disable-next-line:no-shadowed-variable
    public getFromFormat(format: string): string {
        if (!this.formatMap[format]) {
            this.formatMap[format] = date_format(this, format);
        }
        return this.formatMap[format];
    }
}

let dnow: MyDate = new MyDate();

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
    private filePath: string;
    private stream: fs.WriteStream;
    private buffers: string = '';
    constructor(filePath: string) {
        this.filePath = filePath;
        this.stream = fs.createWriteStream(this.filePath, { flags: 'a' });
        setInterval(this.flush.bind(this), options.BUFFER_CHECK_TIME);
    }
    public resetStream(filePath: string) {
        if (this.filePath === filePath) {
            return;
        }
        this.filePath = filePath;
        this.stream.end();
        this.stream.destroy();
        this.stream = fs.createWriteStream(this.filePath, { flags: 'a' });
    }
    public flush() {
        this.stream.write(this.buffers);
        this.buffers = '';
    }
    public push(str: string) {
        this.buffers += str;
        if (this.buffers.length > options.BUFFER_FLUSH_LENGTH) {
            this.flush();
        }
    }
}





interface IFilePathOpt {
    type: string;
    timeFormat: string;
    extname: string;
}
interface IRegisterLog extends IFilePathOpt {
    log: LogFile;
}

export interface IRegisterOpt {
    /**
     * if true, console.log your logData
     */
    debug?: boolean;
    /**
     * logfile's extname like '.csv'
     */
    extname?: string;
    /**
     * if true,add time at the front of each line
     */
    record_time?: boolean;
}

const register_logs: IRegisterLog[] = [];

function get_file_path(opt: IFilePathOpt): string {
    const dir = path.resolve(LOG_DIRECTORY, opt.type);
    mkdirs(dir);
    return path.resolve(dir, dnow.getFromFormat(opt.timeFormat)) + opt.extname;
}


function format(str: string): string {
    return str.replace(/[\r\n]/g, '##') + '\n';
}
function format_with_time(str: string): string {
    return dnow.getFromFormat('[YYYY-MM-DD hh:mm:ss]') + '\t' + str.replace(/[\r\n]/g, '##') + '\n';
}

export type logFunction = (str: string) => void;
/**
 * @param type String
 * @param timeFormat String "YYYY-MM-DD hh:mm:ss"
 * @param opt Object {extname:"",debug:false,record_time:false}
 */
function register(type: string, timeFormat: string, opt: IRegisterOpt = {}): logFunction {
    if (typeof type !== 'string' || typeof timeFormat !== 'string') {
        throw new Error('type and timeFormat is required string');
    }
    initInterval();
    opt.extname = opt.extname || `.${type}.log`;
    const file_path_opt = { type, timeFormat, extname: opt.extname };
    const log = new LogFile(get_file_path(file_path_opt));
    register_logs.push({ log: log, ...file_path_opt });
    const format_fn = opt.record_time ? format_with_time : format;
    if (opt.debug) {
        return (str: string) => {
            console.log(str);
            log.push(format_fn(str));
        };
    } else {
        return (str: string) => {
            log.push(format_fn(str));
        };
    }
}
export default register;



