export type EnquiryMode='smart'|'direct';
export function isEnquiryMode(value:unknown):value is EnquiryMode{return value==='smart'||value==='direct'}
// Unknown values and unavailable dependencies must fail open to direct contact, not AI.
export function effectiveEnquiryMode(value:unknown,configured:boolean):EnquiryMode{return value==='smart'&&configured?'smart':'direct'}
export function fallbackMessage(base:string,customerMessages:string[],unsent:string='',heading='My enquiry details:'){const details=[...customerMessages,unsent].map(x=>x.trim()).filter(Boolean).filter((x,i,a)=>a.indexOf(x)===i).join('\n');return details?`${base}\n\n${heading}\n${details}`:base;}
