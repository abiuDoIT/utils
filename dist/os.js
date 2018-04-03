"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function mkdirs(file_path) {
    if (fs.existsSync(file_path)) {
        return true;
    }
    mkdirs(path.dirname(file_path));
    fs.mkdirSync(file_path);
    return true;
}
exports.mkdirs = mkdirs;
function mv(oldPath, newPath) {
    mkdirs(path.dirname(newPath));
    return new Promise((res, rej) => {
        fs.rename(oldPath, newPath, function (err) {
            if (err) {
                if (err.code === 'EXDEV') {
                    copy();
                }
                else {
                    rej(err);
                }
                return;
            }
            res();
        });
        function copy() {
            const readStream = fs.createReadStream(oldPath);
            const writeStream = fs.createWriteStream(newPath);
            readStream.on('error', rej);
            writeStream.on('error', rej);
            readStream.on('close', function () {
                fs.unlink(oldPath, res);
            });
            readStream.pipe(writeStream);
        }
    });
}
exports.mv = mv;
