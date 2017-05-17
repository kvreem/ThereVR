const arr = new Uint16Array(2);

arr[0] = 0x5432;
arr[1] = 0x1234;

const buf1 = Buffer.from(arr);
const buf2 = Buffer.from(arr.buffer);

console.log(buf1);
console.log(buf2[1]);

for (i = 0; i < 4; i++) {
  console.log(buf2[i], buf2[i].toString(16));
}


/*
IF TWO 16 BIT VALUES ARE SENT
bit 7 - 0
bit 15 - 8
bit 7 - 0
bit 15 - 8
*/


const abuf = new Buffer([1,2,3,4]);

console.log('Print of buffer object',abuf);
console.log('Print as JSON', abuf.toJSON(abuf));