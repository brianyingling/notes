# Deep JavaScript Foundations, v3
Kyle Simpson
___
# Scope and Function Expressions

## Function expressions

This is a function declaration:
` function teacher() {/* ... */}`

This is a function expression:
` var myTeacher = function anotherTeacher() {/* ... */}`

Function declarations attach their name to the enclosing scope.

Function expressions will add their definition to their own scope.

## Named Function Expressions

A function expression that has been given a name.

function declaration is when the word `function` the first thing in the statement

`var clickHandler = function() {} // anonymous fn expression`

`var clickHandler = function clickHandler() {} // named fn expression`

Kyle: Always, 100% should prefer the named function expression:
* Creates a reliable self-reference from inside itself. For recursion or needing to reference itself.
* More debuggable stack trace (rather than seeing anonymous functions in stack trace)
* More self-documenting code

If you can't come up with a name for your function, it probably means its either too complex or you don't understand the function.

Generally, an inline function expression can be 1,2,3 lines of code, unless it's called many times, then I'll turn it into a function declaration.

## Arrow Functions
MDN docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions

Arrow functions are anonymous functions, I don't think you should use arrow functions.

Shouldn't be using them simply because they're nice and short.

Promise Chains are very spaghetti-like, like jQuery all those years back. - K.S.

## Function Types Hiearchy

(Named) Function Declarations > Named Function Expressions > Anonymous Function Expressions

