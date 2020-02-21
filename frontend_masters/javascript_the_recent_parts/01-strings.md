# JavaScript the Recent Parts
Kyle Simpson
___

# Strings

## Template Strings ( Interpolated literals)

Solving the issue here:
```
var name = 'kyle'
var email = 'kyle@kyle.com';

var message = "email is " + email + " and name is " + name;
```
Concatenating strings and data values can get messy.

The official term for this is "interpolation"

Use the backtick operator `\`` for template strings

```
var name = 'kyle'
var email = 'kyle@kyle.com';

var message = `email is ${email} and name is ${name}`;
```
Inside the `${}` can be any expression, doesn't have to be just a variable.

template literals are immediately constructed as strings and assigned.

Can break across a line without using a backslash. 

## Tagged Templates

```
var amount = 12.3;

var msg = formatCurrency`The total is ${amount}`;

```

Before it finishes, I want to be processed with this function.

This is a special kind of function call called a tagged template string.

```
function formatCurrency(strings, ...values) {
    var str = '';
    for (let i = 0; i < strings.length; i++) {
        if (i > 0) {
            if (typeof values[i-1] == "number") {
                str += `$${values[i-1].toFixed(2)}`;
            } else {
                str += values[i-1];
            }
        }
        str += strings[i]
    }
    return str;
}

```

`strings` is an array of pieces of the string, e.g. ["The total is", ""]
`values` is an array of values passed in, e.g. [12.3]

It's up to the function to put them together.

Tagged functions are a way to pre-process your strings.

## Applying Tagged Templates

K.S. wrote a custom console.log that will print out error stack traces as well as the js object instead of [Object object]

Turns out a tagged function does not even need to return a string. One use case returns a formatted regular expression.

## Padding and Trimming

```
var str = 'hello';

str.padStart(5);    // 'hello';
str.padStart(8);    // '   hello';
str.padStart(8, "*")// '***hello';
str.padStart(8, "12345") // "123hello";
str.padStatt(8, "ab") // "abahello";

```
padEnd is the same, except this happens at the right

```
var str = " some stuff ";
str.trim() // "some stuff";
str.trimStart() "some stuff ";
str.trimEnd() " some stuff";
```


