import { program } from "commander";
import fs from "fs";
import {sha256} from "js-sha256";

program.option("-pass, --pass <string>");
program.option("-i, --i <string>");
program.option("-o, --o <string>");
program.parse();
const args = program.opts();

const pbkdf2 = require('pbkdf2');

// формирование aes-ключа с помощью pbkdf2 протокола. все параметры кроме пароля пока хардкодим
const derivedKey = pbkdf2.pbkdf2Sync(args.pass, 'salt', 1, 32, 'sha512');

console.log(derivedKey.toString("hex"));

let toEncrypt = fs.readFileSync(args.i);

const aesjs = require('aes-js');

const aes = new aesjs.AES(derivedKey);

let res = Buffer.from([]);

// в aes есть требование, чтобы блоки были по 16 байт, поэтому делаем паддинг нулями
if (toEncrypt.length % 16 !== 0) {
  const pad = Buffer.alloc(16 - toEncrypt.length%16, 0);
  toEncrypt = Buffer.concat([pad, toEncrypt]);
}

// хэшируем файл с паддингом (чтобы после расшифровки сверять корректность)
const hash = sha256(toEncrypt);
toEncrypt = Buffer.concat([toEncrypt, Buffer.from(hash, "hex")]);

// шифрование блоками
for (let i = 0; i < toEncrypt.length; i+=16) {
  const a = toEncrypt.subarray(i, i+16);
  const x = aes.encrypt(a);
  res = Buffer.concat([res, x]);
}

fs.writeFileSync(args.o, res);