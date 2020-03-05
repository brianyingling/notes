// destructuring

//  imperative approach
function data() {
    return [1,2,3,4,5];
}

var tmp = data();
var first = tmp[0];
var second = tmp[1] !== undefined ? tmp[1] : 10;
var third = tmp[2];
var fourth = tmp.slice(3); // [4,5]

// declarative / destructuring approach

// pattern
var tmp;
var [
    one,
    two = 10, // default value expression
    three,
    ...fourth // "gathers" everything else, rest operator, if it doesn't match it returns an empty array, has to show up at the end, it's gathering the rest
] = tmp = data();
// tmp here is a reference of the whole data returned from data(), same as above
// data() is assigned to tmp then destructure from tmp.
// destructuring is about the assignment, NOT about the variable declaration so those variables could have been defined beforehand.

// comma separation

//  what if I didn't care about position 2?
//  can have empty positions, nothing in between the commas

/*
var [
    first,
    , // I don't want a reference to the second value
    third,
    fourth
]
*/

//swapping

var x = 10;
var y = 20;

// old school way
{
    let tmp = x;
    x = y;
    y = tmp;
}

// new way
[y, x] = [x, y]

// parameter arrays

function data(tmp) {
    var [
        first,
        second,
        third
    ] = tmp
}

// can break these down in parameters
function data([
    first,
    second,
    third
]) {
    // ...
}

