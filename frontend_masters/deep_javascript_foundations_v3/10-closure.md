# Deep JavaScript Foundations, v3
Kyle Simpson
___

## Closure

"One of the most important inventions of computer science." - K.S.

## What is closure?

definition - when a function remembers and access its lexical scope *even when that function is executed outside of that lexical scope*.

Function can hold on to a reference to that scope even after when the execution context from which it was defined disappears.

It's almost as if closure is required for a lexically-scoped language with first class functions, otherwise if you attempted to use a referenced function where the execution context where it was defined disappears, the function would forget all of its variables.

## Closing over Variables

There is no *snapshot* of a variable. You don't close over a value; you close over a variable

```
var teacher = 'kyle';
var myTeacher = function()  {
    console.log(teacher);
}
teacher = 'suzy';
myTeacher();
```
What prints out is 'suzy' because it is a live link to the variables that were closed over; it is NOT capturing values, closure is preserving access to variables.

let variables as an index for a for loop, each iteration of the for loop creates a new `let` declaration.
`for (let i = 0; i < 3; i++) {`

Closure is a preservation of the linkage to the variable, not the capturing of the value.

## Modules

This is NOT a module pattern:

```
var workshop: {
    teacher: 'kyle',
    ask() {
        console.log('ask question');
    }
}

workshop.ask();

```
The module pattern REQUIRES the concept of encapsulation (hiding data and behavior).

Module pattern:
Modules encapsulate data and behavior (methods) together. The state (data) of a module is held together by its methods via closure.

```
var workshop = (function Module(teacher) {
    var publicApi = { ask };
    return publicApi;

    function ask(question) {
        console.log(teacher, question);
    }

})("kyle");

```

## ES6 modules & Node.js

es6 modules - work in progress

TC39 and NodeJs didn't talk to each other about their module plans and they were both incompatible with each other.



