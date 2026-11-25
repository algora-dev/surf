import {publicEnquiryMode} from '../../../lib/server/enquiry-mode';
export const dynamic='force-dynamic';
export async function GET(){return Response.json({mode:await publicEnquiryMode()},{headers:{'Cache-Control':'no-store, max-age=0'}})}
