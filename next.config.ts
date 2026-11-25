import type {NextConfig} from 'next';
const config:NextConfig={reactStrictMode:true,async redirects(){return [{source:"/index.html",destination:"/en",permanent:true}]}};
export default config;
