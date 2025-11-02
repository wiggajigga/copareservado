// /trekning/app.js
// ===== Utils =====
const $  = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const fmtTime = (d) => new Intl.DateTimeFormat('nb-NO',{dateStyle:'medium',timeStyle:'short'}).format(d);

const DEFAULT_NAMES = ['Mats','Fredrik','Trygve','Knut'];

function normalizeName(s){ return s.trim().toLowerCase().split(/\s+/).map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' '); }
function parseURL(){ const p=new URLSearchParams(location.search); return {seed:p.get('seed')||null, namesParam:p.get('names')}; }
function getNames(){
  const {namesParam}=parseURL();
  if(namesParam){
    const list=decodeURIComponent(namesParam).split(',').map(normalizeName).filter(Boolean);
    const uniq=[]; for(const n of list){ if(!uniq.includes(n)) uniq.push(n); }
    if(uniq.length===4) return uniq;
  }
  return DEFAULT_NAMES;
}
function sortNamesStable(a){ return [...a].sort((x,y)=>x.localeCompare(y,'nb',{sensitivity:'base'})); }
function combosOfFour([A,B,C,D]){ return [ [[A,B],[C,D]], [[A,C],[B,D]], [[A,D],[B,C]] ]; }
function hashToUnit(s){ let h=0x811c9dc5; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=(h+((h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24)))>>>0 } return (h>>>0)/2**32 }
function toSeedFromNow(){ const d=new Date(),p=n=>String(n).padStart(2,'0'); return [d.getFullYear(),p(d.getMonth()+1),p(d.getDate()),p(d.getHours()),p(d.getMinutes()),p(d.getSeconds())].join('') }
function namesToParam(n){ return encodeURIComponent(n.join(',')); }

// ===== Render spillere (horisontal) =====
function renderPlayers(names){
  const row=$('#playersRow'); row.innerHTML='';
  names.forEach(n=>{
    const tag=document.createElement('span');
    tag.className='name-tag'; tag.setAttribute('role','listitem');
    tag.textContent=n.toUpperCase();
    row.appendChild(tag);
  });
}

// ===== Confetti =====
const confetti=(()=>{ const canvas=$('#confetti'); const ctx=canvas.getContext('2d');
  let W=0,H=0,p=[],start=0,dur=1400,run=false;
  function resize(){ W=canvas.width=innerWidth; H=canvas.height=innerHeight } addEventListener('resize',resize); resize();
  function spawn(n=80){ p=Array.from({length:n},()=>({x:Math.random()*W,y:-20-Math.random()*H*0.3,r:3+Math.random()*4,vx:(Math.random()-0.5)*1.2,vy:1.5+Math.random()*2.4,rot:Math.random()*Math.PI,vr:(Math.random()-0.5)*0.2})) }
  function step(ts){ if(!start) start=ts; const t=ts-start; ctx.clearRect(0,0,W,H);
    for(const c of p){ c.x+=c.vx; c.y+=c.vy; c.rot+=c.vr; c.vy+=0.02; ctx.save(); ctx.translate(c.x,c.y); ctx.rotate(c.rot); ctx.fillStyle=`hsl(${(c.x/W)*360},85%,50%)`; ctx.fillRect(-c.r,-c.r,c.r*2,c.r*2); ctx.restore() }
    if(t<dur){ run=true; requestAnimationFrame(step) } else { run=false; ctx.clearRect(0,0,W,H); start=0 }
  }
  return ()=>{ spawn(); if(!run) requestAnimationFrame(step) };
})();

// ===== Storage =====
const STORAGE_KEY='trekningDag1';
const saveState=(s)=>{ try{ localStorage.setItem(STORAGE_KEY,JSON.stringify(s)) }catch{} };
const loadState=()=>{ try{ const s=localStorage.getItem(STORAGE_KEY); return s?JSON.parse(s):null }catch{ return null } };

// ===== Animasjon (fly + fjern fra listen) =====
const rect = (el)=>el.getBoundingClientRect();
function makeFlyingTag(fromRect,text){
  const chip=document.createElement('span');
  chip.className='chip flying';
  chip.textContent=text.toUpperCase();
  Object.assign(chip.style,{left:`${fromRect.left}px`,top:`${fromRect.top}px`,width:`${fromRect.width}px`,height:`${fromRect.height}px`});
  document.body.appendChild(chip); return chip;
}
function animateFromTag(name,targetSlot){
  const tag=$$('#playersRow .name-tag').find(el=>el.textContent.toLowerCase()===name.toLowerCase());
  if(!tag||!targetSlot) return Promise.resolve();

  const from=rect(tag), to=rect(targetSlot);
  const dx=(to.left+to.width/2)-(from.left+from.width/2);
  const dy=(to.top+to.height/2)-(from.top+from.height/2);

  // Visuelt fjern navnet fra listen mens klonen flyr
  tag.classList.add('vanishing');
  tag.setAttribute('aria-hidden','true');
  tag.addEventListener('transitionend', ()=> tag.remove(), {once:true});

  const clone=makeFlyingTag(from,name);
  requestAnimationFrame(()=>{ clone.style.transform=`translate(${dx}px, ${dy}px)`; clone.style.opacity='0.95' });

  return new Promise(res=>{
    let done=false;
    const finish=()=>{ if(done) return; done=true; clone.remove(); targetSlot.classList.add('filled'); targetSlot.innerHTML='';
      const final=document.createElement('span'); final.className='chip-final'; final.textContent=name.toUpperCase(); targetSlot.appendChild(final); res(); };
    clone.addEventListener('transitionend', finish, {once:true});
    setTimeout(finish, 700); // fallback
  });
}
function clearSlots(){ $$('.slot').forEach(s=>{ s.classList.remove('filled'); s.innerHTML='' }) }

