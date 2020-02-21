# JavaScript the Recent Parts
Kyle Simpson
___

# Array Destructuring

Destructuring - decomposing a structure into its individual parts.

```
var tmp = getSomeRecords();

var first = tmp[0];
var second = tmp[1];

var firstname = first.name;
var firstEmail = first.email !== undefined ? first.email : "nobody@none.tld";
var secondName = second.name;
var secondmeail = second.email !== undefined ? second.email : "nobody@none.tld";

```

This logic using destructuring

```
var [
    {
        name: firstName, // go make me a value called `firstName` that is in this location in the value returned from the fn
        email: firstEmail = "nobody@none.tld"; // assign a default value if there is not one on `email`
    },
    {
        name: secondName,
        email: secondEmail = "nobody@none.tld";
    }
] = getSomeRecords();


// use firstName, firstEmail, secondName, secondEmail variables down here...

```

This is pattern matching from the result of `getSomeRecords()`

It is a syntax describing what's expected from the `getSomeRecords()` call.

The pattern does not have to take into account the entire value, just the values / sections you care about.

This code is also self-documenting

## Refactoring Code using Destructuring

