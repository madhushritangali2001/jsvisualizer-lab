export type WorkerSourceOptions = {
  code: string;
  capture: string;
  useCapturedValue: boolean;
  nonce: string;
};

/**
 * Builds the script run inside the disposable sandbox worker. Every message is
 * tagged with the run nonce; log lines are also forwarded as progress messages
 * so output produced before a timeout or an error is not lost.
 */
export function buildWorkerSource({
  code,
  capture,
  useCapturedValue,
  nonce,
}: WorkerSourceOptions): string {
  return `self.onmessage=()=>{const send=(p)=>self.postMessage(Object.assign({},p,{nonce:${JSON.stringify(
    nonce,
  )}}));const logs=[];let last;let logged=false;const format=v=>{if(v===undefined)return 'undefined';if(v===null)return 'null';if(typeof v==='number'||typeof v==='bigint'||typeof v==='symbol'||typeof v==='function')return String(v)+(typeof v==='bigint'?'n':'');if(typeof v==='string')return v;const seen=new WeakSet();return JSON.stringify(v,(_,x)=>{if(typeof x==='bigint')return String(x)+'n';if(typeof x==='number'&&!Number.isFinite(x))return String(x);if(x&&typeof x==='object'){if(seen.has(x))return '[Circular]';seen.add(x);}return x;});};const console={log:(...args)=>{last=args[0];logged=true;if(logs.length<100){logs.push(args.map(format).join(' ').slice(0,5000));send({kind:'progress',logs:logs.slice()});}}};console.info=console.warn=console.error=console.log;try{const captured=new Function('console','"use strict";'+${JSON.stringify(
    code,
  )}+${JSON.stringify(capture)})(console);const value=${
    useCapturedValue ? "captured" : "logged?last:captured"
  };const type=typeof value;const array=Array.isArray(value);send({kind:'result',value:String(type==='string'?JSON.stringify(value):format(value)).slice(0,5000),type,detected:value===null?'Null':array?'Array':type.charAt(0).toUpperCase()+type.slice(1),isArray:array,logs});}catch(e){send({kind:'result',value:'',type:'error',detected:'',isArray:false,logs,error:e.name+': '+e.message});}};`;
}
