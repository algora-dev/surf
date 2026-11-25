export const zone='America/Santo_Domingo';
export const kinds=['lesson','rest','travel','off','busy','available'] as const;
export type Kind=typeof kinds[number];
export type Status=Kind|'weekend'|'unknown';
export type Block={id:string;kind:Kind;starts_at:string;ends_at:string;title:string;enquiry_id:string|null;shareable?:boolean;group_level?:string;open_spots?:number};
export type Hours={start_time:string;end_time:string;days:number[];configured:boolean;slow_weekend?:boolean};
export type Enquiry={id:string;created_at:string;locale:'en'|'es'|'fr';service:number;name:string;phone:string;preferred_date:string|null;preferred_time:string;duration:string;group_size:string;experience:string;notes:string;email?:string;channel?:string;message?:string;calendar_id?:string|null;state:'new'|'replied'|'confirmed'|'closed'};
export const states=['new','replied','confirmed','closed'] as const;
export const priority:Kind[]=['off','travel','lesson','busy','rest','available'];
export function localParts(now:Date){const p=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23',weekday:'short'}).formatToParts(now);const get=(k:string)=>p.find(x=>x.type===k)?.value||'';return {date:`${get('year')}-${get('month')}-${get('day')}`,time:`${get('hour')}:${get('minute')}`,day:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(get('weekday'))};}
export function statusAt(now:Date,blocks:Block[],hours:Hours|null):Status{const active=blocks.filter(b=>Date.parse(b.starts_at)<=+now&&+now<Date.parse(b.ends_at));for(const k of priority)if(active.some(b=>b.kind===k))return k;if(!hours?.configured)return 'unknown';const {time,day}=localParts(now);const start=hours.start_time.slice(0,5),end=hours.end_time.slice(0,5);const inHours=start<end?time>=start&&time<end:time>=start||time<end;const workingDay=start>end&&time<end?(day+6)%7:day;if(!hours.days.includes(workingDay)||!inHours)return 'rest';return hours.slow_weekend&&(day===0||day===6)?'weekend':'available';}
export function localInput(date:string){const p=localParts(new Date(date));return `${p.date}T${p.time}`;}
export function toUtc(input:string){if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(input))throw Error('Invalid date/time');const d=new Date(input+':00-04:00');if(!Number.isFinite(+d)||localInput(d.toISOString())!==input)throw Error('Invalid date/time');return d.toISOString();}
