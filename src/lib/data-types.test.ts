import { describe, expect, it } from 'vitest';
import { types, challenge, scoreMessage } from './data-types';
describe('JavaScript teaching rules',()=>{
 for(const [name,result] of [['String','string'],['Number','number'],['BigInt','bigint'],['Boolean','boolean'],['Undefined','undefined'],['Null','object'],['Symbol','symbol'],['Object','object'],['Array','object'],['Function','function']]){
  it(`${name} teaches typeof ${result}`,()=>expect(types.find(t=>t.name===name)?.result).toBe(result));
 }
 it('null remains primitive',()=>expect(types.find(t=>t.name==='Null')?.group).toBe('Primitive'));
 it('arrays are reference values',()=>expect(types.find(t=>t.name==='Array')?.group).toBe('Reference'));
 it('functions are reference values',()=>expect(types.find(t=>t.name==='Function')?.group).toBe('Reference'));
 for(const [index,answer] of ['String','object','object','boolean','bigint'].entries())it(`challenge ${index+1} answer`,()=>expect(challenge[index]?.answer).toBe(answer));
 it('90% earns master',()=>expect(scoreMessage(9,10)).toBe('JavaScript Data Type Master!'));
 it('60% earns encouragement',()=>expect(scoreMessage(6,10)).toBe('Great job! Keep exploring!'));
 it('below 60% invites another try',()=>expect(scoreMessage(5,10)).toBe('Nice try! Explore the types again and try once more.'));
});