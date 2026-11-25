import {db,HttpError} from './db';
import {effectiveEnquiryMode,isEnquiryMode,type EnquiryMode} from '../enquiry-mode';
export async function readEnquiryMode():Promise<EnquiryMode|null>{try{const rows=await db<{enquiry_mode:unknown}[]>('business_settings?id=eq.1&select=enquiry_mode',{signal:AbortSignal.timeout(2500)});return isEnquiryMode(rows?.[0]?.enquiry_mode)?rows[0].enquiry_mode:null}catch{return null}}
export async function publicEnquiryMode():Promise<EnquiryMode>{return process.env.OPENAI_API_KEY?effectiveEnquiryMode(await readEnquiryMode(),true):'direct'}
export async function requireSmartEnquiries(){if(await publicEnquiryMode()!=='smart')throw new HttpError(503,'Smart enquiries unavailable; use direct contact');}
export async function writeEnquiryMode(value:unknown){if(!isEnquiryMode(value))throw new HttpError(400,'Invalid enquiry mode');if(value==='smart'&&!process.env.OPENAI_API_KEY)throw new HttpError(503,'Assistant not configured');await db('business_settings?on_conflict=id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({id:1,enquiry_mode:value}),signal:AbortSignal.timeout(4000)});}
