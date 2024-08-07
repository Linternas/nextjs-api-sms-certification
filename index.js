const { randomBytes } = require('crypto')

const bytes = randomBytes(3);
// 랜덤 바이트를 16진수 문자열로 변환하고, 10진수로 변환합니다.
const number = parseInt(bytes.toString('hex'), 16);
const certNum = number.toString().substring(0, 6);
console.log(number)
console.log(certNum);
