# Deep JavaScript Foundations, v3
Kyle Simpson
___

## Types

"In JavaScript, everything is an object" -- this is FALSE - Kyle Simpson

`false` is NOT an object

Many of the values can behave as objects, but that does not make it an object.

```
6.1ECMAScript Language Types

An ECMAScript language type corresponds to values that are directly manipulated by an ECMAScript programmer using the ECMAScript language. The ECMAScript language types are Undefined, Null, Boolean, String, Symbol, Number, and Object. An ECMAScript language value is a value that is characterized by an ECMAScript language type.
```
https://www.ecma-international.org/ecma-262/9.0/index.html#sec-ecmascript-language-types

There are primitive types in JS: 
* undefined
* null 
* boolean 
* string 
* symbol 
* number
* object -- not everything is an object!

Others
undeclared? How do we deal with things not declared? 
null?
function? (it's a subtype of the object type)
array? (it's a subtype of object type)
bigint? (not yet in js but its in development)

many have object-like behaviors but are not objects

"In JavaScript, variables don't have types, values do" - Kyle Simpson

## typeof operator
```
var v;
typeof v;       // "undefined"
v = "1";
typeof v;       // "string"
v = 1;
typeof v;       // "number"
```

`undefined` can be considered a default value; when it is not defined, it is "undefined"

`undefined` does not mean "does not have a value yet" because it is possible to set a variable once defined, back to `undefined`.

`typeof` will always return a value, it will not return `undefined`, but it can return `"undefined"`

`typeof`' returns string that expect what one can do with this value.

```
var v = null;
typeof v;          // "object" --- OOPS!

```
historical fact of js -- if you wanted to unset a regular value, use undefined, but to unset an object use null, and that K. Simpson originally believed `typeof null` returns 'object'; This is actually a bug!

```
var v = function() {};
typeof v;       // "function" -- hmmm? function isn't a primitive type
```
```
var v = [1,2,3];
typeof v;      // "object" -- hmm? it's an array!
```
These are historical reasons for these issues, but there are other means to check types, e.g. `Array.isArray`

```
var v = 42n;
typeof v;       // "bigint"
```
bigints and numbers are not interchangeable, they're separate things

## undefined versus undeclared
1. undeclared means its never been declared in any scope that we have access to.
2. undeclared means there's definitely a variable and right now does not have a value;

```
type of blah        // "undeclared" -- does not throw an error even though the blah variable does not exist
```

uninitialized (aka Temporal Dead Zone TDZ)
certain variables do not get initially set to `undefined`

## Special Values

NaN (Not a Number)
* It's not "Not a Number", it means this "sentinel" value that indicates an invalid number
* NaN is NOT equal to itself!
    * IEEE specifically states NaNs are not equal to each other
    * only value in JS that does not have the identity property, it's not equal to itself
* isNaN("my dog's age")     // true -- OOPS!, shouldn't it be false because it is not the NaN value
    * historically isNaN will convert letters to numbers, before it checks for them to be NaN
    * JS will coerce the value from strings to NaN and thus it's true
    * Spec very clearly says coerce the number
* Number.isNaN
    * no coercion - checks whether the value is NaN or not
    * Number.isNaN("my dog's age")  // returns false
* typeof NaN is a number! It's just an invalid number
* Better to think of NaN as an "invalid number"

Negative Zero
* IEEE 754 does require there to be a negative zero
* zero with a sign bit
```
var trendRate = -0;
trendRate === -0; // true
trendRate.toString(); // "0" -- OOPS! -- language thought developers would that this would be bug and thus just printed out "0", therefore creating a bug. Don't try to outsmart the developer~
trendRate === 0; // true -- OOPS!
trendRate < 0; // false
trendRate > 0; // false
Object.is(trendRate, -0) // true
Object.is(trendRate, 0); // false

```

## Fundamental Objects
aka Built-in objecgts
aka native functions

Use `new` to construct an object of that type
* Object()
* Array()
* Function()
* Date()
* RegExp()
* Error()

Don't use `new`:
* String()
* Number()
* Boolean()

Don't use the above as constructors, just functions




