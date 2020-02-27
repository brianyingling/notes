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