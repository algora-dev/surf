// Network-only for the private app. No cached calendar, enquiries, credentials or API responses.
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
 const u=new URL(event.request.url);
 if(event.request.mode!=='navigate'||u.origin!==self.location.origin||u.pathname!=='/admin')return;
 event.respondWith(fetch(event.request,{cache:'no-store'}).catch(()=>new Response(`<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Península · Offline</title><body style="font:18px system-ui;background:#F4F0E9;color:#4d5b64;padding:30px"><h1>Península</h1><p>Sin conexión / You are offline.</p><p>Conéctate a internet para abrir tu agenda. Connect to the internet to open your schedule.</p><a href="/admin">Reintentar / Try again</a></body></html>`,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}})));
});
