# JavaScript: The Hard Parts, v2
# Classes and Prototypes
___

## Introduction

Course Contents:
1. Principles of JavaScript
2. Callbacks and Higher Order Functions
3. Closure (scope and execution context)
4. Asynchronous JavaScript and the event loop
*5. Classes and Prototypes (OOP)*

Classes, Prototypes - Object Oriented JavaScript
1. An enormously popular paradigm for structuring our code
2. Prototype chain - the feature behind-the-scenes that enables emulation of OOP but is a compelling tool outright
3. Understand the difference between __proto__ and prototype
4. The `new` and `class` keywords as tools to automate our object and method creation

What's the `new` keyword doing under the hood? We're going to build it out from scratch.

Core of development (and running code)
1. Save data (e.g. in a quiz game the scores of user1 and user2)
2. Run code (functions) using that data (e.g. increase user2's score)

Easy! So why is development hard?

In a quiz game, I need to save lots of users but also admins, quiz questions, quiz outcomes, league tables -- all have data and associated functionality

In 100,000 lines of code
* Where is the functionality when I need it?
* How do I make sure the functionality is only used on the right data?

Solution 1: Generate objects using a function:

```
function userCreator(name, score) {
    const newUser = {};
    newUser.name = name;
    newUser.score = score;
    newUser.increment = function() {
        newUser.score++;
    }
    return newUser;
}

const user1 = userCreator('Will', 5);
const user2 = userCreator('Tim', 3);
user1.increment();

```

Not useable because we're creating an `increment` fn every time we create a new user

## Prototype Chain

Solution 2: Using the prototype chain
Store the increment function in just one object and have the interpreter, if it doesn't find the function on user1, look up to that object to check if it's there.

Link user1 and functionStore so that the interpreter, on not finding .increment, makes sure to check up in functionStore where it would find it.

Make the link with `Object.create()` technique.

```
function userCreator(name, score) {
    const newUser = Object.create(userFunctionStore);
    newUser.name = name;
    newUser.score = score;
    return newUser;
}

const userFunctionStore = {
    increment: function() {this.score++},
    login: function() {console.log('logged in')}
}

const user1 = userCreator('Will', 5);
const user2 = userCreator('Tim', 3);
user1.increment();

```

Object.create() with userFunctionStore passed into it does create an empty object, but there is a link between the empty object and userFunctionStore

Link is made with Object.create() with a hidden property called __proto__ and in here has a link to userFunctionStore

prototypal feature - JavaScript will look for a property in an object and when it does not find it, it will look in the __proto__ object, it will walk up the prototypal chain.

Objects have a connection to other objects if we set them to their __proto__ hidden property

## Prototype Chain Example: Implicit Parameters
The argument `Object.create()` accepts will always be assigned to the __proto__ property.

Implicit parameter (not written for me): `this`
`this` refers to the object of which the function is assigned

## hasOwnProperty method

What if we want to confirm our `user1` has the property `score`?

```
function userCreator(name, score) {
    const newUser = Object.create(userFunctionStore);
    newUser.name = name;
    newUser.score = score;
    return newUser;
}

const userFunctionStore = {
    increment: function() {this.score++},
    login: function() {console.log('logged in')}
}

const user1 = userCreator('Will', 5);
const user2 = userCreator('Tim', 3);
user1.hasOwnProperty('score');

```

Where is the `hasOwnProperty` method? There's a headline object called `Object.prototype`.

All objects have a default __proto__ object that defaults to `Object.prototype`, which has a number of functions, including `hasOwnProperty`.

`user1.hasOwnProperty('score')`
1. JS looks for `user1` object and finds it in global memory
2. JS looks for `hasOwnProperty`:
    * does not find it on the `user` object
    * does not find it on the __proto__ object of `user` (because that points to the store obj)
    * looks in the store object and does not find it.
    * finds it on the __proto__ object of the store object, because that references the base `Object.prototype`.
3. This is walking up the prototypal chain.

What if we want to confirm our user1 has the property score?
* We can use the `hasOwnProperty` method - but where is it? Is it on user1?
* All objects have a __proto__ property by default which defaults to linking to a big object - `Object.prototype` full of somewhat useful functions
* We get access to it via userFunctionStore's __proto__ property -- the chain

## this keyword

```
function userCreator(name, score) {
    const newUser = Object.create(userFunctionStore);
    newUser.name = name;
    newUser.score = score;
    return newUser;
}

const userFunctionStore = {
    increment: function() {
        function add() {
            this.score++
        }
        add();
    },
}

const user1 = userCreator('Will', 5);
const user2 = userCreator('Tim', 3);
user1.increment();
```
the `this` used in the `add` function is NOT referencing `user1`, but instead is referencing the global window object.
To get around this, can assign a variable to `this` outside of the function and reference that variable inside the function, or
manually call the function with `call` or `apply` passing `this` into it.

## Arrow Function Scope & this

New way of handling this, and that is using arrow functions
`this` assignment is lexically scoped


```
function userCreator(name, score) {
    const newUser = Object.create(userFunctionStore);
    newUser.name = name;
    newUser.score = score;
    return newUser;
}

const userFunctionStore = {
    increment: function() {
        const add = () => { this.score++; }
        add();
    },
}

const user1 = userCreator('Will', 5);
const user2 = userCreator('Tim', 3);
user1.increment();
```

## Prototype Chain Review
This is what the `new` keyword is doing behind the scenes.
`new` automates stuff for us:
* creates a new object for us automatically that contains the properties (name, score, etc.)
* will return that object out for us automatically
* makes the link for some object for functions for us
* sets the __proto__ property for us (userFunctionStore)
Where do we link off to?
What is the label of the object that has the properties?

Solutions 3: Introducing the `new` keyword that automates the hard work: `new`
When we call the function that returns an object with `new` in front we automate 2 things:
1. Create a new user object
2. Return the new user object
But now we need to adjust how we write the body of userCreator - how can we:
* refer to the auto-created object?
* Know where to put our single copies of functions?

Answer to 1:
* properties will be added to `this`
* instead of `newUser`, properties are on `this`

Where do all these shared functions be stored?

Now we do this:
```
function userCreator(name, score) {
    this.name = name;
    this.score = score;
}

userCreator.prototype // {};
userCreator.protottype.increment = function() {
    this.score++;
} 

```
Functions are also objects so they can store properties. Each function gets an object to store properties
Functions also have a property called `prototype` that's an empty object.
Shared functions are assigned to the `prototype` property of the function.

The `new` keyword links the __proto__ property to the `prototype` property of the function, which is where all of its functions will be stored.

## new keyword example
```
function userCreator(name, score) {
    this.name = name;
    this.score = score;
}

userCreator.prototype.login = function() {
    console.log('login')
}

userCreator.protottype.increment = function() {
    this.score++;
} 

const user1 = new userCreator('Eva', 9);
user1.increment();

```

What the new keyword does.
1. Creates an empty object and assigns it to `this`, i.e. this = {}
2. `this`'s __proto__ object will then be linked to `userCreator`'s prototype object.
    this.__proto__ = userCreator.prototype;
3. Name, and score arguments are assigned to this.name, this.score, etc.
4. return `this`.

## class keyword
Solution 3 - Introducting the `new` keyword that automates the hard work: `new`
Benefits:
* Faster to write. Often used in practice in professional code
Problems:
* 95% of developers have no idea how it works and therefore fail interviews
* We have to uppercase first letter of the function so we know it requires `new` to work!

Solution 4 - the class `syntatic sugar`
We're writing our shared methods separately from our object `constructor` itself (off in the userCreator.prototype object)

Other languages let us do this in one place, ES2015 lets us do so too.

syntatic sugar:

```
class UserCreator {
    constructor(name, score) {
        this.name = name;
        this.score = score;
    }
    increment() {
        this.score++;
    }
    login() {
        console.log('logged in');
    }
}

const user1 = new UserCreator('Eva', 9);
user1.increment();
```
constructor is the function part of the function + object combo

Solution 4 - the class `syntatic sugar`
Benefits:
* emerging as a new standard
* feels more like style of other languages, e.g. Python
Problems:
* 99% of developers have no idea how it works and fail interviews
* But you will not be one of them!

