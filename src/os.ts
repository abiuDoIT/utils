
import * as fs from 'fs';
import * as path from 'path';

function mkdirs(file_path:string){
    if(fs.existsSync(file_path)){
        return true;
    }
    mkdirs(path.dirname(file_path))
    fs.mkdirSync(file_path)
    return true;
}


function mv(oldPath:string, newPath:string) {
    mkdirs(path.dirname(newPath))
    return new Promise((res, rej) => {
        fs.rename(oldPath, newPath, function (err) {
            if (err) {
                if (err.code === 'EXDEV') {
                    copy();
                } else {
                    rej(err);
                }
                return;
            }
            res();
        });

        function copy() {
            var readStream = fs.createReadStream(oldPath);
            var writeStream = fs.createWriteStream(newPath);

            readStream.on('error', rej);
            writeStream.on('error', rej);

            readStream.on('close', function () {
                fs.unlink(oldPath, res);
            });
            readStream.pipe(writeStream);
        }
    })

}


export {mkdirs,mv}

