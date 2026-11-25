import type {MetadataRoute} from 'next';
import {baseUrl,indexable} from '../lib/seo';
export default function robots():MetadataRoute.Robots{const base=baseUrl();return {rules:{userAgent:'*',allow:'/',disallow:['/api/']},...(base&&indexable()?{sitemap:base+'/sitemap.xml'}:{})};}
