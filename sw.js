/* sw.js — يُخزّن التطبيق ليعمل بدون إنترنت */
const CACHE='wihda-v2'; // عند أي تعديل مستقبلي للملف، غيّرها إلى wihda-v2
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./'])).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys()
    .then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    caches.match(e.request).then(hit=>
      hit||fetch(e.request).then(res=>{
        if(res.ok){const cl=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cl));}
        return res;
      }).catch(()=>caches.match('./'))
    )
  );
});