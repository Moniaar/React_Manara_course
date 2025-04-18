# Frontend Engineering with React
This repository holds everything I am learning with Manara courses, specfically the Frontend Engineering with React Course notes.

## Intresting things about JS
1. First version of JS was named MOCHA and it was very basic Java and had a special syntax, with some of recent JS features like: first class functions & dynamic typing and prototype inheritance.
2. The next version got named "LiveScript" and then few months later back in Dec-1995 it was named Java Script.
3. JSON Was created by someone called Douglas Crockford back in 2003.
4. Ryan Dahl created Node.js back in 2009.

### Differnces between JS and Node.js?
- Js is a programming language used to make your pages more dynamic, whereas Node.js is a runtime environment for JS to run outside the browser:
  So when you type the word "node" in your terminal and excute JS things, node.js is what gives you that ability whereas JS can be executed using the developer tools console in your web browser.
### How to exit the console?
Type: ```.exit```

## The CSS editor in your developer tools thing
![css_inspector](https://github.com/user-attachments/assets/b0565acc-e495-44d4-8696-63b32e7439ae)

The rules applied to the current element are shown in order of most-to-least-specific.
Click the checkboxes next to each declaration to see what would happen if you removed the declaration.
Click the little arrow next to each shorthand property to show the property's longhand equivalents.
Click a property name or value to bring up a text box, where you can key in a new value to get a live preview of a style change.
Next to each rule is the file name and line number the rule is defined in. Clicking that rule causes the dev tools to jump to show it in its own view, where it can generally be edited and saved.
You can also click the closing curly brace of any rule to bring up a text box on a new line, where you can write a completely new declaration for your page.

## Conditions in JS:
1. You can use { } to include the codes or not inside the ifs, however it's recommanded you use them.
2. A single execution of the loop body is called an iteration.
3. Curly braces are not required for a single-line body.
4. What is “inline” variable declaration?: it is variables that are visible only inside the loop.
5. You can do this in JS:
```
let i = 0;

for (; i < 3;) {
  alert( i++ );
}
```
6. You can use breaks in JS too.
7. Continue: It doesn’t stop the whole loop. Instead, it stops the current iteration and forces the loop to start a new one (if the condition allows).
8. ``` (i > 5) ? alert(i) : continue; ``` : continue isn't allowed here.
9. Labels: A label is an identifier with a colon before a loop:
```
labelName: for (...) {
  ...
}
```
The break <labelName> statement in the loop below breaks out to the label:
```
outer: for (let i = 0; i < 3; i++) {

  for (let j = 0; j < 3; j++) {

    let input = prompt(`Value at coords (${i},${j})`, '');

    // if an empty string or canceled, then break out of both loops
    if (!input) break outer; // (*)

    // do something with the value...
  }
}

alert('Done!');
```
But keep in mind Labels do not allow to “jump” anywhere.

10. Break/continue support labels before the loop. A label is the only way for break/continue to escape a nested loop to go to an outer one.
11. Some algorithms cannot be simple iterative loops. For example, getting all the nodes of a tree structure (such as the DOM) is easier via recursion.

## Functions:
1. When you pass an object as a parameter, if the function changes the object's properties, that change is visible outside the function. Same rule applies to Arrays.
2. Function declarations and expressions can be nested, which forms a scope chain:
  ```
function addSquares(a, b) {
  function square(x) {
    return x * x;
  }
  return square(a) + square(b);
}
```
4. Providing a name allows the function to refer to itself, and also makes it easier to identify the function in a debugger's stack traces.
  ```
const factorial = function fac(n) {
  return n < 2 ? 1 : n * fac(n - 1);
};

console.log(factorial(3)); // 6
```
6. In JavaScript, a function can be defined based on a condition.
7. You can also use the Function constructor to create functions from a string at runtime, much like eval().
8. A method is a function that is a property of an object.
9. It turns out that functions are themselves objects — and in turn, these objects have methods, The call() and apply() methods can be used to achieve this goal.
10. In JS it doesn't matter where you add the function declaration, the interpreter will always put those at top level of the code, and this is what we call function Hoisting.
11. Function hoisting only works with function declarations — not with function expressions.
12. It is possible to convert any recursive algorithm to a non-recursive one, but the logic is often much more complex, and doing so requires the use of a stack.

### Mini Notes
- Every variable you can use in JS is stored inside an object named ```window```. In the browser console you can access that but in the terminal you have to type the word: ```global``` 😃
- What does ```nvm``` stands for?
  Node Version Manager because it makes it easy to change Node versions and upgrade Node, while ```npm``` is used to install the various libraries and tools used in JavaScript environments.
