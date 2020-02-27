# JavaScript the Recent Parts
Kyle Simpson
___

## Iterators and Generators

What is an iterator pattern?

If you have a data source (an array) and if you want to consume that data one at a time, a common way to do that is to use the iterator pattern.

Construct a controller that gives you a view of that data source, one item at a time.

An iterable is something that can be iterated over.

```
var str = 'hello';
var world = ['w','o','r','l','d'];

var it1 = str[Symbol.iterator]();
var it2 = world[Symbol.iterator]();

it1.next(); // {value: 'h', done: false}
it1.next(); // {value: 'e', done: false}
```

## Declarative iterators

```
var str = 'hello';
var it = str[Symbol.iterator]();

for (let v of it) {
    console.log(v);
}
// 'h','e','l','l','o'

for (let v of str) {
    console.log(v);
}
// 'h','e','l','l','o'

```

Spreading out values
```
var str = 'hello';
var letters = [...str];
letters;
// ['h','e','l','l','o']
```

If you build a data structure that adheres to the iterator protocol, then anyone can use these built-in mechanisms on your data structure.

## Data Structures without Iterators

```
var obj = {
    a: 1,
    b:2,
    c: 3
}
for (let v of obj) {
    console.log(v);
}
// TypeError!
```
Object does not have a built in iterator

Not that difficult to make our own iterator for an object

Our own iterator:
```
var obj = {
    a: 1,
    b: 2,
    c: 3,
    [Symbol.iterator]: function() {
        var keys = Object.keys(this);
        var index = 0;
        return {
            next: () => {
                (index < keys.length) 
                    ? { done: false, value: this[keys[index++]]}
                    : { done: true, value: undefined}
            }
        }
    }
}

```

## Generators

Generators - a declarative way to producing an iterator

They don't "run", they produce an iterator

```
function *main() {
    yield 1;
    yield 2;
    yield 3;
    return 4;
}

// this is the iterator
var it = main();

keyword yield allows the generator to produce a new value every time it is iterated over.

Be sure to always `yield` values, not return values, in order to be acceptable to the iterator protocol

it.next();  // { value: 1, done: false}
it.next();// { value: 2, done: false}
it.next();// { value: 3, done: false}
it.next();// { value: 4, done: true}

[...main()]
// [1,2,3]

```