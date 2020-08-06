const b = require('bcryptjs');

const pass = 'aaa';

const salt = b.genSaltSync(10);

console.log(salt);

const hash = b.hashSync(pass, salt);

console.log(hash)

const correct = b.compareSync(pass, hash)

console.log(correct)