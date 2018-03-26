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
 * @param options Object {extname:"",debug:false,record_time:false}
 */
declare function register(type: string, timeFormat: string, options?: IRegisterOpt): logFunction;
export default register;
