# JavaScript: The Hard Parts, v2
# Asynchronous JavaScript
___

## Promises, Async and the Event Loop
1. Promises - the most significant ES6 feature
2. Asynchronicity - the feature that makes dynamic web applications possible
3. The event loop - Javascript's triage
4. Microtask queue, Callback queue, and Web browser features (APIs)

article on microtask queues: https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/

A reminder on how Javascript executes code

```
const num = 3;
function multiplyBy2(inputNumber) {
    const result = inputNumber * 2;
    return result;
}

const output = multiplyBy2(num);
const newOutput = multiplyBy2(10);

```

## Asynchronicity in JavaScript

Asynchronicity is the backbone of modern web development in Javascript yet...
JavaScript is
1. Single threaded (executes one line at a time)
2. Synchronously executed (each line is run in order it appears)

So what if we have a task:
1. Accessing Twitter's server to get new tweets that takes a long time
2. Code we want to run using those tweets

*Challenge:* We want to wait for the tweets to be stored in tweets so that they're there to run displayTweets on -- but no code can run in the meantime.

Slow function blocks further code running
```
const tweets = getTweets('http://twitter.com/will/1);
displayTweets();
console.log('I want to run...');
```

JavaScript is not enough - we need new pieces (some of which aren't JavaScript at all)
Our core JavaScript engine has 3 main parts:
1. Thread of execution
2. Memory/variable environment
3. Call stack

We need to add some new components
1. Web browser APIs/Node background APIs
2. Promises
3. Event loop, Callback/Task queue and microtask queue

ES5 solution: Introducing "callback functions" and Web Browser APIs

```
function printHello() {
    console.log('hello');
}

setTimeout(printHello, 1000);
console.log('Me first!');
```
1. "Me first" prints first, then "hello"

Things the Web Browser has that JavaScript does not have:
1. Dev Tools / console - (console)
2. Sockets
3. Network requests - (fetch/xhr)
4. Rendering / HTML DOM (document)
5. Timer (setTimeout)
6. local storage (localStorage)

JavaScript has "facade functions" - functions that look like JS, but are facades for interacting with browser features

## Web API example

```
function printHello() {
    console.log('hello');
}

setTimeout(printHello, 1000);
console.log('Me first!');
```
Steps:
1. We declare a function called `printHello`
2. We invoke a function called `setTimeout` and pass in the `printHello` function and 1000 milliseconds as parameters
3. `setTimeout` is a label for the timer functionality in the browser (this is NOT javascript). It's going to take 1000 milliseconds. On completion, `printHello` will run
4. JavaScript facade function is done, interpreter moves on to the next line
5. Once the 1000 milliseconds is complete, `printHello` is pushed on to the callstack and invoked.

## Web API Rules

We're interacting with a world outside of JavaScript now - so we need rules
```
function printHello() {
    console.log('hello');
}
function blockFor1Sec() {...}
setTimeout(printHello, 0);
blockFor1Sec();
console.log('me first');
```

## Callback Queue and Event Loop
1. callback queue - once browser api is complete, the callback function is enqueued on the callback queue ready to be run
2. blockFor1Sec() is invoked after the setTimeout() is invoked, even though the printHello function is awaiting on the callback queue
3. Once the callstack is empty and the global execution context is done, printHello will be pushed on the call stack and invoked
4. This allows us to be certain when our code will be run out of the queue
5. All regular code will run first before anything in the queue will run
6. Event loop regularly checks to see whether the callstack is empty before pushing anything on the callstack

## ES3 Web Browser APIs with Callback Functions
Problems:
1. Our response data is only available in the callback function - creates "callback hell"
2. Maybe it feels a little odd to think of passing a function into another function only for it to run much later

Benefits:
1. Super explicit once you understand how it works under the hood