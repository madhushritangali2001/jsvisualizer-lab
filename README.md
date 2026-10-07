# Data Type Playground

Create an attractive, highly interactive educational website called “JavaScript Data Types Explorer” for teaching JavaScript data types to 1st-semester B.E. CSE students who are beginners.

The website should feel like a modern interactive learning game, not a boring documentation website.

Main Goal

Help students visually understand JavaScript data types by allowing them to:

Explore each data type

See real JavaScript examples

Change values and experiment

See the output immediately

Understand typeof

Compare primitive and reference types

Take a small interactive quiz at the end

Data Types to Cover

Primitive Data Types

String

Number

BigInt

Boolean

Undefined

Null

Symbol

Reference / Non-Primitive Type

Object

Also demonstrate:

Array

Function

Clearly explain that arrays and functions are technically objects in JavaScript, while commonly being taught separately as reference/non-primitive types.

Website Structure

1. Hero Section

Title:

JavaScript Data Types Explorer

Subtitle:

“Don’t just learn data types. Play with them!”

Add a visually interesting JavaScript-themed animated background.

Show a large interactive JavaScript-style code card:

let value = "Hello JavaScript";

console.log(typeof value);


Display the result:

string


Add a large button:

Start Exploring →

Use smooth scrolling to move to the data type explorer.

2. Data Type Universe

Create an attractive section called:

“Explore the Data Type Universe”

Display the data types as interactive cards.

Each card should have:

Data type name

Small icon

Short description

Example value

typeof result

Interactive hover animation

“Explore” button

Use visually distinct but professional colors.

Cards:

String

Example:

"Hello"


typeof:

"string"


Number

Example:

42


typeof:

"number"


BigInt

Example:

12345678901234567890n


typeof:

"bigint"


Boolean

Example:

true


typeof:

"boolean"


Undefined

Example:

let x;


typeof:

"undefined"


Null

Example:

null


typeof:

"object"


Add a special visual note:

“Interesting! typeof null returns object.”

Explain that this is a historical JavaScript behavior.

Symbol

Example:

Symbol("id")


typeof:

"symbol"


Object

Example:

{ name: "John", age: 20 }


typeof:

"object"


Array

Example:

[10, 20, 30]


typeof:

"object"


Show:

Array.isArray([10, 20, 30])


Result:

true


Function

Example:

function greet() {
    return "Hello";
}


typeof:

"function"


3. Interactive Playground

Create a major section called:

“Type It. Run It. See It.”

This should be the most interactive part of the website.

Create a simple JavaScript playground with:

Left side:

Code editor

Pre-filled example

Right side:

Output panel

Detected data type

typeof result

Example:

let value = 100;


Show:

Value: 100

typeof value
→ number


Allow students to edit the value.

Include quick buttons:

"Hello"

100

true

undefined

null

123n

Symbol("id")

{name: "Alex"}

[1, 2, 3]

function() {}

When the student clicks a button, update the code and output automatically.

Do not require Node.js.

The playground must execute JavaScript safely in the browser.

4. “What Am I?” Game

Create an interactive guessing game.

Show a mystery value such as:

42


Question:

“What data type is this?”

Options:

String

Number

Boolean

Object

After clicking an option:

Correct answer → show a positive animation and explanation

Wrong answer → show the correct answer and explanation

Generate multiple questions randomly.

Include a score counter:

Score: 4 / 5

Add a progress indicator.

5. typeof Detective

Create a fun section called:

“Become a typeof Detective 🕵️”

Show JavaScript expressions one at a time:

typeof "Hello"


typeof 25


typeof true


typeof undefined


typeof null


typeof [1, 2, 3]


typeof {name: "John"}


Students predict the answer before revealing it.

Add a button:

Reveal Answer

Then show:

typeof null
→ "object"


with a short explanation.

6. Primitive vs Reference Types

Create a visually attractive comparison section.

Title:

Primitive vs Reference

Use two interactive panels.

Primitive

Show:

String
Number
BigInt
Boolean
Undefined
Null
Symbol


Reference / Non-Primitive

Show:

Object
Array
Function


Explain in very simple beginner-friendly language.

Add an interactive example:

