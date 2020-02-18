# Deep JavaScript Foundations, v3
Kyle Simpson
___
## Scope

Scope
* Nested Scope
* Hoisting
* Closure
* Modules

Scope: where to look for things
1. What is it that we're looking for? Answer: identifiers:
`x = 42`;
`console.log(y)`
All variables are either receiving a value or retrieving the value.

It's a game of matching marbles to buckets! e.g. a red marble in a red bucket.

K.S. - JS is *not* an interpreted language, but in fact a *compiled* language

JavaScript is in fact, compiled, or at least parsed:
If a syntax error is on line 10, but you get that error before lines 1-9 execute, you have indeed run into a problem caught by a compiler! Otherwise, how did it knew about line 10 before executing lines 1-9, except of course JS went through a processing step first.

In Compiler Theory, there are 4 stages to a compiler:
1. Lexing 
2. Tokenization
3. parsing (turns a stream of tokens into an abstract syntax tree)
4. Code generaation (taking an AST and producing an executable form)

People think, JS can't be compiler because I don't have a compiler on my machine and I don't ship off some binary elsewhere to be run.

People think interpreted and compiled as the distribution model for the binary. But that's not the right axis to be thinking about.

Should be asking: is the code processed before it is executed or not?

Marble Sorting Analogy:
Processing our variables and putting them in their sorted buckets.

Before it executes, there is a stage where all of this compiliation happens, produces an AST, and a plan for the lexical environment.

Like Java, JavaScript compiles code into a bytecode.
There's a parser that parses through your JS and produces an intermediate representation not that dissimilar from bytecode and hands it off to the JavaScript VM, which is embedeed within the same JS engine.

Think of JS as a two-pass system rather than a single-pass system.

Process the code first, then setup the scopes, then execute

What are the buckets? Units of scope. Those are 1. functions and 2. blocks.

## Compilation and Scope

```
var teacher = 'kyle';

function otherClass() {
    var teacher = 'suzy';
    console.log('welcome');
}

function ask() {
    var question = 'why';
    console.log(question);
}

otherClass();
ask();

```

Shadowing - having two variables at different scopes using the same name.

All of the lexical scopes, all the identifiers are determined at compile time.
It is USED, but NOT determined at runtime.

That processed code is then handed off to the runtime.
`var teacher` part - the declaration part is handled by the compiler
`= 'kyle'` part - handled by the interpreter at runtime.

## Dynamic Global Scope

If a child scope is referencing a variable that hasn't been declared, and the interpreter makes its checks and gets all the way to the global scope, and does not find a declared variable, it will create one for you.

Declaring a variable at the global scope and having the global scope create a variable because it hasn't been declared at the lower scopes have slight differences; there's performance issues, but they are two global variables.

Never never intentionally create auto globals by leaving out the `var/const/let` keyword.

## Strict Mode

`"use strict";`

Dynamic global scopes will throw a ReferenceError instead of setting it.

Tools like Babel is turning on 'strict mode' but even in es6 it is not automatically on because it could break legacy code.

## Nested Scope

## undefined vs. undeclared
* undefined - a variable exists but it has no value, it is `undefined`
* undeclared - a variable that is never formally declared in any scope we have access to.

## Lexical Scope Elevator

Kyle explains his elevator going up to the top floor, where the bottom floor is the bottom scope and the top floor is the global scope.

