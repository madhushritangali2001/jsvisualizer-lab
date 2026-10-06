export const types = [
 {name:'String',icon:'Aa',example:'"Hello"',expression:'"Hello"',result:'string',description:'Words, letters, and text.',detail:'A string is text inside quotes. Even "100" is text, not a number.',group:'Primitive'},
 {name:'Number',icon:'#',example:'42',expression:'42',result:'number',description:'Numbers big, small, or decimal.',detail:'Whole numbers and decimals are both numbers. NaN means “not a number”, but its type is still number.',group:'Primitive'},
 {name:'BigInt',icon:'n',example:'12345678901234567890n',expression:'12345678901234567890n',result:'bigint',description:'Really, really large integers.',detail:'BigInt stores whole numbers beyond the safe Number range. Add n at the end. Do not mix BigInt and Number in arithmetic.',group:'Primitive'},
 {name:'Boolean',icon:'◐',example:'true',expression:'true',result:'boolean',description:'A simple yes or no.',detail:'A boolean is either true or false. It helps your program make decisions.',group:'Primitive'},
 {name:'Undefined',icon:'?',example:'let x;',expression:'undefined',result:'undefined',description:'A value not assigned yet.',detail:'When you declare let x; without giving it a value, x is undefined.',group:'Primitive'},
 {name:'Null',icon:'∅',example:'null',expression:'null',result:'object',description:'Intentionally nothing.',detail:'null means you intentionally chose “no value”. typeof null returns "object" because of a historical JavaScript quirk. Null is still a primitive.',group:'Primitive'},
 {name:'Symbol',icon:'◇',example:'Symbol("id")',expression:'Symbol("id")',result:'symbol',description:'A unique identifier.',detail:'Every Symbol is unique. Symbol("id") and another Symbol("id") are different, even with the same label.',group:'Primitive'},
 {name:'Object',icon:'{}',example:'{ name: "John", age: 20 }',expression:'{ name: "John", age: 20 }',result:'object',description:'Related values, together.',detail:'Objects group values using names called keys. For example, person.name gives you the name.',group:'Reference'},
 {name:'Array',icon:'[]',example:'[10, 20, 30]',expression:'[10, 20, 30]',result:'object',description:'An ordered list of values.',detail:'Arrays are objects that hold a list. typeof returns "object". Use Array.isArray(value) to check for an array.',group:'Reference'},
 {name:'Function',icon:'ƒ',example:'function greet() { return "Hello"; }',expression:'function greet() { return "Hello"; }',result:'function',description:'Code you can call again.',detail:'Functions are callable objects: objects that can run code. typeof gives them the special result "function".',group:'Reference'},
] as const;
export type TypeInfo = typeof types[number];
export const challenge = [
 {expression:'let x = "100";',answer:'String',options:['Number','String','Boolean','Object'],explanation:'Quotes make "100" a string, even though it looks like a number.'},
 {expression:'typeof null',answer:'object',options:['null','undefined','object','number'],explanation:'This is a historical JavaScript quirk. Null is still a primitive.'},
 {expression:'typeof [1, 2, 3]',answer:'object',options:['array','object','number','string'],explanation:'An array is a special object. Array.isArray checks whether it is an array.'},
 {expression:'typeof true',answer:'boolean',options:['string','number','boolean','object'],explanation:'true and false are the two boolean values.'},
 {expression:'typeof 100n',answer:'bigint',options:['number','bigint','string','object'],explanation:'The n at the end makes this a BigInt.'},
];
export function scoreMessage(score:number,total:number) {const percent=score/total*100;return percent>=90?'JavaScript Data Type Master!':percent>=60?'Great job! Keep exploring!':'Nice try! Explore the types again and try once more.';}
