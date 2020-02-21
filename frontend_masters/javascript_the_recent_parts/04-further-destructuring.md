# JavaScript the Recent Parts
Kyle Simpson
___

# Further Destructuring
 
## Named Arguments 

```
function lookupRecord({
    store = 'person-records',
    id = -1
}) {
    //
}

lookupRecord({ id: 42});
```
Using an object is a way to use named arguments

You don't have to remember of the order of parameters because you have one parameter, the object, and can name it.


## Destructuring and Restructuring

