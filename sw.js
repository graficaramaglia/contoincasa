// ContoInCasa: permette all'app di aprirsi anche senza internet.
// Quando cambi i file dell'app, aumenta il numero di versione qui sotto.
const VERSIONE = "contoincasa-v5";
const FILE = [
  "./", "./index.html", "./config.js", "./manifest.webmanifest",
  "./icons/logo.png", "./icons/icon-192.png", "./icons/icon-512.png",
  "./icons/apple-touch-icon.png", "./icons/favicon.png",
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSIONE).then(c => c.addAll(FILE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(k => Promise.all(k.filter(n => n !== VERSIONE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // I dati di Supabase vanno sempre presi dalla rete
  if (url.hostname.endsWith("supabase.co")) return;
  // Pagine e file dell'app: prima la rete (per avere gli aggiornamenti), poi la copia salvata
  e.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok && (url.origin === location.origin || url.hostname === "cdn.jsdelivr.net")) {
          const copia = res.clone();
          caches.open(VERSIONE).then(c => c.put(req, copia));
        }
        return res;
      })
      .catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
  );
});

// Notifiche delle scadenze
self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "ContoInCasa", {
    body: d.body || "",
    icon: "icons/icon-192.png",
    badge: "icons/favicon.png",
    tag: d.tag || "scadenze",
    data: { url: "./" }
  }));
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(finestre => {
      for (const w of finestre) { if ("focus" in w) return w.focus(); }
      return self.clients.openWindow("./");
    })
  );
});
