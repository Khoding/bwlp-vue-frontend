if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(i[t])return;let o={};const d=e=>n(e,t),l={module:{uri:t},exports:o,require:d};i[t]=Promise.all(s.map((e=>l[e]||d(e)))).then((e=>(r(...e),o)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-CbZhnkRR.js",revision:null},{url:"assets/index-DtclAHaQ.css",revision:null},{url:"index.html",revision:"36850a350fe71bdb3695828fbbd88a06"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"pwa-192x192.png",revision:"d1a31885d19627b5981685be6a1bcf63"},{url:"pwa-512x512.png",revision:"d1a31885d19627b5981685be6a1bcf63"},{url:"manifest.webmanifest",revision:"b4faae4ad9b30acacc3994e6d252a669"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
