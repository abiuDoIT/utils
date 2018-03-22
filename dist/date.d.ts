declare function md5(text: string): String;
declare function date_format(date: Date, fmt: string): String;
/**
 * get date at 00:00:00
 * @param d date to transform
 * @param options {y:year+-,m:month+-,d:day+-}
 */
declare function get_ymd(d?: Date, options?: {
    y?: number;
    m?: number;
    d?: number;
}): Date;
export { md5, date_format, get_ymd };
