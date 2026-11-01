import '../css/main.css';
import '../css/plugins.css';
import './nav.js';
fetch('/updates/motion-dock/latest.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Feed unavailable');return r.json();}).then(({release:r})=>{
  if(!r||!/^\d+\.\d+\.\d+$/.test(r.version))return;
  const u=new URL(r.installer?r.installer.url:r.downloadUrl);
  if(u.protocol!=='https:'||!['www.josephgmedia.com','josephgmedia.com'].includes(u.hostname)||u.username||u.password||u.port||u.search||u.hash||u.pathname!=='/downloads/motion-dock/Motion-Dock-'+r.version+(r.installer?'.zxp':'.zip'))return;
  document.querySelector('#motion-dock-download').href=u.pathname;document.querySelector('#motion-dock-download').firstChild.textContent=r.installer?'Download ZXP ':'Download ZIP ';
  document.querySelector('#release-version').textContent='v'+r.version;
}).catch(()=>{});
