import type {MetadataRoute} from 'next';
import {locales,paths,type Page} from '../lib/content';
import {baseUrl,indexable,urlPath} from '../lib/seo';
export default function sitemap():MetadataRoute.Sitemap{const base=baseUrl();if(!base||!indexable())return [];return (Object.keys(paths.en) as Page[]).flatMap(p=>locales.map(l=>({url:base+urlPath(l,p),alternates:{languages:Object.fromEntries(locales.map(lang=>[lang,base+urlPath(lang,p)]))}})));}
