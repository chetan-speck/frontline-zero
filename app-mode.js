/* Optional app shell. Local-file gameplay does not require this PWA layer. */
(()=>{'use strict';
const fullscreenButton=document.querySelector('#fullscreenApp');
const installButton=document.querySelector('#installApp');
const status=document.querySelector('#appStatus');
const hint=document.querySelector('#fullscreenHint');
const isHosted=location.protocol==='https:'||(['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&location.protocol==='http:');
const installed=()=>matchMedia('(display-mode: fullscreen)').matches||matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const installURL='https://chetan-speck.github.io/frontline-zero/';
let installPrompt=null,wakeLock=null,cacheReady=false;
function announce(message){status.textContent=message;}
async function holdScreen(){if(!('wakeLock' in navigator)||document.hidden)return;try{if(!wakeLock)wakeLock=await navigator.wakeLock.request('screen');wakeLock.addEventListener('release',()=>{wakeLock=null;},{once:true});}catch(e){/* Wake lock is optional and may be unavailable on file URLs. */}}
async function enterFullscreen(){const request=document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen;let success=installed();try{if(!document.fullscreenElement&&!document.webkitFullscreenElement&&request){await request.call(document.documentElement,{navigationUI:'hide'});success=true;}else success=success||!!document.fullscreenElement;}catch(e){announce('Fullscreen was blocked. Tap FULLSCREEN to retry.');}
try{if(success&&screen.orientation?.lock)await screen.orientation.lock('landscape');}catch(e){/* Manual rotation remains available. */}holdScreen();syncFullscreen();if(!success)announce('Your browser controls fullscreen. Try opening this file in a compatible browser.');return success;}
function syncFullscreen(){const active=!!(document.fullscreenElement||document.webkitFullscreenElement)||installed();fullscreenButton.textContent=active?'FULLSCREEN ACTIVE':'FULLSCREEN';const playing=window.FZ?.state.appState==='game';hint.hidden=active||!playing;}
window.FZApp={enterFullscreen,get offlineReady(){return cacheReady;}};
fullscreenButton.onclick=enterFullscreen;hint.onclick=enterFullscreen;
for(const name of ['fullscreenchange','webkitfullscreenchange'])document.addEventListener(name,syncFullscreen);
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;installButton.textContent='INSTALL APP';announce(cacheReady?'Ready to install · offline files saved':'Installation available · saving offline files');});
window.addEventListener('appinstalled',()=>{installPrompt=null;installButton.hidden=true;announce('Installed · launch FRONTLINE ZERO from your home screen');syncFullscreen();});
installButton.onclick=async()=>{if(installed()){announce('You are already running the installed app.');return;}if(!isHosted){announce('Opening HTTPS installable edition in this browser…');location.href=installURL;return;}if(installPrompt){await installPrompt.prompt();const result=await installPrompt.userChoice;installPrompt=null;announce(result.outcome==='accepted'?'Install requested · follow your browser instructions':'Installation cancelled · you can still play');}else{announce('Use browser menu → Install app / Add to Home screen.');alert('To install FRONTLINE ZERO:\n\n1. Open this address in your normal Android browser, not an embedded chat preview.\n2. Wait for Offline files saved.\n3. Use the browser menu → Install app or Add to Home screen.\n\nIf the option is absent, the browser may not support app installation or may require another visit.');}};
if(isHosted){const link=document.createElement('link');link.rel='manifest';link.href='./manifest.webmanifest';document.head.appendChild(link);const icon=document.createElement('link');icon.rel='icon';icon.href='./icon-192.png';document.head.appendChild(icon);
if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js',{scope:'./'}).then(async registration=>{await navigator.serviceWorker.ready;const worker=registration.active||navigator.serviceWorker.controller;if(worker){worker.postMessage({type:'OFFLINE_STATUS'});}announce('App support ready · verifying offline cache');}).catch(()=>announce('Offline installation unavailable. The game can still run while this page stays open.'));
navigator.serviceWorker.addEventListener('message',event=>{if(event.data?.type==='OFFLINE_READY'){cacheReady=event.data.ready===true;announce(cacheReady?'Offline files saved · use INSTALL APP or your browser menu':'Offline cache incomplete · stay online and reload');}});
}else announce('This browser supports local play but not offline installation.');
}else{installButton.textContent='GET INSTALLABLE APP';announce('LOCAL EDITION · FULLSCREEN works offline · GET INSTALLABLE APP opens the HTTPS edition');}
if(installed()){installButton.hidden=true;announce('INSTALLED EDITION · offline cache is verified after launch');holdScreen();}
document.addEventListener('visibilitychange',()=>{if(!document.hidden){if(installed()||document.fullscreenElement)holdScreen();syncFullscreen();}else if(wakeLock){wakeLock.release().catch(()=>{});wakeLock=null;}});
window.addEventListener('resize',syncFullscreen);syncFullscreen();
})();
