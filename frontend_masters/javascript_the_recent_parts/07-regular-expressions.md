# JavaScript the Recent Parts
Kyle Simpson
___

## Regular Expressions

## RegExp Improvements

Regular expressions were improved in es2018

Three key changes:
1. look behind
* look ahead - an assertion that matches when something immediately after it also matches
* look behind is the reverse, match an expression only if another condition is true right before it.

```
var msg = 'hello world';

msg.match(/(?<=e)(l.)/g);
// ['ll']

msg.match(/(?<!e)(l.)/g);
// ['lo','ld']

```

2. Named Capture Groups

3. dotall mode

Can now turn on unicode-awareness for regular expressions

