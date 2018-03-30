declare function md5(text: string): String;
declare function date_format(date: Date, fmt: string): string;
/**
 * get date at 00:00:00
 * @param d date to transform
 * @param options {y:year+-,m:month+-,d:day+-}
 */
declare function get_ymd(date?: Date, {y, m, d}?: {
    y?: number;
    m?: number;
    d?: number;
}): Date;
export { md5, date_format, get_ymd };
