export type Execution = {value:string;type:string;detected:string;isArray:boolean;logs?:string[];error?:string};
// Opaque-origin iframe + network-blocking CSP + disposable worker keep student code isolated.
export function executeCode(code:string):Promise<Execution> {
 return new Promise(resolve=>{
  const iframe=document.createElement('iframe'); iframe.setAttribute('sandbox','allow-scripts'); iframe.hidden=true;
  let timer:ReturnType<typeof setTimeout>;let settled=false;
  const finish=(result:Execution)=>{if(settled)return;settled=true;clearTimeout(timer);iframe.contentWindow?.postMessage('stop','*');window.removeEventListener('message',receive);iframe.remove();resolve(result);};
  const receive=(event:MessageEvent)=>{if(event.source!==iframe.contentWindow)return;const r=event.data;if(r&&typeof r.type==='string'&&typeof r.value==='string')finish(r);};
  window.addEventListener('message',receive);
  const names=[...code.matchAll(/(?:let|const|var)\s+([A-Za-z_$][\w$]*)/g)].map(m=>m[1]);
  const lastName=names.at(-1);const capture=lastName?`;return typeof ${lastName} === "undefined" ? undefined : ${lastName};`:';return undefined;';
  const workerSource=`self.onmessage=()=>{const send=self.postMessage.bind(self); const logs=[];let last;let logged=false;const format=v=>{if(v===undefined)return 'undefined';if(v===null)return 'null';if(typeof v==='number'||typeof v==='bigint'||typeof v==='symbol'||typeof v==='function')return String(v)+(typeof v==='bigint'?'n':'');if(typeof v==='string')return v;const seen=new WeakSet();return JSON.stringify(v,(_,x)=>{if(typeof x==='bigint')return String(x)+'n';if(typeof x==='number'&&!Number.isFinite(x))return String(x);if(x&&typeof x==='object'){if(seen.has(x))return '[Circular]';seen.add(x);}return x;});};const console={log:(...args)=>{last=args[0];logged=true;if(logs.length<100)logs.push(args.map(format).join(' ').slice(0,5000));}};console.info=console.warn=console.error=console.log;try{const captured=new Function('console','"use strict";'+${JSON.stringify(code)}+${JSON.stringify(capture)})(console);const value=${lastName?'captured':'logged?last:captured'};const type=typeof value;const array=Array.isArray(value);send({value:String(type==='string'?JSON.stringify(value):format(value)).slice(0,5000),type,detected:value===null?'Null':array?'Array':type.charAt(0).toUpperCase()+type.slice(1),isArray:array,logs});}catch(e){send({value:'',type:'error',detected:'',isArray:false,logs,error:e.name+': '+e.message});}};`;
  iframe.srcdoc=`<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' blob:; worker-src blob:; connect-src 'none'"><script>const url=URL.createObjectURL(new Blob([${JSON.stringify(workerSource).replace(/</g,'\\u003c')}],{type:'text/javascript'}));const w=new Worker(url);URL.revokeObjectURL(url);onmessage=()=>w.terminate();w.onmessage=e=>{parent.postMessage(e.data,'*');w.terminate()};w.onerror=()=>{parent.postMessage({value:'',type:'error',detected:'',isArray:false,error:'Could not run this code.'},'*');w.terminate()};w.postMessage(null);<\/script>`;
  timer=setTimeout(()=>finish({value:'',type:'error',detected:'',isArray:false,error:'Execution stopped after 1.5 seconds. Check for an endless loop.'}),1500);
  document.body.appendChild(iframe);
 });
}
