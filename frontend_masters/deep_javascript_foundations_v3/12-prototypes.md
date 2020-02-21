# Deep JavaScript Foundations, v3
Kyle Simpson
___

# Prototypes

Objects are built by "constructor calls" (via `new`);
using `new` makes a constructor call when placed in front of a function

"Class-orienting coding is fundamentally a copy operation." - K.S.

No one singular pattern for a class pattern

Mental model is when you are getting an instance of a class, you're getting a copy of that class as an instance.

"Inheritance is also a fundamentally a copy operation." - K.S.

A "constructor call" makes an object *linked to* its own prototype.

## Prototypal Class

```
function Workshop(teacher) {
    this.teacher = teacher;
}

Workshop.prototype.ask = function (question) {
    console.log(this.teacher, question);
}

var deepJS = new Workshop('kyle');
var reactJS = new Workshop('suzy');

deepJS.ask('Is prototype a class?');
// kyle Is prototype a class?

reactJS.ask('Isn\'t prototype ugly?');
// suzy Isn't prototype ugly?
```
This is the old-school way of doing a prototypal class.

Copying is a bad mental model, so we need a new mental modal to understand how it works.

## The Prototype Chain

Line 0: When JS engine starts
Object: a function that exists, also serves as a namespace with other functions (Object.keys, etc)
Object points to the prototype object (Object.prototype)
Object.prototype has many functions, like toString, etc.
Link from Object.prototype to Object and its called "constructor"
* this is misleading because we are not dealing with a class system

Line 1: function Workshop()
Another object has been created at line 1 but it isn't obvious
This object is called `prototype` (`Workshop.prototype`)
Link from Workshop function to `Workshop.prototype`
Link from `Workshop.prototype` to Workshop function (called constructor)

Line 4: `Workshop.prototype.ask`
Creates an ask property on the `Workshop.prototype` object and assigns it the function

Line 8: 4 things when the `new` is called
1. Creates an empty object out of thin air
2. Links that object to another object (the function's Workshop.prototype object)
3. Invokes the function that it is in front of, pointing the `this` keyword to that empty object
    * parameters of the function can get assigned to the `this` object (`this.teacher = teacher`)
4. The new object linked to `this` gets returned if the function does not have a return value.
    * Here, that this / newly-created-object gets assigned to `deepJS`.

The prototype chain has a reference to the ask function, these are shared amongst all invocations of `Workshop`. The instance does not have its own copy of the instance.

If the object does not have a method, JS will check its prototype. If that object does not have a method, it will check that object's prototype object and traverse up the prototype chain until it finds it.

"Maybe...this system is much more powerful than the class system and shouldn't be solely viewed through the lens of traditional class-based systems like Java, C++, C#." - K.S.

## Dunder Prototypes

```
function Workshop(teacher) {
    this.teacher = teacher;
}

Workshop.prototype.ask = function(question {
    console.log(this.teacher, question);
}

var deepJS = new Workshop('kyle');

deepJS.constructor === Workshop;

deepJS.__proto__ === Workshop.prototype; // true

Object.getPrototypeOf(deepJS) === Workshop.prototype;  // true

```

There is no constructor property on deepJS, but it looks in the Workshop.prototype chain and that does have a constructor property. That points to Workshop function.

dunderproto refers to __proto__ because this is hard to say.

deepJS has a property on it that points to the thing that it's linked to.

When created, deepJS has a __proto__ object that refers to Workshop.prototype which then points to Object.prototype.

## this and prototypes Q&A

Can you set a __proto__?

Yes, you can, but rarely do you need to. 

There's a function for this: `Object.setPrototypeOf()`
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf

Regular functions have a Object.prototype, arrow functions DO NOT (though they have a __proto__);

`const foo = () => console.log('foo');`
`foo.prototype` // undefined

`function foo() {}`;
`foo.prototype` // returns an object, of which that object has a __proto__ object that links to Foo.prototype;

Cannot call `new` on an arrow function, it will throw a TypeError, *functionname* is not a constructor

## Shadowing Prototypes

```
function Workshop(teacher) {
    this.teacher = teacher;
}

Workshop.prototype.ask = function(question) {
    console.log(this.teacher, question);
}

var deepJS = new Workshop('kyle');

deepJS.ask = function(question) {
    // taking deepJS and invoking ask()
    this.ask(question.toUpperCase());
    // do this instead
    this.__proto__.ask.call(this.question.toUpperCase()); // refers to Workshop.prototype;
}

// this will fail because `this` is referring to deepJS because of the implicit binding
deepJS.ask('Oops, is this infinite recursion?');

```

This isn't real relative polymorphism.

Here we're trying to extend the parent class's ask method but the chain can be easily problematic because of the hard linkages between __proto__ and it's function.prototype.

## Prototypal inheritance

```
function Workshop(teacher) {
    this.teacher = teacher;
}

Workshop.prototype.ask = function(question) {
    console.log(this.teacher, question);
}

function AnotherWorkshop(teacher) {
    Workshop.call(this, teacher);
}

AnotherWorkshop.prototype = Object.create(Workshop.prototype);

AnotherWorkshop.prototype.speakUp = function(msg) {
    this.ask(msg.toUpperCase());
}

var JSRecentParts = new AnotherWorkshop('kyle');
JSRecentParts.speakUp('Is this actually inheritance?');
// Kyle Is this actually inheritance?

```

Object.create does 2 things:
1. creates a brand new empty object.
2. Links that object to another object.

No matter how far you go up the prototype chain, the `this` binding is still controlled at the call site.

This line is how we create the linkage:
`AnotherWorkshop.prototype = Object.create(Workshop.prototype);`

## Classical vs Prototypal Inheritance

Classical Inheritance - creating an instance from a class is making a copy as an instance.

Prototypal Inheritance - not making copies, making links, NOT copies.

## Inheritance is Delegation

This is a different pattern, it's called behavior DELEGATION!

It's a delegation system, not a class system

## OLOO Pattern

Objects Linked to Other Objects

```
var Workshop = {
    setTeacher(teacher) {
        this.teacher = teacher;
    },
    ask(question) {
        console.log(this.teacher, question)
    }
};

var AnotherWorkshop = Object.assign(
    Object.create(Workshop), 
    {
        speakUp(msg) {
            this.ask(msg.toUpperCase());
        }
    }
);

var JSRecentParts = Object.create(AnotherWorkshop);
JSRecentParts.setTeacher('kyle');
JSRecentParts.speakUp('But isn\'t this cleaner?');
// kyle But isnt this cleaner?
```

## Delegation-oriented Design

Think peer-to-peer rather than parent-child relationships


```




