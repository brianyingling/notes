# Deep JavaScript Foundations, v3
Kyle Simpson
___

# Advanced Scope

## Lexical Scope

## Dynamic Scope

Dynamic scope is such that the scope is defined WHERE the function is INVOKED, not where it is defined. So if say `ask()` gets invoked, and inside that function there's a variable called `teacher`, the interpreter would look in the scope of where ask was invoked rather than where it was defined.

JS does have a mechanism for this same type of flexibility, ahem `this`.

## Function Scoping

Principle of least exposure - should default to keep everything private and only expose what's necessary.
* Sets up a defensive posture
3 problems this solves:
* Solves naming collisions
* If it's hidden that means it can't be misused
* Protect yourself from future refactoring

## IIFE Pattern

A function expression that is immediately invoked.
```
(function blah() {
    // do stuff
})();
```
A function that we would run without polluting the enclosing scope.

## Block Scoping

Scoping that's done with blocks. Curly braces instead of functions.

`let` and `const` allows developers to assign variables to block, not function, scope.

Blocks are only scoped if a `let` or a `const` are inside them.

"Should only use let for just let blocks." - K.S.

## Choose let or var

use var to signal to the user that the variable is scoped to the function
use let to signal that it is in a block.

## Hoisting

Hoisting is actually not a real thing; JS does not move things around that the definition implies.

Hoisting is a metaphor that we made up to discuss the idea of lexical scope without thinking of lexical scope.

JS does not actually reorganize your code by moving your variable declarations to the top of the function.

Hoisting is a convention that we can use rather than describing the nitty-gritty details

The first pass searches for function and variable declarations, the second pass executes the lines.

For function expressions, functions must be defined before they are called. Not so with function declarations.

Function hoisting allows you to put the function definitions at the bottom and the executable code at the top.

## lets and consts don't hoist? FALSE!

lets and consts hoist to a block, vars hoist to a function

On compilation, parsing pass, vars variable declaration will initialize their values to `undefined`

On compilation, parssing pass, lets variable declarations will not initialize with a value and referencing it before being declared throws an error

const needed an error thrown if accessing the variable before its been assigned because otherwise you would see the `undefined` value assigned to it and then when used see the value; the value would have changed which violates `const`.

Function expressions do not hoist because it is executable code and JS isn't going to reorder reorder executable code; it would descend into chaos, but declared code can at compile time. It doesn't get assigned a variable at compile time 

