# JavaScript: The Hard Parts, v2
# Promises
___

## Introduction

ES6+ Solution (Promises)

Using two-pronged 'facade' functions that both:
1. Initiate background web browser work and:
2. Return a placeholder object (Promise) immediately in JavaScript

A promise does set up a network request in the Web Browser, but it has a consequence in JS as well
A promise object sits in memory and when its done, it fills its data in it
A promise is a placeholder object for the data we requested, stored in memory

```
function display(data) {
    console.log(data);
}

const futureData = fetch('https://twitter.com/will/tweets');
futureData.then(display);
console.log('me first');
```

With fetch, the Browser (NOT javascript) is using a whole sort of technologies to fetch data over the internet and return it in a JS object, a Promise

1. `fetch` immediately returns the special JS object called a Promise with two properties:
    * value, onFulfilled
    * This Promise object is assigned to the constant futureData
2. `fetch` uses the Web Browser API to make a network request
    * it is NOT complete at 0 ms
    * once the API response is received, it is saved in the `value` property of the Promise object

## Promises Example: then
1. Any function saved in the array assigned to `onFulfilled` is auto-invoked when the data comes back
2. Can't get direct access to `onFulfilled`, it is a hidden property
3. Then method is responsible for assigning the function passed into it to the `onFulfilled` array
4. Method then is invoked with the `value` property passed into it.

## Web APIs and Promises Example: fetch

### *then* method and functionality to call on completion
1. Any code we want to run on the returned data must also be saved on the promise object
2. Added using `.then` method to the hidden property `onFulfillment`
3. Promise objects will automatically trigger the attached function to run (with its input being the returned data)

asynchronous - doing code out of order from when you saw it. :-)

```
function display(data) { console.log(data)}
function printHello() {console.log('hello')}
function blockFor300ms() {}
setTimeout(printHello, 0);
const futureData = fetch('http://twitter.com/will/tweets);
futureData.then(display);
blockFor300ms();
console.log('Me first!');
```
1. we declare a function called display with a paramter called data
2. we declara a function called printHello with no parameters
3. we declare a function called blockFor300ms with the purpose of blocking for 300ms when invoked
4. we invoke the setTimeout function, which acts as a label for the timer function in C++ passing to it the printHello function and the duration parameter of 0ms
5. The timer C++ function in the Web Browser API waits 0ms and then enqueues `printHello` function on the callback queue
6. We declare a const called `futureData` and on the right-hand side we call fetch (uses the Network Request feature in the Browser) to the twitter api, passing into it the domain name and the path
7. `futureData` is assigned a Promise object
8. `value` and `onFulfilled` (an array of functions, right now its empty) is the contents of the Promise object in futureData.
9. The response from the Twitter api is then assigned to the `value` property in the Promise
10. The assignment of `value` will then trigger all functions in the `onFulfilled` array

## Web APIs and Promises Example: then
(continued from above)
11. then function pushes a function passed into it in the `onFulfilled` array
12. Functions in the `onFulfilled` array get invoked when the `value` property changes
13. We then run `blockFor300ms` function

## Web APIs and Promises Example: Microtask Queue
14. Output, in order:
    * "Me first!"
    * data from display()
    * "hello"
15. There's an additional queue -- the Microtask queue, that takes priority
    * two queues: Task queue and Microtask queue
    * display is IN the Microtask queue
    * microtask queue takes priority over the task queue
16. Callback queue then dequeues `printHello` from it and pushed on the callstack and invokes
17. Functions that are assigned to the `onFulfilled` array of a promise by use of the `then` function do NOT get enqueued on the callback queue; they get enqueued on the Microtask queue, which takes priority over the callback queue
18. `Value` isn't actually filled until all global code is executed in run, then `onFulfilled` functions get called
19. The Event Loop will ALWAYS check the Microtask queue over the Callback queue, so if functions are continuously filling the Microtask queue, the callback queue will never run.
20. In Node, the `process.nextTick` manually sticks things in the Microtask queue and can possibly starve the callback queue

What items go in the Microtask queue and go in the callback queue?
1. Any functions attached to a Promise object go in the Microtask queue
2. Any function passed into a facade function goes into the callback queue

## Promises Review

Problems:
1. 99% of developers have no idea how they're working under the hood
2. Debugging becomes super hard as a result
3. Developers fail technical questions
Benefits:
1. Cleaner readable style with pseudo-synchronous code
2. Nice error handling process

`onRejection` property on Promise -- also an array
`catch` function takes in a function that gets pushed on `onRejection`

We now have rules for the execution of our asynchronously-delayed code
1. Hold promise-deferred functions in a microtask queue and callback functions in a task queue when the Web Browser Feature (API) finishes
2. Add the function to the call stack (i.e. run the function) when
    * Call stack is empty and all global code run (event loop checks this condition)    
3. Prioritize functions in the microtask queue over the callback queue

Promises, WebAPIs, the Callback and Microtask Queues and Event Loop enable:
* *non-blocking applications* - This means we don't have to wait in the single thread and don't block further code from running
* *however long it takes* - We cannot predict when our Browser feature's work will finish so we let JS handle automatically running the function on its completion
* *web applications* - Asynchronous JavaScript is the backbone of the modern web - letting us build fast "non-blocking" applications









