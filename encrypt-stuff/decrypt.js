const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { password, salt } = require('./config.js');
const filename = process.argv[2];
const dirname = path.dirname(__dirname);

const key = crypto.scryptSync(password, salt, 32);
const iv = Buffer.alloc(16, 0);
const decipher = crypto.createDecipheriv('AES-256-CBC', key, iv);

const pathIn = path.resolve(dirname, filename);
const pathOut = path.resolve(dirname, filename.slice(0, filename.lastIndexOf('.enc')));
const input = fs.createReadStream(pathIn);
const output = fs.createWriteStream(pathOut);
input.pipe(decipher).pipe(output);
