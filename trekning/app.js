// /trekning/app.js
// ===== Utils =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const fmtTime = (d) => new Intl.DateTimeFormat('nb-NO',{dateStyle:'medium',timeStyle:'short'}).format(d);

function normalizeName(s){
  return s.trim().toLowerCase().split(/\s+/).map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
}
function getInputs(){ return ['#n1','#n2','#n3','#n4'].map(id=>$(id)); }
function getNames(){
  const vals = getInputs().map(i => normalizeName(i.value)).filter(Boolean);
  const uniq = [];
  for(const n of vals){ if(!uniq.includes(n)) uniq.push(n); }
  return uniq.slice(0,4);
}
function sortNamesStable(arr){ return [...arr].sort((a,b)=>a.localeCompare(b,'nb',{sensitivity:'base'})); }
function combosOfFour(sorted){
  if(sorted.length!==4) throw new Error('Needs exactly 4 names');
  const [A,B,C,D] = sorted;
  return [
    [[A,B],[C,D]],
    [[A,C],[B,D]],
    [[A,D],[B,C]],
  ];
}

// FNV-1a -> [0,1)
function hashToUnit(seedStr){
  let h=0x811c9dc5;
  for(let i=0;i<seedStr.length;i++){
    h ^= seedStr.charCodeAt(i);
    h = (h + ((h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24)))>>>0;
  }
  return (h>>>0)/2**32;
}

// Seed & URL
function parseURL(){ const p=new URLSearchParams(location.search); return {seed:p.get('seed')||null, namesParam:p.get('names')}; }
function toSeedFromNow(){
  const d=new Date(), pad=(n)=>String(n).padStart(2,'0');
  return [d.getFullYear(),pad(d.getMonth()+1),pad(d.getDate()),pad(d.getHours()),pad(d.getMinutes()),pad(d.getSeconds())].join('');
}
function namesToParam(names){ return encodeURIComponent(names.join(',')); }

// ===== Confetti =====
const confetti = (()=>{
  const canvas = $('#confetti'); const ctx = canvas.getContext('2d');
  let W=0,H=0,pieces=[],start=0,duration=1400,running=false;
  function resize(){ W=canvas.width=innerWidth; H=canvas.height=innerHeight; }
  addEventListener('resize', resize); resize();
  function spawn(n=80){
    pieces = Array.from({length:n}, ()=>({
      x: Math.random()*W, y: -20 - Math.random()*H*0.3, r: 3 + Math.random()*4,
      vx: (Math.random()-0.5)*1.2, vy: 1.5 + Math.random()*2.4,
      rot: Math.random()*Math.PI, vr: (Math.random()-0.5)*0.2
    }));
  }
  function step(ts){
    if(!start) start=ts;
    const t=ts-start; ctx.clearRect(0,0,W,H);
    for(const p of pieces){
      p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr; p.vy+=0.02;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot);
      ctx.fillStyle = `hsl(${(p.x/W)*360}, 85%, 50%)`;
      ctx.fillRect(-p.r,-p.r,p.r*2,p.r*2);
      ctx.restore();
    }
    if(t<duration){ running=true; requestAnimationFrame(step); }
    else { running=false; ctx.clearRect(0,0,W,H); start=0; }
  }
  return function trigger(){ spawn(); if(!running) requestAnimationFrame(step); };
})();

// ===== LocalStorage =====
const STORAGE_KEY='trekningDag1';
function saveState(state){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch{} }
function loadState(){ try{ const s=localStorage.getItem(STORAGE_KEY); return s?JSON.parse(s):null; }catch{ return null; } }

// ===== Animation (fra input-felt til slot) =====
function rect(el){ return el.getBoundingClientRect(); }
function makeFlyingChip(fromRect, text){
  const chip = document.createElement('span');
  chip.className = 'chip flying';
  chip.textContent = text;
  Object.assign(chip.style, {
    left:`${fromRect.left}px`, top:`${fromRect.top}px`,
    width:`${fromRect.width}px`, height:`${fromRect.height}px`
  });
  document.body.appendChild(chip);
  return chip;
}
function animateFromInput(name, targetSlot){
  const inputs = getInputs();
  const src = inputs.find(i => normalizeName(i.value) === name);
  if(!src || !targetSlot) return Promise.resolve();
  const from = rect(src);
  const to = rect(targetSlot);
  const dx = (to.left + to.width/2) - (from.left + from.width/2);
  const dy = (to.top + to.height/2) - (from.top + from.height/2);
  const clone = makeFlyingChip(from, name);
  requestAnimationFrame(()=>{ clone.style.transform = `translate(${dx}px, ${dy}px)`; clone.style.opacity='0.95'; });
  return new Promise(res=>{
    clone.addEventListener('transitionend', ()=>{
      clone.remove();
      targetSlot.classList.add('filled');
      targetSlot.innerHTML = '';
      const final = document.createElement('span');
      final.className = 'chip chip-final';
      final.textContent = name;
      targetSlot.appendChild(final);
      res();
    }, {once:true});
  });
}
function clearSlots(){ $$('.slot').forEach(s=>{ s.classList.remove('filled'); s.innerHTML=''; }); }

