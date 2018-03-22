const _ = require('./dist')
const path = require('path')

console.log(_)
console.log(_.get_ymd());
console.log(_.random(20));
console.log(_.mkdirs(path.resolve('./tt')));