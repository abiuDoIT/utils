declare function mkdirs(file_path: string): boolean;
declare function mv(oldPath: string, newPath: string): Promise<{}>;
declare function md5(text: string): string;
declare function date_format(date: Date, fmt: string): string;
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
export { mkdirs, md5, mv, date_format, get_ymd };
