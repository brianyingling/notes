# Deep JavaScript Foundations, v3
Kyle Simpson
___

# Objects

## Objects (Oriented)

* this
* class {}
* Prototypes
* "Inheritance vs Behavior Delegation" (OO vs OOLO)

## the `this` keyword

People are perpetually confused at the `this` keyword

"A function's `this` references the execution context for that call, determined entirely by *how the function was called*."

A `this`-aware function can thus have a different context each time it's called, which makes it more flexible and reusable.

`this` is JavaScript's way of having flexible, dynamic scope. 

```
function ask(question) {
    console.log(this.teacher, question);
}

function otherClass() {
    var myContext = {
        teacher: 'suzy'
    };
    ask.call(myContext, 'why'); // prints out 'suzy' because we're giving it the context in the myContext obj
}

otherClass();
```

## Implicit and Explicit Binding

4 different ways to invoke a function
1. implicit binding: functions attached to an object as a value that are invoked have a `this` that refers to the object to which the function belongs. 
`workshop.ask()` - workshop is an object and if `this` is inside `ask()`, `this` refers to the object labelled `workshop`
2. explicit binding: `call` function, the first argument takes the context that sets `this` inside of the function.
```
var workshop = {
    teacher: 'kyle',
    ask(question) {
        console.log(this.teacher, question)
    }
};

setTimeout(workshop.ask, 10, "lost this?");
// undefined lost this?
// this is NOT the call site; the call site would look like `cb()` or something like that
// it will not invoke workshop.ask in a workshop context

setTimeout(workshop.ask.bind(workshop), 10, 'hard bound this?');
// kyle hard bound this?
// solution to the above: pass in a hard-bound function: workshop.ask.bind(workshop)
// forces it to always use `workshop` as `this`
// produces a new function that's bound to `workshop`
```
3. the `new` keyword
* purpose of the `new` keyword is to invoke a function with a new empty object pointing to the `this` keyword
* `new` keyword does 4 things:
1. Create a brand new empty object
2. *Links that object to another object
3. Invokes the function with the `this` keyword pointed to the new object
4. If the function does not return an object, it assumes you meant to return `this`
* Will Sentance claims that the __proto__ object of the new obj set to `this` is now set to the function's prototype object.

seems like the `new` keyword is hijacking the function because it's doing all the work.

4. The default binding
* default to the global scope (in non-strict mode)
* when in strict mode, we get a TypeError
* in strict mode, the `this` keyword will be `undefined`, so invoking a function on `undefined` results in a TypeError.
* terrible way to default to the global binding
* The error would be invoking a function without giving it a context for `this`


My notes
4 Ways `this` can be set:
1. the default way: `this` is set to the global / window object (in non-strict mode)
2. the `new` keyword: `this` is set to a new object when the function is invoked
3. `this` references the object to which a function belongs as a value, e.g. `{ foo: function bar() {...} }`
4. setting it using `call`, `apply`, or `bind` functions


## Binding Precedence
```

var workshop = {
    teacher: 'kyle',
    ask: function ask(question) {
        console.log(this.teacher, question);
    }
};

new (workshop.ask.bind(workshop))("what does this do?");
// undefined what does this do?
```
What's the order of precedence?
1. is the function called by new? 
2. is the function called by call or apply or bind?
3. is the function called on a context object?
4. default: global object (except in strict mode)  

What about arrow functions?

`this` is not a hard-bound reference to the parent's function. This is NOT accurate.

the arrow function does not define the `this` keyword AT ALL.
There is no such thing as an arrow function in an arrow function.
If you put a `this` keyword inside of an arrow function, it's going to behave like any other variable. It's going to lexically resolve to some enclosing scope that does define the `this` keyword.
https://www.ecma-international.org/ecma-262/9.0/index.html#sec-arrow-function-definitions-runtime-semantics-evaluation

NOT allowed to call `new` on an arrow function because there is no `this` keyword in an arrow function. You will get a TypeError.


## Resolving `this` in Arrow Functions

```
var workshop = {
    teacher: 'kyle',
    ask: (question) => console.log(this.teacher, question)
}

workshop.ask('what happened to 'this?'')
// undefined what happened to this?

workshop.ask.call(workshop, 'still no this?');
// undefined still no this?

```
arrow functions DO NOT have a `this` and thus it resolves it lexically
Here there are two scopes: the scope of the arrow function, and the global scope. There is no intermediary scope.

"Only use => arrow functions when you need lexical `this`." - K.S.

## es6 class keyword

`class` keyword is ostensibly syntatic sugar on top of the prototype system

```
class Workshop {
    constructor(teacher) {
        this.teacher = teacher;
    }
    ask(question) {
        console.log(this.teacher, question);
    }
}

var deepJS = new Workshop('Kyle');
var reactJS = new Workshop('Suzy');

deepJS.ask("is 'class' a class?");
// 'kyle is 'class' a class?
reactJS.ask('is this class OK?');
// Suzy is 'class' a class?
```

use the `extends` keyword to extend a class and can add additional methods.

`super` keyword refers to the parent from the child

prior to es6 there was no way to handle relative polymorphism.

methods in a class that get passed into a setTimeout will lose its this binding 

assigning functions to the `this` object in a class creates a new function for every instance. It's NOT on the prototype and shared across all instances; every instance has its own copy of the function. This is inefficient.
If you end up doing this, don't use the class structure, just use the module pattern.
Class system can work for polymorphism and inheritance




