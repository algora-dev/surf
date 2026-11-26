import {randomUUID} from 'node:crypto';
// Opt-in diagnostics only. No raw request headers, credentials, contact fields or audio.
// Transcript mode is for fictional tests on access-protected, non-indexable previews only.
export function traceMode(): 'off'|'metadata'|'synthetic' {
 const mode=process.env.PENINSULA_ASSISTANT_LOGGING;
 if(process.env.SITE_INDEXABLE==='true'||process.env.VERCEL_ENV==='production')return 'off';
 if(mode==='metadata')return 'metadata';
 if(mode==='synthetic'&&process.env.PENINSULA_SYNTHETIC_TEST_DATA==='true'&&(process.env.NODE_ENV!=='production'||process.env.VERCEL_ENV==='preview'))return 'synthetic';
 return 'off';
}
export function assistantTrace(scope:string){const mode=traceMode(),id=randomUUID(),started=Date.now();return (event:string,metadata:Record<string,unknown>={},synthetic?:unknown)=>{if(mode==='off')return;try{console.info(JSON.stringify({tag:'peninsula-assistant',scope,event,id,ms:Date.now()-started,...metadata,...(mode==='synthetic'&&synthetic!==undefined?{synthetic}: {})}));}catch{/* logging must never break the assistant */}};}
export function traceError(e:unknown){return {errorType:e instanceof Error?e.name:'Unknown',status:e&&typeof e==='object'&&'status' in e&&typeof e.status==='number'?e.status:500};}
