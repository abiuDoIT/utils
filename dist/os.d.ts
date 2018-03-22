declare function mkdirs(file_path: string): boolean;
declare function mv(oldPath: string, newPath: string): Promise<{}>;
export { mkdirs, mv };
