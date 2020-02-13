JavaScript: The Hard Parts, v2

## Closure Introduction
1. Closure is the most esoteric of JS concepts
2. Enables powerful pro-level functions like `once` and `memoize`
3. Many JS patterns including the module pattern use closure
4. Build iterators, handle partial application and maintain state in an asynchronous world

## Functions get a new memory every run/invocation
```
function multiplyBy2(inputNumber) {
    const result = inputNumber * 2;
    return result;
}

const output = multiplyBy2(7);
const newOutput = multiplyBy2(10);
```

## Functions with Memories
1. When our functions get called, we create a live store of data (local memory/variable environment/state) for that function's execution context
2. When the function finishes executing, its local memory (variable environment, or state) is deleted (except the returned value)
3. But what if our functions could hold on to live data between executions?
4. This would let our function definitions have an associated cache/persistent memory
5. But it all starts with us *returning a function from another function.*

## Functions can be returned from other functions in Javascript

```
function createFunction() {
    function multiplyBy2(num) {
        return num * 2;
    }
    return multiplyBy2;
}

const generatedFunc = createFunction();
const result = generatedFunc(3); // 6
```

`generatedFunc(3)` has no relationship with `createFunction()`, it is solely the `multiplyBy2` function

When a function returns a function and is used outside of that scope, it uses THE most powerful feature of JS - Will Sentance

## Nested Function Scope

Calling a function in the same function call as it was defined

```
function outer() {
    let counter = 0;
    function incrementCounter() {
        counter++;
    }
    incrementCounter();
}

outer();
```
## Calling a function outside of the function call in which it was defined

```
function outer() {
    let counter = 0;
    function incrementCounter() {
        counter++;
    }
    return incrementCounter;
}
const myNewFunction = outer();
myNewFunction();
myNewFunction();
```
When a function of a function that is returned, the scope within that function comes along with it. It brings with it a "backpack" of data when it is returned

## Function Closure
1. How does the function get to grab the surrounding data and keep the context (i.e. "backpack")
    [[scope]] - hidden property of the function that contains the surrounding data; this is the backpack
        - this is also private data and can only be accessed by invoking the function

## Closure Q&A

## Closure Technical Definition & Review
1. "closed over variable environment" - fancy name for the "backpack"
2. Also known as Persisted Lexical Scope Referenced Data (P.L.S.R.D)
2. scope - the rules for any given line of code, what data do I have available to me?
3. lexical/static scoping - the physical location of where I define my function determines what data it has access to.
4. dynamic scoping - the the physical location of a function's invocation determines what data it has access to.

## Practical Applications
1. Helper functions - like once and memoize
2. iterators and generators
3. Module pattern - preserve state for the life of the app without polluting the global namespace
4. Asynchronous JS - callbacks and promises rely on closures to persist data in an asynchronous env
