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

const toDecrypt = fs.readFileSync(args.i);

const aesjs = require('aes-js');

const aes = new aesjs.AES(derivedKey);

let res = Buffer.from([]);

// расшифровка
for (let i = 0; i < toDecrypt.length; i+=16) {
  const a = toDecrypt.subarray(i, i+16);
  const x = aes.decrypt(a);
  res = Buffer.concat([res, x]);
}

// хэш
const hash = res.subarray(toDecrypt.length-32, toDecrypt.length);
// часть без хэша
const withoutHash = res.subarray(0, toDecrypt.length-32);

// считаем хэш и сравниваем
const computedHash = sha256(withoutHash);
if (hash.toString("hex").toLowerCase() != computedHash.toLowerCase()) {
  console.log(hash.toString("hex").toLowerCase());
  console.log(computedHash.toLowerCase());
}

// убираем паддинг нулями
let start = 0;
for (let i = 0; i < 16 && i < withoutHash.length; i++) {
  if (withoutHash.at(i) === 0) {
    start++;
  } else {
    break;
  }
}

fs.writeFileSync(args.o, withoutHash.subarray(start));