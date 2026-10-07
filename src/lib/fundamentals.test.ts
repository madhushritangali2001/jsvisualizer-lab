import { describe, expect, it } from 'vitest';
import { variableRules, finalQuestions, quizLevel, operatorGroups, operatorCode, detectiveQuestions, hoistingQuestions, coercionCases } from './fundamentals';
describe('Fundamentals learning rules',()=>{
 for(const [kind,scope,redeclare,reassign,before] of [['var','Function','Yes','Yes','undefined'],['let','Block','No','Yes','TDZ'],['const','Block','No','No','TDZ']] as const){
  it(`${kind} scope`,()=>expect(variableRules[kind].scope).toBe(scope));
  it(`${kind} redeclaration`,()=>expect(variableRules[kind].redeclaration).toBe(redeclare));
  it(`${kind} reassignment`,()=>expect(variableRules[kind].reassignment).toBe(reassign));
  it(`${kind} IS hoisted`,()=>expect(variableRules[kind].hoisted).toBe('Yes'));
  it(`${kind} before declaration`,()=>expect(variableRules[kind].before).toBe(before));
 }
 it('final quiz has 20 questions',()=>expect(finalQuestions).toHaveLength(20));
 for(const [score,level] of [[0,'Beginner'],[7,'Beginner'],[8,'JavaScript Explorer'],[14,'JavaScript Explorer'],[15,'JavaScript Ninja'],[18,'JavaScript Ninja'],[19,'JavaScript Master'],[20,'JavaScript Master']] as const) it(`score ${score} level`,()=>expect(quizLevel(score)).toBe(level));
 it('quiz includes true/false',()=>expect(finalQuestions.at(-1)?.options).toEqual(['True','False']));
 for(const [i,answer] of ['undefined','ReferenceError','ReferenceError'].entries())it(`hoisting challenge ${i+1}`,()=>expect(hoistingQuestions[i]?.answer).toBe(answer));
 it('detective includes function',()=>expect(detectiveQuestions.find(q=>q.code==='typeof function(){}')?.answer).toBe('function'));
 it('detective includes BigInt',()=>expect(detectiveQuestions.find(q=>q.code==='typeof 100n')?.answer).toBe('bigint'));
 for(const [code,result] of [['"5" + 2','"52"'],['"5" - 2','3'],['"10" * 2','20'],['"10" / 2','5'],['true + 1','2'],['false + 1','1']])it(code,()=>expect(coercionCases.find(c=>c.code===code)?.output).toBe(result));
 it('all assignment operators are available',()=>expect(operatorGroups.Assignment).toEqual(['=','+=','-=','*=','/=','%=','**=']));
 it('all bitwise operators are available',()=>expect(operatorGroups.Bitwise).toEqual(['&','|','^','~','<<','>>','>>>']));
 const evaluate=(code:string)=>new Function('console',`${code};return value;`)({log:()=>{}});
 for(const [a,op,b,want] of [['10','+','5',15],['10','==','"10"',true],['10','===','"10"',false],['2','**','3',8],['10','%','3',1],['10','+=','5',15],['10','++','',11],['10','--','',9],['10','void','',undefined],['0','!','',true]] as const)it(`${a} ${op} ${b}`,()=>expect(evaluate(operatorCode(a,op,b,'0'))).toBe(want));
 it('ternary chooses false branch',()=>expect(evaluate(operatorCode('false','?:','10','5'))).toBe(5));
 it('delete removes an object property',()=>expect(evaluate(operatorCode('10','delete','5','0'))).toBe(true));
});