// ===== Trekning =====
// Tidligere skrev vi til #announce her – nå nullstiller vi til no-op
function renderResultText(/* pairs */){
  // Bevisst tom: ingen synlig “Trekning klar …”-tekst på siden.
}

async function animateAssignment(pairs){
  clearSlots();
  const [p1,p2] = pairs;
  const s11 = document.querySelector('.slot[data-car="1"][data-slot="1"]');
  const s12 = document.querySelector('.slot[data-car="1"][data-slot="2"]');
  const s21 = document.querySelector('.slot[data-car="2"][data-slot="1"]');
  const s22 = document.querySelector('.slot[data-car="2"][data-slot="2"]');
  const plan = [[p1[0],s11],[p1[1],s12],[p2[0],s21],[p2[1],s22]];
  for(const [name,slot] of plan){
    await new Promise(r=>setTimeout(r, 90));
    /* eslint-disable no-await-in-loop */
    await animateFromTag(name, slot);
  }
  confetti();
}

function draw({forceNewSeed=false}={}){
  const baseNames = getNames();
  if(baseNames.length !== 4){ alert('Oppgi fire unike navn i URL (&names=) eller bruk standard.'); return; }

  renderPlayers(baseNames); // repop før hver trekning

  const sorted  = sortNamesStable(baseNames);
  const combos  = combosOfFour(sorted);
  const {seed:seedFromURL} = parseURL();
  let seed = seedFromURL || (forceNewSeed ? toSeedFromNow() : null);
  if(!seed) seed = toSeedFromNow();

  const u = hashToUnit(`${seed}::${sorted.join('|')}`);
  const idx = Math.floor(u*3);
  const pairs = combos[idx];

  $('#seedInfo').textContent = `Seed: ${seed}`;
  $('#timeInfo').textContent = `Tidspunkt: ${fmtTime(new Date())}`;
  $('#shareBtn').disabled = false;

  animateAssignment(pairs).then(()=> renderResultText(pairs)); // no-op

  saveState({seed,timestamp:new Date().toISOString(),names:baseNames,sorted,index:idx,pairs});
  return {seed,pairs,idx,sorted};
}

// Delbar URL (ingen toast/announce – stille)
async function copyShareURL(){
  const state = loadState(); const names = state?.names || getNames();
  const base  = `${location.origin}${location.pathname.replace(/\/+$/,'')}`;
  const url   = `${base}?seed=${encodeURIComponent(state?.seed||toSeedFromNow())}&names=${namesToParam(names)}`;
  try{ await navigator.clipboard.writeText(url); }catch{
    const ta=document.createElement('textarea'); ta.value=url; document.body.appendChild(ta);
    ta.select(); try{ document.execCommand('copy'); }catch{} document.body.removeChild(ta);
  }
}
// Init
function bind(){
  const names=getNames();
  renderPlayers(names);

  $('#drawBtn').addEventListener('click',()=>draw({forceNewSeed:false}));
  $('#redrawBtn').addEventListener('click',()=>draw({forceNewSeed:true}));
  $('#shareBtn').addEventListener('click',copyShareURL);

  const {seed}=parseURL();
  if(seed){ draw({forceNewSeed:false}) }
  else{
    const last=loadState();
    if(last){
      renderPlayers(last.names);   // vis listen før vi “tømmer” den i animasjon
      animateAssignment(last.pairs).then(()=>renderResultText(last.pairs));
      $('#seedInfo').textContent=`Seed: ${last.seed}`;
      $('#timeInfo').textContent=`Tidspunkt: ${fmtTime(new Date(last.timestamp))}`;
      $('#shareBtn').disabled=false;
    }
  }
}
document.addEventListener('DOMContentLoaded', bind);

// Monte Carlo (konsoll): window.__fairnessTest(60000)
window.__fairnessTest=function(trials=60000){
  const names=getNames(); if(names.length!==4){ console.warn('Trenger 4 navn.'); return; }
  const sorted=sortNamesStable(names); const counts=[0,0,0];
  for(let i=0;i<trials;i++){ const u=hashToUnit(`${i}::${sorted.join('|')}`); const idx=Math.floor(u*3); counts[idx]++ }
  const pct=counts.map(c=>(100*c/trials).toFixed(2)+'%'); const exp=trials/3;
  const chi=counts.reduce((s,c)=>s+((c-exp)**2)/exp,0);
  console.log('Fordeling',counts,pct,'chi2=',chi.toFixed(3));
  return {counts,pct,chi};
};