// ===== Core draw =====
function renderResultText(pairs){
  $('#announce').textContent = `Trekning klar: Bil 1: ${pairs[0].join(' og ')}, Bil 2: ${pairs[1].join(' og ')}.`;
}
async function animateAssignment(pairs){
  clearSlots();
  const [p1,p2] = pairs;
  const s11 = document.querySelector('.slot[data-car="1"][data-slot="1"]');
  const s12 = document.querySelector('.slot[data-car="1"][data-slot="2"]');
  const s21 = document.querySelector('.slot[data-car="2"][data-slot="1"]');
  const s22 = document.querySelector('.slot[data-car="2"][data-slot="2"]');
  const plan = [
    [p1[0], s11], [p1[1], s12],
    [p2[0], s21], [p2[1], s22],
  ];
  for(const [name, slot] of plan){
    await new Promise(r=>setTimeout(r, 90));
    /* eslint-disable no-await-in-loop */
    await animateFromInput(name, slot);
  }
  confetti();
}

function draw({forceNewSeed=false}={}){
  const names = getNames();
  if(names.length !== 4){ alert('Oppgi fire unike navn.'); return; }
  const normalized = names.map(normalizeName);
  const sorted = sortNamesStable(normalized);
  const combos = combosOfFour(sorted);

  const {seed:seedFromURL} = parseURL();
  let seed = seedFromURL;
  if(forceNewSeed || !seed){ seed = toSeedFromNow(); }

  const u = hashToUnit(`${seed}::${sorted.join('|')}`);
  const idx = Math.floor(u*3);
  const pairs = combos[idx];

  $('#seedInfo').textContent = `Seed: ${seed}`;
  const now = new Date();
  $('#timeInfo').textContent = `Tidspunkt: ${fmtTime(now)}`;
  $('#shareBtn').disabled = false;

  animateAssignment(pairs).then(()=> renderResultText(pairs));

  saveState({seed, timestamp: now.toISOString(), names: normalized, sorted, index: idx, pairs});
  console.info('Rettferdighets-sjekk: window.__fairnessTest(60000)');
  return {seed, pairs, idx, sorted};
}

// Delbar URL
async function copyShareURL(){
  const state = loadState();
  if(!state) return;
  const base = `${location.origin}${location.pathname.replace(/\/+$/,'')}`;
  const url = `${base}?seed=${encodeURIComponent(state.seed)}&names=${namesToParam(state.names)}`;
  try{ await navigator.clipboard.writeText(url); $('#announce').textContent='Delbar lenke kopiert.'; }
  catch{
    const ta=document.createElement('textarea'); ta.value=url; document.body.appendChild(ta);
    ta.select(); try{ document.execCommand('copy'); }catch{} document.body.removeChild(ta);
  }
}

// Init
function bind(){
  $('#drawBtn').addEventListener('click', ()=> draw({forceNewSeed:false}));
  $('#redrawBtn').addEventListener('click', ()=> draw({forceNewSeed:true}));
  $('#shareBtn').addEventListener('click', copyShareURL);

  // Fyll fra URL seed/names om gitt
  const { seed, namesParam } = parseURL();
  if(namesParam){
    const list = decodeURIComponent(namesParam).split(',').map(normalizeName).filter(Boolean);
    const inputs = getInputs();
    if(list.length===4) inputs.forEach((inp,idx)=> inp.value = list[idx]);
  }

  if(seed){
    draw({forceNewSeed:false});
  }else{
    const last = loadState();
    if(last){
      const inputs = getInputs();
      last.names.forEach((n,i)=>{ if(inputs[i]) inputs[i].value = n; });
      animateAssignment(last.pairs).then(()=> renderResultText(last.pairs));
      $('#seedInfo').textContent = `Seed: ${last.seed}`;
      $('#timeInfo').textContent = `Tidspunkt: ${fmtTime(new Date(last.timestamp))}`;
      $('#shareBtn').disabled = false;
    }
  }
}

// Monte Carlo (konsoll)
window.__fairnessTest = function(trials=60000){
  const names = getNames();
  if(names.length!==4){ console.warn('Rettferdighets-sjekk: trenger 4 navn.'); return; }
  const sorted = sortNamesStable(names.map(normalizeName));
  const counts=[0,0,0];
  for(let i=0;i<trials;i++){
    const seed=String(i);
    const u=hashToUnit(`${seed}::${sorted.join('|')}`);
    const idx=Math.floor(u*3); counts[idx]++;
  }
  const pct = counts.map(c => (100*c/trials).toFixed(2)+'%');
  const exp = trials/3;
  const chi = counts.reduce((s,c)=> s + ((c-exp)**2)/exp, 0);
  console.log(`Fordeling over ${trials} trekk:`, counts, pct, 'chi2=', chi.toFixed(3));
  return {counts,pct,chi};
};

document.addEventListener('DOMContentLoaded', bind);
