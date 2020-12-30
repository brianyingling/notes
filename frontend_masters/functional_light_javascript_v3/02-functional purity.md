# Functional Light JavaScript v3
Kyle Simpson
___

## Functional Purity

### Functions v Procedures

Functional programming is much more than the `function` keyword.

procedure - collection of operations in a program

A function has to take in some input and return some output.
    * Functions without return statements aren't functions
    * Functions can only call other functions (if it calls a procedure, it is not a function)

Spirit of functional programming:
f(x) = 2x^2 + 3
* A function is a semantic relationship between an input and a computed output
`const f = x => 2 * Math.pow(x,2) + 3;`
// parabola


### Side Effects
* For to be a function, there are not to have side effects:
* For functions, Inputs and outputs have to be direct (passed in as arguments and returned) and it can't access anything / modify anything outside of itself
