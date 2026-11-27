import { captureSuffix, lastTopLevelDeclaration } from "./code-capture";
import { createNonce, parseSandboxMessage, type Execution } from "./sandbox-protocol";
import { buildWorkerSource } from "./sandbox-worker";

export type { Execution } from "./sandbox-protocol";

// Opaque-origin iframe + network-blocking CSP + disposable worker keep student code isolated.
export function executeCode(code: string): Promise<Execution> {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.hidden = true;
    const nonce = createNonce();
    const parentOrigin = location.origin;
    let settled = false;
    let latestLogs: string[] = [];
    const finish = (result: Execution) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      iframe.contentWindow?.postMessage("stop", "*");
      window.removeEventListener("message", receive);
      iframe.remove();
      resolve(result);
    };
    const receive = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow) return;
      const parsed = parseSandboxMessage(event.data, nonce);
      if (parsed?.kind === "progress") {
        latestLogs = parsed.logs;
        return;
      }
      if (parsed?.kind === "result") finish(parsed.execution);
    };
    window.addEventListener("message", receive);
    const lastName = lastTopLevelDeclaration(code);
    const capture = captureSuffix(code);
    const workerSource = buildWorkerSource({
      code,
      capture,
      useCapturedValue: lastName !== null,
      nonce,
    });
    iframe.srcdoc = `<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' blob:; worker-src blob:; connect-src 'none'"><script>const url=URL.createObjectURL(new Blob([${JSON.stringify(workerSource).replace(/</g, "\\u003c")}],{type:'text/javascript'}));const w=new Worker(url);URL.revokeObjectURL(url);onmessage=()=>w.terminate();w.onmessage=e=>{parent.postMessage(e.data,${JSON.stringify(parentOrigin)});if(e.data&&e.data.kind==='result')w.terminate()};w.onerror=()=>{parent.postMessage({value:'',type:'error',detected:'',isArray:false,error:'Could not run this code.',nonce:${JSON.stringify(nonce)}},${JSON.stringify(parentOrigin)});w.terminate()};w.postMessage(${JSON.stringify(nonce)});\u003c/script>`;
    const timer = setTimeout(
      () =>
        finish({
          value: "",
          type: "error",
          detected: "",
          isArray: false,
          logs: latestLogs,
          error: "Execution stopped after 1.5 seconds. Check for an endless loop.",
        }),
      1500,
    );
    document.body.appendChild(iframe);
  });
}
