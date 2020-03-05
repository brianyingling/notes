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


var arr = [10,20,NaN,30,40,50];

arr.includes(20) //true

arr.includes(60) // false

arr.includes(NaN) // true

## flat && flatMap

Added in es2019

Array.flat() takes in a parameter indicating how many levels to flat, default is 1.

Can call array.map and then flatten; can just use flatMap will iterate over an array, map it and then flatten.

