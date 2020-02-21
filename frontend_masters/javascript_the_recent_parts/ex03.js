function data() {
    return { a: 1, b: 2, c: 3, d: 4}
}

var tmp = data();
var first = tmp.a;
var second = tmp.b;
var third = tmp.c;

var {
    a: first = 42,
    b: second,
    c: third,
    ...third // collects the rest of the key-value pairs into an object called third
    // source : target = default
} = data();

// need to assign the property to a variable


object literal 

var o = {
    prop: value,
    target: source
}

var {
    prop: value, // property serves the role of source
    source: target
} = o;

//why did they flip it?
