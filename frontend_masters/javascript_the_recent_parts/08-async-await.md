# JavaScript the Recent Parts
Kyle Simpson
___

## Async Await

Promises are a away of representing a future value in a time-independent way

```
fetchCurrentUser()
.then(function onUser(user) {
    return Promise.all([
        fetchArchivedOrders(user.id),
        fetchCurrentOrders(user.id)
    ]);
})
.then(function onOrders([archivedOrders, currentOrders]) {
    //..
});

```

promise chains are yucky
K.S. We shouldn't be using promise chains, use async functions

async function - locally pauses while the promise finishes resolving, then gives the value back

Shipped in es2017

## Async Iteration
`await` keyword can only be used inside an async function

Need an asynchronous eager iterator, which is lacking in JS.

Some issues with async/await
* *await* only knows what to do with thenables and promises
* Scheduling (Starvation)
    * microtask queue - when promises need to resolve an asynchronous operation, they add them to the microtask queue, which cuts to the front of the line. So a recurring promise getting resolved can hog the resources and starve the event loop. Can accidentally add an event loop
    * They naively implemented a scheduling mechanism for promises that is susceptible to starvation.
* External Cancellation - async functions / promises cannot be canceled. Once they start, can't cancel them.
    * Hey async function, I know you're in the middle of downloading a bunch of stuff, but just cancel this -- CAN'T DO THIS
    * Will continue to spin on the microtask queue and consume resources, can possibly starve the event loop

K.S. uses generators to get around these functions


## Async Generators With Yield
es2018 - async* generators, both an async function and a generator in one function!

## Async Generation Iteration
```
for await(let x of y) {
// ...
}
```
