# JavaScript the Recent Parts
Kyle Simpson
___

## Array.find and Array.includes

```
var arr = [{a: 1}, { a: 2}];

arr.find(v => v && v.a > 1);
// { a: 2}

arr.find(v => v && v.a > 10);
// undefined

arr.findIndex(v => v && v.a > 10);
// -1

```