let a = 10;
let b = a;

b = 20;


Show visually:

a → 10
b → 20


Then demonstrate an object:

let person1 = { name: "John" };
let person2 = person1;

person2.name = "Alex";


Show that both variables refer to the same object.

Keep the explanation simple and visual.

7. Data Type Memory Game

Create a small matching game.

Students match:

Example Value → Data Type

Examples:

"Hello" → String
25 → Number
true → Boolean
null → Null
undefined → Undefined
[1,2,3] → Array
{name:"John"} → Object


Use drag-and-drop if practical.

Show a success animation when all matches are correct.

8. Data Type Comparison Table

Create a clean table:

| Data Type | Example | typeof Result |
| String | "Hello" | string |
| Number | 25 | number |
| BigInt | 123n | bigint |
| Boolean | true | boolean |
| Undefined | undefined | undefined |
| Null | null | object |
| Symbol | Symbol("id") | symbol |
| Object | {} | object |
| Array | [] | object |
| Function | function(){} | function |

Make the table responsive and easy to read.

9. Quick Challenge

Create 5 short questions.

Example:

Question 1

What is the type of:

let x = "100";


Options:

Number

String

Boolean

Object

Correct answer:
String

Question 2

What does this return?

typeof null


Correct:

"object"


Question 3

typeof [1,2,3]


Correct:

"object"


Question 4

typeof true


Correct:

"boolean"


Question 5

typeof 100n


Correct:

"bigint"


Show final score with a fun message.

Examples:

90–100%:
“JavaScript Data Type Master!”

60–89%:
“Great job! Keep exploring!”

Below 60%:
“Nice try! Explore the types again and try once more.”

10. Important JavaScript Surprises

Create a visually attractive section:

“JavaScript Surprises 🤯”

Show cards for:

Surprise 1

typeof null


Result:

"object"


Surprise 2

typeof []


Result:

"object"


Surprise 3

typeof function(){}


Result:

"function"


Surprise 4

typeof NaN


Result:

"number"


Add short beginner-friendly explanations.

11. Design Requirements

Use a modern futuristic coding-lab aesthetic.

Theme:

Dark background

JavaScript-inspired yellow accents

White text

Soft glowing effects

Glassmorphism cards

Subtle gradients

Rounded cards

Smooth animations

Hover effects

Micro-interactions

Modern typography

Do NOT make it look like a corporate business website.

Make it feel like:

“Interactive coding laboratory + educational game.”

Use animations carefully so they do not distract from learning.

12. Navigation

Sticky navigation bar:

JS Data Types Explorer

Links:

Home

Data Types

Playground

typeof Detective

Primitive vs Reference

Games

Quiz

Add a Start Learning button.

Navigation should smoothly scroll to sections.

13. Student-Friendly Explanations

Keep all explanations extremely simple.

Avoid complicated terminology unless it is immediately explained.

For example:

Instead of:

“Primitive values are immutable data entities stored directly by value.”

Use:

“Primitive values are simple values such as numbers, strings and booleans.”

Add a small “Remember” box for important concepts.

14. Technical Requirements

Build the website using:

React

TypeScript

Tailwind CSS

Modern component-based structure

Make it fully responsive for:

Desktop

Laptop

Tablet

Mobile

Use accessible buttons, labels and keyboard-friendly interactions.

Do not use a backend.

All interactive activities should work entirely in the browser.

Do not require Node.js installation for the student.

Do not use external APIs.

Use clean reusable components.

Make sure there are no console errors.

15. Final Section

Add a final section:

“Ready to Master JavaScript?”

Text:

Explore → Experiment → Predict → Learn

Button:

Play Again

and

Explore Data Types

Add a small footer:

JavaScript Data Types Explorer | Built for CSE Students

Important UX Requirement

The website should NOT feel like a long page of notes.

The primary learning experience should be:

See → Click → Experiment → Predict → Get Feedback → Learn

Use animations, interactive cards, live output, quizzes, games and visual feedback wherever appropriate.

Make the first screen visually impressive enough that students immediately want to click Start Exploring.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0c3c012a-ffe3-5a0c-9dcb-584e61fcd30c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
