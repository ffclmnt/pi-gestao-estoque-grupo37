// Service worker: deixa o app instalável e abrir mesmo sem internet.
// Os dados da API (/api) NUNCA ficam em cache, para não mostrar estoque desatualizado.
const CACHE = 'gestor-estoque-v1'

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['/'])))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((chaves) =>
      Promise.all(chaves.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  const url = new URL(req.url)

  // só trata GET do mesmo site e ignora a API
  if (req.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/api')) {
    return
  }

  // tenta a rede primeiro; se estiver offline, usa a cópia guardada
  e.respondWith(
    fetch(req)
      .then((resp) => {
        const copia = resp.clone()
        caches.open(CACHE).then((c) => c.put(req, copia))
        return resp
      })
      .catch(() => caches.match(req).then((r) => r || caches.match('/')))
  )
})
