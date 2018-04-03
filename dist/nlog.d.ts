export interface IOption {
    BUFFER_CHECK_TIME?: number;
    BUFFER_FLUSH_LENGTH?: number;
    LOG_DIR?: string;
    env?: string;
}
export declare function setConfig(opt: IOption): void;
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
export declare type logFunction = (str: string) => void;
/**
 * @param type String
 * @param timeFormat String "YYYY-MM-DD hh:mm:ss"
 * @param opt Object {extname:"",debug:false,record_time:false}
 */
declare function register(type: string, timeFormat: string, opt?: IRegisterOpt): logFunction;
export default register;
