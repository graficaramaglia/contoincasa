// Promemoria: lavora offline e riceve le notifiche.
// Quando cambi i file dell'app, aumenta il numero di versione qui sotto.
const VERSIONE = "promemoria-v1";
const FUNZIONE = "https://mvgnhlgultpdeoxpcfgk.supabase.co/functions/v1/promemoria-tick";
const CHIAVE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12Z25obGd1bHRwZGVveHBjZmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2MTE1NDYsImV4cCI6MjEwOTE4NzU0Nn0.uktlj4ALPvHTeadZ02PzDzCbivn25HkLbi8ZrqwvXI4";
const FILE = [
  "./", "./index.html", "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png", "./icons/favicon.png",
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSIONE).then(c => c.addAll(FILE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(k => Promise.all(k.filter(n => n.startsWith("promemoria-") && n !== VERSIONE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.hostname.endsWith("supabase.co")) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok && (url.origin === location.origin || url.hostname === "cdn.jsdelivr.net")) {
        const copia = res.clone();
        caches.open(VERSIONE).then(c => c.put(req, copia));
      }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
  );
});

self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : "" }; }
  const opzioni = {
    body: d.body || "",
    icon: "icons/icon-192.png",
    badge: "icons/favicon.png",
    tag: d.tag || "promemoria",
    renotify: true,
    vibrate: [200, 100, 200],
    data: { id: d.id || null }
  };
  if (d.id) opzioni.actions = [{ action: "fatto", title: "Fatto ✓" }, { action: "rimanda", title: "+5 min" }];
  e.waitUntil(Promise.all([
    self.registration.showNotification(d.title || "Promemoria", opzioni),
    self.clients.matchAll({ type: "window" }).then(w => w.forEach(c => c.postMessage({ tipo: "aggiorna" })))
  ]));
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  const id = e.notification.data && e.notification.data.id;
  if (id && (e.action === "fatto" || e.action === "rimanda")) {
    e.waitUntil(
      self.registration.pushManager.getSubscription().then(sub => fetch(FUNZIONE, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + CHIAVE, "apikey": CHIAVE },
        body: JSON.stringify({ azione: e.action, id, endpoint: sub ? sub.endpoint : "" })
      })).catch(() => {})
    );
    return;
  }
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(finestre => {
      for (const w of finestre) { if ("focus" in w) return w.focus(); }
      return self.clients.openWindow("./");
    })
  );
});
