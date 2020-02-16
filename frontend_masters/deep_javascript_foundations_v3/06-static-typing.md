# Deep JavaScript Foundations, v3
Kyle Simpson
___
## Static Typing

## TypeScript and Flow (and type-aware linting)
1. The team should be able to decide democratically on what to use, what works for them, rather than just picking what the rest of the world uses.
2. Team needs a *style guide* and developers should have a say on what works for the team.
3. "I'm glad TypeScript and Flow exist, even though I don't use them." - Kyle Simpson
    * Used to say that they solve problems I don't have.
    * "They are fixing the problem that in my opinion makes my code worse" - K.S.
    * "It is a problem if you're coding and you don't know your types, its just I have a different opinion on how to solve it." - K.S.
4. Benefits:
    * Catch type-related mistakes
    * Communicate type intent (typing is IN the code) / layer type annotations on the code
    * Provide IDE feedback through the tooling type inference, type analysis
5. Cavets
    * Inferencing is a best guess, not a guarantee, at compile-time.
    * Annotations are optional (TS defaults to the `any` type if you don't opt-in)
    * Can lead to a false sense of security
    * Any part of the application that isn't typed introduces uncertainty

## Inferencing

Example:
```
var teacher = "kyle"

teacher = { name: "Kyle" };
// Error: can't assign object to string
```
Some people think a big problem is accidentally assigning a variable with a different type than we thought.

For Kyle, he does this deliberately. He likes to be able to assign a variable with a different type later.

Can also explicitly assign a type annotation:
```
var teacher: string = "kyle"
```

## Custom Types

TypeScript & Flow allow for custom types

Again, a lot of these checks are for accidental mis-assignment of types

## Validating Operand Types

TS / Flow can tell us about certain operations can be invalid. For example:

```
var name : string = 'frank';
var count : number = 16 - name;
// Error: can't substract string
```


### TypeScript & Flow Summary
Good comparison between the two:
https://github.com/niieani/typescript-vs-flowtype

Kyle Simpson says that TypeScript seems to be a bit extreme for jumping to a solution to solve type mis-match problems, since it seems to be going against the grain of what JS is.

### TypeScript & Flow: Pros and Cons
Pros:
* Types are much more obvious
* Familiarity: they look like other language's type systems
* Extremely popular these days
* They're very sophisticated and good at what they do

Cons:
* Use "non-standard" syntax (or code comments) -- it's its own standard
    * Creates an ecosystem lock-in
* They require* a build process which raises the barrier to entry
* Their sophistication can be intimidating to those without prior formal types exp
    * The syntax explodes exponentially in complexity
    * Barrier to entry ramps up very very quickly
* They focus more on "static types" (variables, parameters, returns, properties) than *value types*
    * "I don't think that variables should have one type forever" - K.S.
    * JS is value-typing not variable typing, so it doesn't feel like how JS works.
    * "I don't think we need to *fix* JavaScript" - K.S.    

"Type-aware linting is indeed useful and important and TS / Flow are two ways of doing it, but not the only ways." - K.S.

## Understanding Your Types
* JavaScript has a (dynamic) type system, which uses various forms of coercion for value type conversion, including equality comparisons
* However, the prevaling response seems to be: avoid as much of this system as possible, and use === to "protect" from needing to worry about types
* Part of the problem with *avoidance* of whole swaths of JS, like pretending === saves you from needing to know types, is that it tends to  systemically perpetuate bugs
* You simply cannot write quality JS programs without knowing the types involved in your operations
* Alternatively, many choose to adopt a different "static types" system layered on top
* While certainly helpful in some respects, this is "avoidance" of a different sort
* My claim: the better approach is to embrace and learn JS's type system, and to adopt a coding style which makes types as obvious as possible
* By doing so, you will make your code more readable and more robust.

