import {adminText,type AdminLocale} from './admin-language';
import {kinds,localInput,localParts,toUtc,type Block,type Kind} from './booking';
export const kindLabels:Record<Kind,string>={lesson:'Clase de surf',busy:'Ocupado',off:'No disponible',travel:'Viaje',rest:'Descanso',available:'Disponible'};
export type Intent={operation:'create'|'update'|'delete'|'read'|'clarify';target:string;kind:string;start:string;end:string;title:string;question:string;shareable:'keep'|'yes'|'no';spots:number;level:string};
export type Change={operation:'create'|'update'|'delete';id:string;before:Block|null;after:Block|null;overlaps:Block[]};
export type Proposal={id:string;change:Change;expires:string};
export type AssistantResult={reply:string;proposal?:Proposal};
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const blankIntent:Intent={operation:'clarify',target:'',kind:'',start:'',end:'',title:'',question:'',shareable:'keep',spots:-1,level:''};
export function validateIntent(i:Intent,blocks:Block[]):Change {
 if(!['create','update','delete'].includes(i.operation))throw Error('No hay un cambio concreto para confirmar.');
 const before=i.operation==='create'?null:blocks.find(b=>b.id===i.target)||null;
 if(i.operation!=='create'&&!before)throw Error('No encuentro un único evento. Indica el día y la hora.');
 if(before&&i.operation==='delete'){if(before.enquiry_id)throw Error('Este evento está vinculado a una reserva. Revísalo manualmente en Agenda.');return {operation:'delete',id:before.id,before,after:null,overlaps:[]};}
 const kind=i.kind||before?.kind||'';if(before?.enquiry_id&&kind!=='lesson')throw Error('La reserva vinculada debe seguir siendo una clase.');if(!kinds.includes(kind as Kind))throw Error('¿Qué tipo de evento quieres añadir?');
 const start=toUtc(i.start||(before?localInput(before.starts_at):'')),end=toUtc(i.end||(before?localInput(before.ends_at):''));
 if(end<=start)throw Error('La hora de fin debe ser posterior al inicio.');
 if(typeof i.title!=='string'||i.title.length>120)throw Error('La nota es demasiado larga.');
 if(!['keep','yes','no'].includes(i.shareable))throw Error('Revisa si el grupo está abierto.');
 const shareable=kind==='lesson'&&(i.shareable==='yes'||(i.shareable==='keep'&&!!before?.shareable));
 const spots=shareable?(i.spots===-1?(before?.open_spots??0):i.spots):0;
 const level=shareable?(i.level||before?.group_level||'beginner'):'beginner';
 if(!Number.isInteger(spots)||spots<0||spots>100||!['first','beginner','intermediate','advanced','any'].includes(level))throw Error('Revisa las plazas y el nivel.');
 const id=before?.id||'';if(before&&!uuid.test(id))throw Error('Evento inválido.');
 const after:Block={id,kind:kind as Kind,starts_at:start,ends_at:end,title:i.title||before?.title||kindLabels[kind as Kind],enquiry_id:before?.enquiry_id??null,shareable,open_spots:spots,group_level:level};
 const overlaps=blocks.filter(b=>b.id!==id&&Date.parse(b.starts_at)<Date.parse(end)&&Date.parse(b.ends_at)>Date.parse(start)).sort((a,b)=>a.id.localeCompare(b.id));
 return {operation:i.operation as 'create'|'update',id,before,after,overlaps};
}
export function describeBlock(b:Block,locale:AdminLocale='es'){const t=(s:string)=>adminText(locale,s);return `${t(kindLabels[b.kind])} · ${localInput(b.starts_at).replace('T',' ')} → ${localInput(b.ends_at).replace('T',' ')} · ${t(b.title)}${b.shareable?` · ${t('Grupo abierto ·')} ${b.open_spots||0} ${t('plazas')} · ${b.group_level}`:''}`;}
export function describeChange(c:Change,locale:AdminLocale='es'){const en=locale==='en';return c.operation==='delete'?`${en?'Delete':'Eliminar'}: ${describeBlock(c.before!,locale)}`:c.operation==='update'?`${en?'Change':'Cambiar'}:\n${en?'Before':'Antes'}: ${describeBlock(c.before!,locale)}\n${en?'After':'Después'}: ${describeBlock(c.after!,locale)}`:`${en?'Add':'Añadir'}: ${describeBlock(c.after!,locale)}`;}
export function shiftDate(date:string,n:number){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)}
export function demoIntent(text:string,blocks:Block[],now=new Date(),locale:AdminLocale='es'):Intent{const en=locale==='en';let t=text.toLowerCase();if(en){t=t.replace(/\b(tomorrow|today|schedule|agenda|events|add|create|book|block|delete|remove|cancel|move|edit|change|travel|rest|unavailable|holiday|busy|people|persons|lesson)\b/g,w=>({tomorrow:'mañana',today:'hoy',schedule:'agenda',agenda:'agenda',events:'eventos',add:'añade',create:'crea',book:'reserva',block:'bloquea',delete:'elimina',remove:'elimina',cancel:'cancela',move:'mueve',edit:'edita',change:'cambia',travel:'viaje',rest:'descanso',unavailable:'no disponible',holiday:'vacaciones',busy:'ocupado',people:'personas',persons:'personas',lesson:'clase'} as Record<string,string>)[w]);}const base={...blankIntent};const date=t.match(/\b\d{4}-\d{2}-\d{2}\b/)?.[0]||(t.includes('mañana')?shiftDate(localParts(now).date,1):t.includes('hoy')?localParts(now).date:'');const times=[...t.matchAll(/\b(\d{1,2}):([0-5]\d)\b/g)].map(m=>m[1].padStart(2,'0')+':'+m[2]);
 if(/\b(agenda|qué tengo|que tengo|eventos)\b/.test(t)&&!/\b(añade|agrega|bloquea|reserva|crea|cambia|mueve|elimina|borra)\b/.test(t))return {...base,operation:'read',start:date||localParts(now).date};
 const deleting=/\b(elimina|borra|quita|cancela)\b/.test(t),updating=/\b(cambia|mueve|edita)\b/.test(t);if(deleting||updating){const matches=blocks.filter(b=>date&&localInput(b.starts_at).slice(0,10)===date&&times[0]===localInput(b.starts_at).slice(11));if(matches.length!==1)return {...base,question:'Indica el día y la hora de inicio del evento (ej. elimina la clase de mañana a las 09:00).'};return {...base,operation:deleting?'delete':'update',target:matches[0].id,start:updating&&times[1]?date+'T'+times[1]:'',end:updating&&times[2]?date+'T'+times[2]:'',question:''};}
 if(!date||times.length<2)return {...base,question:'En esta demo usa una fecha y dos horas, por ejemplo: Añade una clase mañana de 09:00 a 11:00.'};
 const kind=t.includes('viaje')?'travel':t.includes('descanso')?'rest':t.includes('no disponible')||t.includes('vacaciones')?'off':t.includes('ocupado')||t.includes('bloquea')?'busy':'lesson';const people=t.match(/(\d+)\s*personas/)?.[1];return {...base,operation:'create',kind,start:date+'T'+times[0],end:date+'T'+times[1],title:adminText(locale,kindLabels[kind])+(people?' · '+people+(en?' people':' personas'):''),shareable:'no'};}
export function readSummary(blocks:Block[],date:string,locale:AdminLocale='es'){const end=shiftDate(date,1);const rows=blocks.filter(b=>Date.parse(b.starts_at)<Date.parse(toUtc(end+'T00:00'))&&Date.parse(b.ends_at)>Date.parse(toUtc(date+'T00:00')));return rows.length?rows.map(b=>describeBlock(b,locale)).join('\n'):(locale==='en'?'No events for ':'No hay eventos para ')+date+'.';}
