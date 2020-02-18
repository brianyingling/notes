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
