import type {Locale} from './content';
import {quickChoices,type Draft} from './concierge';
export const assistantLanguages=[{id:'en',label:'EN',name:'English'},{id:'es',label:'ES',name:'Español'},{id:'fr',label:'FR',name:'Français'}] as const;
export const languageNames:Record<Locale,string>={en:'English',es:'Spanish',fr:'French'};
// Preserve customer-entered prose and canonical dates. Translate only known preset values.
export function localizeDraft(d:Draft,from:Locale,to:Locale):Draft{
 const translate=(value:string,key:'duration'|'rental'|'time'|'date')=>{const presets:readonly string[]=quickChoices[from][key];const index=presets.indexOf(value);return index<0?value:quickChoices[to][key][index]||value};
 return {...d,date:translate(d.date,'date'),time:translate(d.time,'time'),duration:translate(d.duration,d.service===5?'rental':'duration')};
}
