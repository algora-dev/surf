import type {Metadata} from 'next';
import Admin from '../../../components/Admin';
import '../../../styles/brand.css';
import '../../../styles/globals.css';
export const metadata:Metadata={title:'Península | Mi agenda',robots:{index:false,follow:false}};
export const dynamic='force-dynamic';
export default function AdminPage(){const demo=process.env.PENINSULA_DEMO_MODE==='true'&&process.env.VERCEL_ENV!=='production'&&process.env.SITE_INDEXABLE!=='true';const quick=!demo&&process.env.PENINSULA_QUICK_LOGIN==='true'&&!!process.env.PENINSULA_QUICK_EMAIL&&!!process.env.PENINSULA_QUICK_PASSWORD;return <div lang="es"><Admin demo={demo} quick={quick}/></div>}
