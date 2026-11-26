import {db} from './db';
export type EmailState='pending'|'accepted'|'failed';
export async function deliverEnquiryEmail(id:string):Promise<EmailState>{
 const rows=await db<{email_state:EmailState|null;created_at:string;request_id:string;message:string;email:string;channel:string}[]>(`enquiries?id=eq.${encodeURIComponent(id)}&select=email_state,created_at,request_id,message,email,channel`);const row=rows[0];if(!row||row.channel!=='email'||!row.email||!row.request_id)return 'failed';if(row.email_state==='accepted')return 'accepted';
 const key=process.env.RESEND_API_KEY,from=process.env.ENQUIRY_EMAIL_FROM,to=process.env.ENQUIRY_EMAIL_TO;
 // Resend idempotency window is finite. Do not automatically resend old requests.
 if(!key||!from||!to||Date.now()-Date.parse(row.created_at)>23*3600000)return 'failed';
 if(!await db<boolean>('rpc/claim_enquiry_email',{method:'POST',body:JSON.stringify({p_id:id})}))return 'pending';
 try{const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json','Idempotency-Key':`peninsula-enquiry/${row.request_id}`},body:JSON.stringify({from,to:[to],reply_to:row.email,subject:`Península — Surf enquiry / Consulta de surf · ${row.request_id.slice(0,12)}`,text:row.message}),signal:AbortSignal.timeout(7000)});if(r.ok){await db(`enquiries?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({email_state:'accepted'})});return 'accepted';}}catch{/* preserve the enquiry; provider may have accepted the request */}
 // Conditional update avoids overwriting success from concurrent retries.
 try{await db(`enquiries?id=eq.${encodeURIComponent(id)}&email_state=neq.accepted`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({email_state:'failed'})})}catch{}return 'failed';
}
