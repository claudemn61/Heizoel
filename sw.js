// Cache-Version = App-Version, kommt aus der Registrierung (sw.js?v=APP_VERSION in index.html).
// Eine neue APP_VERSION ergibt eine neue Script-URL, damit installiert sich der Service Worker neu.
const VER = 'heizoel-' + (new URL(self.location).searchParams.get('v') || '0');
const FONTS = 'heizoel-fonts';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => {
  // cache:'reload' umgeht den HTTP-Cache (GitHub Pages: max-age 10 Min.), damit wirklich die neue Version gespeichert wird
  e.waitUntil(caches.open(VER).then(c => c.addAll(SHELL.map(u => new Request(u, {cache:'reload'})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VER && k !== FONTS).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin){
    const isPage = req.mode === 'navigate' || /\/(index\.html)?$/.test(url.pathname);
    if (isPage){
      // Seite: zuerst Netz (beim Server nachfragen, ob neu), offline aus dem Cache
      e.respondWith(fetch(req, {cache:'no-cache'}).then(res => {
        if (res && res.ok){ const copy = res.clone(); caches.open(VER).then(c => c.put('index.html', copy)); }
        return res;
      }).catch(() => caches.match('index.html').then(hit => hit || caches.match(req, {ignoreSearch:true}))));
      return;
    }
    // Übrige Dateien (Icons, Manifest): aus dem Cache, im Hintergrund aktualisieren
    e.respondWith(caches.match(req, {ignoreSearch:true}).then(hit => {
      const net = fetch(req).then(res => { if (res && res.ok){ const copy = res.clone(); caches.open(VER).then(c => c.put(req, copy)); } return res; })
        .catch(() => hit || caches.match('index.html'));
      return hit || net;
    }));
  } else if (/^fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)){
    e.respondWith(caches.open(FONTS).then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(res => { c.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    }));
  }
});
