import type {ReactNode} from 'react';
import {notFound} from 'next/navigation';
import {locales,type Locale} from '../../lib/content';
import '../../styles/brand.css';
import '../../styles/globals.css';
export function generateStaticParams(){return locales.map(locale=>({locale}));}
export default async function LocaleLayout({children,params}:{children:ReactNode;params:Promise<{locale:string}>}){const {locale}=await params;if(!locales.includes(locale as Locale))notFound();return <html lang={locale}><body>{children}</body></html>;}
