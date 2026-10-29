import '../css/main.css';
import '../css/plugins.css';
import './nav.js';
fetch('/updates/motion-dock/latest.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Feed unavailable');return r.json();}).then(({release:r})=>{
  if(!r||!/^\d+\.\d+\.\d+$/.test(r.version))return;
  const u=new URL(r.downloadUrl);if(u.protocol!=='https:'||!['www.josephgmedia.com','josephgmedia.com'].includes(u.hostname)||u.pathname!=='/downloads/motion-dock/Motion-Dock-'+r.version+'.zip')return;
  document.querySelector('#motion-dock-download').href=u.pathname;
  document.querySelector('#release-version').textContent='VERSION '+r.version;
  document.querySelector('#release-size').textContent=(r.size/1024/1024).toFixed(1)+' MB ZIP';
  if(Array.isArray(r.notes)){const list=document.querySelector('#release-notes');list.textContent='';r.notes.forEach(n=>{const li=document.createElement('li');li.textContent=n;list.append(li);});}
}).catch(()=>{});
