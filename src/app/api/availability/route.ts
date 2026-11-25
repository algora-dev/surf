import {availability,jsonError} from '../../../lib/server/db';
export const dynamic='force-dynamic';
export async function GET(){try{const status=await availability();return Response.json({status:status==='available'?'available':status==='lesson'?'lesson':status==='rest'?'rest':status==='weekend'?'weekend':'unknown'},{headers:{'Cache-Control':'no-store'}})}catch(e){return jsonError(e)}}
