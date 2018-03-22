import * as _ from 'lodash';
import * as os from './os';
import * as date from './date';

let utils = _;
Object.assign(utils,os);
Object.assign(utils,date);
export = utils;