window.PLATFORMANCE_CONFIG={webhookUrl:"",thankYouPage:"thank-you.html"};
(()=>{
 const version='8';
 ['v2-0.css','v2-1.css','v2-2a.css','v2-2b1.css','v2-2b2.css','v2-3a.css','v2-3b.css','v2-4b.css','v2-4c.css','v2-4d1.css','contacts-v2.css','mobile-v2.css','v2-visible.css','v2-feedback-01.css'].forEach(file=>{const link=document.createElement('link');link.rel='stylesheet';link.href=`assets/${file}?v=${version}`;document.head.append(link)});
 const files=['v2-dom-0.js','v2-dom-1-1.js','v2-dom-1-2.js','v2-dom-2-2.js','v2-dom-2-3.js','v2-dom-2-4.js','v2-dom-3-2.js','v2-patches.js','v2-patches-more.js','v2-motion.js'];
 (async()=>{for(const file of files){try{await import(`./${file}?v=${version}`)}catch(error){console.error('V2 asset error',file,error)}}})();
})();