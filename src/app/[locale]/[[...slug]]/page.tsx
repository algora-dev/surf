import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import Site from '../../../components/Site';
import {copy,locales,paths,type Locale,type Page} from '../../../lib/content';
type Params={locale:string;slug?:string[]};
function resolve({locale,slug}:Params){if(!locales.includes(locale as Locale)|| (slug?.length??0)>1)notFound();const lang=locale as Locale;const page=(Object.keys(paths[lang]) as Page[]).find(p=>paths[lang][p]===(slug?.[0]??''));if(!page)notFound();return {locale:lang,page};}
export function generateStaticParams({params}:{params:{locale:string}}){return Object.values(paths[params.locale as Locale]).map(slug=>({slug:slug?[slug]:[]}));}
export async function generateMetadata({params}:{params:Promise<Params>}):Promise<Metadata>{const {locale,page}=resolve(await params);const t=copy[locale];const title=page==='home'?`Península Surf School | ${t.location}`:`${page==='boards'?t.shopBoards:t.shopClothing} | Península Surf School`;const description=page==='home'?t.heroSub:page==='boards'?t.boardsIntro:t.clothingIntro;const base=process.env.NEXT_PUBLIC_SITE_URL;const url=(l:Locale)=>`/${l}${paths[l][page]?'/'+paths[l][page]:''}`;return {title,description,icons:{icon:'/brand/favicon.png'},...(base?{metadataBase:new URL(base),alternates:{canonical:url(locale),languages:{en:url('en'),es:url('es'),fr:url('fr'),'x-default':url('en')}}}:{}),openGraph:{title,description,type:'website'}};}
export default async function PageRoute({params}:{params:Promise<Params>}){const {locale,page}=resolve(await params);return <Site locale={locale} page={page}/>;}
