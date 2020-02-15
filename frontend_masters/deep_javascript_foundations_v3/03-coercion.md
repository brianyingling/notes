# Deep JavaScript Foundations, v3
Kyle Simpson
___

## Coercion

### Abstract Operation
Fundamental construct on how we deal with type conversion

#### ToPrimitive(hint)
On any non-primitive, there can be two functions that exist:
on "number"
* valueOf()
* toString()

#### toString()
Takes any value and stringifies it
On a non-primitive (an object), it will call call toString() first, then valueOf()
[].toString()                   // returns ""
[1,2,3].toString()              // returns "1,2,3"
[null,undefined].toString()     // returns ","
[[[],[],[]],[]].toString()      // returns ",,,"
[,,,].toString()                // returns ",,,"


{} on toString()                // returns [object Object]
{a: '2'} on toString()          // returns [object Object]
{ toString() { return "X"}}     // returns "X"

#### toNumber()
toNumber() on an empty string becomes 0
null's become empty strings, then convert into 0

#### toBoolean()
Is the value called falsy or truthy?

Falsy                   Truthy
""                      Everything else
0, -0
null
NaN
false
undefined

#### Cases of coercion
"You claim to avoid coercion because it's evil, but..."

Template strings
template literals that receive parameters that are not strings are getting coerced to strings
```
var numStudents = 16;
console.log(`There are ${numStudents} in class`);
```
