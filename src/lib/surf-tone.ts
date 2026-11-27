import type {Locale} from './content';
// Remove only standalone canned acknowledgements at the start of a model question.
// Never rewrite quoted customer details or meaningful sentences such as "Great waves...".
const filler={en:/^(?:great|nice|awesome|perfect|fantastic|excellent|wonderful|amazing|sounds good|cool|sure|absolutely|got it)\s*(?:[!.,:;]+|[–—-]+)\s*/iu,es:/^[¡]?(?:genial|perfecto|excelente|estupendo|fantástico|muy bien|qué bien|súper|vale|claro|de acuerdo)\s*(?:[!.,:;]+|[–—-]+)\s*/iu,fr:/^(?:super|génial|parfait|excellent|formidable|très bien|d’accord|d'accord|bien sûr)\s*(?:[!.,:;]+|[–—-]+)\s*/iu};
export function surfTone(value:string,locale:Locale):string {
 let text=value.trim(), previous:string;
 do {previous=text;text=text.replace(filler[locale],'').replace(/^[–—-]+\s*/u,'').trim();} while(text!==previous);
 if(text!==value.trim()&&text)text=text.charAt(0).toLocaleUpperCase(locale)+text.slice(1);
 return text;
}
