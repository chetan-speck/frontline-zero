'use strict';
const CACHE='frontline-zero-app-v3';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('frontline-zero-app-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;event.respondWith(caches.open(CACHE).then(async cache=>{const cached=await cache.match(event.request,{ignoreSearch:event.request.mode==='navigate'});if(cached)return cached;if(event.request.mode==='navigate')return cache.match('./index.html');return fetch(event.request);}));});
self.addEventListener('message',event=>{if(event.data?.type==='OFFLINE_STATUS')event.waitUntil(caches.open(CACHE).then(async cache=>{const entries=await Promise.all(ASSETS.map(asset=>cache.match(asset)));event.source?.postMessage({type:'OFFLINE_READY',ready:entries.every(Boolean)});}));});
