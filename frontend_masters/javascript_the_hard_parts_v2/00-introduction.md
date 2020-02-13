
JavaScript: The Hard Parts, v2

# Introduction

## 5 Big Topics
1. Underlying JS Principles
2. Higher Order Functions and Callbacks
3. Closures
4. Classes and Prototypes (OOP)
5. Asynchronously


# JavaScript Principless

## Thread of Execution
1. When JS code runs, it:
    * Goes through it line by line and executes it (known as the thread of execution)
    * Saves data like strings and arrays in memory so that they can be later used

## Functions
1. *execution context*, - created to run a function and requires two parts: the thread of execution that executes each line, and the store of data to retrieve and save data. 
2. Global execution context is run at the start of the program, the highest level execution context. Once we are in a function, we enter another execution context

## Call Stack
1. Call Stack - used to keep track of what is currently running
    * Run a function - add it to the call stack
    * Whatever is on top of the call stack, that is the function we are currently running.
    * Finish running the function - remove it from the call stack
    * Global is always at the bottom of the call stack
