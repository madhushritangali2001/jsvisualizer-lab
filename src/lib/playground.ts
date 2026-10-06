export type Execution = {value:string;type:string;detected:string;isArray:boolean;error?:string};
// An opaque-origin iframe isolates storage; CSP blocks all network requests.
// A disposable worker provides a separate thread and an enforced time limit.
export function executeCode(code:string):Promise<Execution> {
 return new Promise(resolve=>{
  const iframe=document.createElement('iframe'); iframe.setAttribute('sandbox','allow-scripts'); iframe.hidden=true;
  let timer:ReturnType<typeof setTimeout>;
  const finish=(result:Execution)=>{clearTimeout(timer);window.removeEventListener('message',receive);iframe.remove();resolve(result);};
  const receive=(event:MessageEvent)=>{if(event.source!==iframe.contentWindow)return; const r=event.data;if(r&&typeof r.type==='string'&&typeof r.value==='string')finish(r);};
  window.addEventListener('message',receive);
  const workerSource=`self.onmessage=()=>{try{const value=new Function('"use strict";'+${JSON.stringify(code)}+'; return typeof value === "undefined" ? undefined : value;')(); const type=typeof value; const array=Array.isArray(value); const display=type==='bigint'?String(value)+'n':type==='symbol'||type==='function'?String(value):value===undefined?'undefined':JSON.stringify(value,(_,v)=>typeof v==='bigint'?String(v)+'n':v); self.postMessage({value:String(display).slice(0,5000),type,detected:value===null?'Null':array?'Array':type.charAt(0).toUpperCase()+type.slice(1),isArray:array});}catch(e){self.postMessage({value:'',type:'error',detected:'',isArray:false,error:e.message});}};`;
  iframe.srcdoc=`<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' blob:; worker-src blob:; connect-src 'none'"><script>const w=new Worker(URL.createObjectURL(new Blob([${JSON.stringify(workerSource).replace(/</g,'\\u003c')}],{type:'text/javascript'})));w.onmessage=e=>{parent.postMessage(e.data,'*');w.terminate()};w.onerror=()=>parent.postMessage({value:'',type:'error',detected:'',isArray:false,error:'Could not run this code.'},'*');w.postMessage(null);<\/script>`;
  timer=setTimeout(()=>finish({value:'',type:'error',detected:'',isArray:false,error:'Execution stopped after 1.5 seconds. Check for an endless loop.'}),1500);
  document.body.appendChild(iframe);
 });
}
