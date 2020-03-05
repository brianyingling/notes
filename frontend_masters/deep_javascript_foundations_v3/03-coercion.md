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
+ operator is overloaded to concatenate strings, if one is a number and the other a string, the number will be coerced to a string

var num = 16;
num.toString() is still implicit coercion because primitives dont have methods

#### Boxing
how is it that we can access .length on a primitive string?
This is called boxing, a form of implicit coercion
Here is this thing that's not an object, you're trying to use it as an object, I'm (the JS engine) is going convert it into the object you want.
"If I wanted to convert a primitive into an object just so I could use a property on it, I'd go write Java" - Kyle Simpson
This isn't an object, this is a primitive string that has an optimization on it where you can access it as if it were an object.

#### Corner Cases of Coercion

The Root of all (Coercion) Evil
Converting an empty string (or any whitespace within an empty strnig) converts it to 0 when calling Number() on it. 
1 < 2 < 3  // accidentally returns true
1 < 2      // true
true < 3   // true gets coerced into a number because you're expressing an operation with a number and a non-number, so true gets coerced into 1. And 1 < 3 is true


