export type Declaration = 'var' | 'let' | 'const';
export const declarations: Declaration[] = ['var', 'let', 'const'];
export const variableRules = {
 var: {scope:'Function',redeclaration:'Yes',reassignment:'Yes',hoisted:'Yes',before:'undefined'},
 let: {scope:'Block',redeclaration:'No',reassignment:'Yes',hoisted:'Yes',before:'TDZ'},
 const: {scope:'Block',redeclaration:'No',reassignment:'No',hoisted:'Yes',before:'TDZ'},
} as const;
export const operatorGroups = {
 Arithmetic:['+','-','*','/','%','**','++','--'],
 Assignment:['=','+=','-=','*=','/=','%=','**='],
 Comparison:['==','===','!=','!==','>','<','>=','<='],
 Logical:['&&','||','!'],
 Bitwise:['&','|','^','~','<<','>>','>>>'],
 Ternary:['?:'],
 Unary:['typeof','delete','void','unary +','unary -','!'],
} as const;
export type OperatorGroup = keyof typeof operatorGroups;
export function operatorCode(a:string,op:string,b:string,otherwise:string) {
 if(op==='?:') return `let value = (${a}) ? (${b}) : (${otherwise}); console.log(value);`;
 if(op==='delete') return `let box = { item: (${a}) }; let value = delete box.item; console.log(value); console.log(box);`;
 if(op==='++'||op==='--') return `let value = (${a}); ${op}value; console.log(value);`;
 if(['=','+=','-=','*=','/=','%=','**='].includes(op)) return `let value = (${a}); value ${op} (${b}); console.log(value);`;
 if(['typeof','void','unary +','unary -','!','~'].includes(op)) return `let value = ${op.replace('unary ','')} (${a}); console.log(value);`;
 return `let value = (${a}) ${op} (${b}); console.log(value);`;
}
export type Question = {code:string;prompt:string;options:string[];answer:string;why:string};
const q=(code:string,answer:string,options:string[],why:string,prompt='Predict the output'):Question=>({code,answer,options,why,prompt});
export const predictionQuestions:Question[] = [
 q('let x = "10";\nconsole.log(x + 5);','105',['15','105','"10"','Error'],'With a string, + joins text: "10" + "5".'),
 q('let x = "10";\nconsole.log(x - 5);','5',['105','5','NaN','Error'],'Subtraction converts "10" to the number 10.'),
 q('console.log(typeof null);','object',['null','undefined','object','string'],'A historical quirk. Null is still a primitive.'),
 q('console.log(typeof []);','object',['array','object','undefined','number'],'An array is a special object.'),
 q('console.log(typeof undefined);','undefined',['null','object','undefined','string'],'typeof returns the string "undefined".'),
];
export const hoistingQuestions:Question[] = declarations.map((kind,i)=>q(`console.log(${['a','b','c'][i]});\n${kind} ${['a','b','c'][i]} = ${10*(i+1)};`,kind==='var'?'undefined':'ReferenceError',['10','undefined','ReferenceError','SyntaxError'],kind==='var'?'var is created with undefined before execution. Its assignment happens later.':`${kind} is hoisted, but accessing it before initialization is in the TDZ.`,'What happens?'));
export const operatorQuestions:Question[] = [
 q('console.log(10 + 5);','15',['15','105','5','50'],'Two numbers are added.'),
 q('console.log(10 % 3);','1',['1','3','0','10'],'% gives the remainder: 10 = 3 × 3 + 1.'),
 q('console.log(2 ** 3);','8',['6','8','9','5'],'** means power: 2 × 2 × 2.'),
 q('console.log(10 == "10");','true',['true','false','Error','10'],'Loose equality can convert types.'),
 q('console.log(10 === "10");','false',['true','false','Error','10'],'Strict equality requires the same type and value.'),
 q('console.log(true && false);','false',['true','false','undefined','Error'],'Both must be true for this boolean && expression.'),
 q('console.log(true || false);','true',['true','false','undefined','Error'],'At least one is true.'),
];
export const detectiveQuestions:Question[] = [
 ['"Hello"','string','Text inside quotes.'],['25','number','Whole numbers have type number.'],['true','boolean','true and false are booleans.'],['undefined','undefined','No assigned value.'],['null','object','A historical quirk; null is primitive.'],['[]','object','Arrays are special objects.'],['{}','object','An object groups related values.'],['function(){}','function','Functions are callable objects.'],['100n','bigint','The n creates a BigInt.'],
].map(([code,answer,why])=>q(`typeof ${code}`,answer??'', ['string','number','boolean','undefined','object','function','bigint','symbol'],why??''));
export const finalQuestions:Question[] = [
 q('let age = 20;','let',['var','let','const','typeof'],'let allows later reassignment and is block-scoped.','Which block-scoped declaration allows reassignment?'),
 q('const age = 20;\nage = 21;','TypeError',['21','20','TypeError','undefined'],'A const binding cannot be reassigned.'),
 q('{ let a = 10; }\nconsole.log(a);','ReferenceError',['10','undefined','ReferenceError','null'],'a exists only inside its block.'),
 q('function demo() {\n  { var c = 30; }\n  console.log(c);\n}\ndemo();','30',['30','undefined','ReferenceError','null'],'var belongs to the containing function, not the inner block.'),
 q('"hello"','String',['Number','String','Object','Boolean'],'Quotes create text.','Which data type is this?'),
 q('console.log(typeof 123n);','bigint',['number','bigint','string','object'],'n marks a BigInt.'),
 q('console.log(typeof null);','object',['null','object','undefined','number'],'This historical result does not make null an object.'),
 q('console.log(typeof [10, 20]);','object',['array','object','number','string'],'Arrays are objects. Array.isArray can identify them.'),
 q('console.log(typeof function(){});','function',['object','function','string','undefined'],'Functions are callable objects with a special typeof result.'),
 q('let p = { name: "John" };\nlet other = p;\nother.name = "Alex";\nconsole.log(p.name);','Alex',['John','Alex','undefined','Error'],'Both bindings refer to the same object.'),
 operatorQuestions[1] as Question,
 operatorQuestions[2] as Question,
 operatorQuestions[3] as Question,
 operatorQuestions[4] as Question,
 q('console.log("5" + 2);','52',['7','52','3','NaN'],'+ joins text when one operand is a string.'),
 q('console.log("5" - 2);','3',['52','3','7','NaN'],'- converts the string to a number.'),
 q('console.log(Number("12.5"));','12.5',['12','12.5','NaN','"12.5"'],'Number converts the whole numeric string.'),
 hoistingQuestions[0] as Question,
 hoistingQuestions[1] as Question,
 q('let and const are hoisted, but\ninaccessible before initialization.','True',['True','False'],'Their bindings exist from scope entry but remain in the TDZ.','True or false?'),
];
export function quizLevel(score:number) {return score<=7?'Beginner':score<=14?'JavaScript Explorer':score<=18?'JavaScript Ninja':'JavaScript Master';}
export const presets = {
 Variables:'let age = 20;\nage = 21;\nconsole.log(age);',
 'Data Types':'let x = "100";\nconsole.log(x);\nconsole.log(typeof x);',
 'Reference Types':'let person = { name: "John", age: 20 };\nlet copy = person;\ncopy.name = "Alex";\nconsole.log(person);',
 Operators:'console.log(10 == "10");\nconsole.log(10 === "10");',
 Coercion:'console.log("5" + 2);\nconsole.log("5" - 2);',
 Hoisting:'console.log(age);\nvar age = 20;',
 TDZ:'console.log(age);\nlet age = 20;',
} as const;
export const commonUses:Record<string,string> = {String:'Names, messages, and labels.',Number:'Ages, prices, and calculations.',BigInt:'Very large whole-number counts.',Boolean:'Whether a setting is on or off.',Undefined:'A variable waiting for a value.',Null:'An intentionally empty selection.',Symbol:'Unique keys for objects.',Object:'A student profile with a name and age.',Array:'A list of marks or names.',Function:'A reusable greeting or calculation.'};
export const coercionCases = [
 {code:'"5" + 2',input:'2 (number)',conversion:'String → "2"',output:'"52"',why:'+ joins text if either value is a string.'},
 {code:'"5" - 2',input:'"5" (string)',conversion:'Number → 5',output:'3',why:'Subtraction needs numbers.'},
 {code:'"10" * 2',input:'"10" (string)',conversion:'Number → 10',output:'20',why:'Multiplication converts numeric text.'},
 {code:'"10" / 2',input:'"10" (string)',conversion:'Number → 10',output:'5',why:'Division also needs numbers.'},
 {code:'true + 1',input:'true (boolean)',conversion:'Number → 1',output:'2',why:'true converts to 1 in arithmetic.'},
 {code:'false + 1',input:'false (boolean)',conversion:'Number → 0',output:'1',why:'false converts to 0 in arithmetic.'},
];