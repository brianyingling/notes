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
