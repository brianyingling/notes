# Deep JavaScript Foundations, v3
Kyle Simpson
___

## Equality

## Double and Triple Equals

The big problems people seem to have are not around concatenation versus adding, or around less than or greater than, it's equality checking (== vs ===)

Spec for Abstract Equality Comparison:
https://www.ecma-international.org/ecma-262/9.0/index.html#sec-strict-equality-comparison

```
7.2.14 Abstract Equality Comparison
The comparison x == y, where x and y are values, produces true or false. Such a comparison is performed as follows:

If Type(x) is the same as Type(y), then
Return the result of performing Strict Equality Comparison x === y.
If x is null and y is undefined, return true.
If x is undefined and y is null, return true.
If Type(x) is Number and Type(y) is String, return the result of the comparison x == ! ToNumber(y).
If Type(x) is String and Type(y) is Number, return the result of the comparison ! ToNumber(x) == y.
If Type(x) is Boolean, return the result of the comparison ! ToNumber(x) == y.
If Type(y) is Boolean, return the result of the comparison x == ! ToNumber(y).
If Type(x) is either String, Number, or Symbol and Type(y) is Object, return the result of the comparison x == ToPrimitive(y).
If Type(x) is Object and Type(y) is either String, Number, or Symbol, return the result of the comparison ToPrimitive(x) == y.
Return false.
```
In the == comparison, when the types match, JS actually uses ===

```
7.2.15Strict Equality Comparison
The comparison x === y, where x and y are values, produces true or false. Such a comparison is performed as follows:

If Type(x) is different from Type(y), return false.
If Type(x) is Number, then
If x is NaN, return false.
If y is NaN, return false.
If x is the same Number value as y, return true.
If x is +0 and y is -0, return true.
If x is -0 and y is +0, return true.
Return false.
Return SameValueNonNumber(x, y).
NOTE
This algorithm differs from the SameValue Algorithm in its treatment of signed zeroes and NaNs.
```
The difference between abstract and strict equality is whether or not we're going to allow any coercion to occur.

== is going to allow coercion when the types are different
=== is going to dissallow coercion when the types are the same

## Coercive Equality

"Like every other operation, is coercion helpful in an equality comparison or not". - Kyle Simpson

Can treat `null` and `undefined` as indistinguishable from each other when compared (null == undefined returns true)

Most seem to be okay with using double equals null checks because there isn't really a benefit to checking for both null and undefined

Linting rules do not check whether your code is right, it checks whether your code matches the opinions you gave it to check against.

"Let a team decide what is effective for them." - Kyle Simpson

## Double Equals Algorithm
if One of the values has a type of number and the other is a string, call toNumber() on the string
Remember this: double equals prefers numeric comparison

Structure your code so that coercion is useful, rather than this magical unknown thing.

Coercion is not going to be invoked if both types in the double equals comparison are the same.

If you invoke the double equals with a type that is not a primitive (object, array, etc), we invoke the toPrimitve() on it.

The algorithm with recursively run into we get the types down to two primitives that can be coercively equal to each other. If we never get there, return false.

## Double Equals Walkthrough

```
var workshop1Count = 42;
var workshop2Count = [42];

if (workshop1Count == workshop2Count) {
    // Yep, hmm...
}

```
1. Why does this work?
2. toPrimitive() is called on [42], which calls toString, which turns it into "42"
3. "42" == 42
4. Two different types
5. "42" becomes the number 42
6. Calls === because now the types are the same.
7. Coercion here is a very bad example here because we're comparing array with number
8. The fix here is NOT to use triple equals, the real fix here is that you're making a terrible comparison in the first place.

## Double Equals Summary

Summary of the Algorithm:
1. If the types are the same: ===
2. If both of them are `null` or `undefined`: equal
3. If non-primitives: toPrimitive
4. Prefer: toNumber when have primitives

== Corner Cases
1. [] == ![];       // true: what?
    * false comparison: you would never compare a value with the negation of itself.
    * Under what circumstances would you have an array and compare the negation of that array?
    ```
    var workshop1Students = [];
    var workshop2Students = [];
    if (workshop1Students == !workshop2Students) {
        if ([] == false) // array negation becomes false, 
        if ("" == false) // nonprimitive compareed to primitive, array now empty string
        if (0 == false)  // two primitives but not at the same type, prefer numbers, empty string becomes 0, false becomes 0
        if (0 == 0)
        if (true)       
    }

## Corner Cases: Boolean
```
var workshopStudents = [];
// if (Boolean(workshopStudents)) // true
if (workshopStudents) {
    // yep
}
// if (workshopStudents == true)
// if ("" == true) // not the same type, so they become numbers
// if (0 == 1)
if (workshopStudents == true) {
    // nope
    // this wouldn't work with === either.

}
// if (workshopStudents == false)
// if ("" == false) // not the same type, so they become numbers
// if (0 == 0) becomes true
if (workshopStudents == false) {
    // yep
}

```
Boolean coercion 
This is a gotcha, but never do a double equals with a true or false
Nonsensical outcome with a nonsensical construct

## Corner Cases: Summary
Avoid: don't use double-equals here
1. == with 0 or "" (or even " ") 
2. == with non-primitives (only use it for coercion among primitives)
3. == true or == false: allow toBoolean or use ===

## The Case for Double Equals
"You should prefer double equals in all possible places." - Kyle Simpson
"Knowing types is always better than not knowing them."
"Static types is not the only (or even necessarily best ) way to know your types."
"== is not about comparisons with unknown types" Only use double-equals when you DO know the types, not when you DON'T.
You should strive to know the types in your code
== is about comparisons with known types, optionally where conversations are helpful
If you know the types in a comparison:
* If both types are the same, == is identical to ===
* Using === is unnecessary, so prefer the shorter ==
* Since === is pointless when the types don't match, it is similarly unnecessary when they do match.
* TypeScript will throw an error when using === when the types don't match
* if you *know* the types in a comparison:
    * If the types are different, using one === would be broken
    * Prefer the *more powerful* == or don't compare at all
    * If the types are different, the equivalent of one == would be two (or more!) === (ie "slower")
    * Prefer the faster single ==
    * if the types are different, two or more === comparisons may distract the reader
    * Whether the types match or not, == is the more sensible choice
    * These are the claims IF YOU KNOW THE TYPES
* if you *don't know* the types in a comparison:
    * Not knowing the types means not fully understanding the code
    * Not knowing the types should be a rarity rather than the status quo
    * Best to refactor the code to understand the types
    * The uncertainty of not knowing types should be obvious to the reader
    * The *most obvious* signal is === -- it signals to the reader, I don't know the types, I'm trying to protect myself
    * Not knowing the types is equivalent to assuming type conversion
    * Because of corner cases, the only *safe* choice is ===
    * Summary: if you *can't or won't* use known and obvious types, === is the only *reasonable* choice
    * Even if === would always be equivalent to == in your code, using it *everywhere* sends a wrong semantic signal: "Protecting myself since I don't know or trust the types"
* Summary
    * Making types known and obvious leads to better code.
    * If types are known, == is best.
    * Otherwise, fall back to ===.

## Equality Exercise Solution
Just view the video.
* Takeway: coercion can be safe when you eliminate the corner cases & made it obvious that the corner cases are eliminated.
* Instead of being fancy, sometimes a little bit of duplication, a little bit of explicitness makes the code more obvious and readable.





