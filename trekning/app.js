// ===== Utils =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const fmtTime = (d) => new Intl.DateTimeFormat('nb-NO',{dateStyle:'medium',timeStyle:'short'}).format(d);

function normalizeName(s){
  return s.trim().toLowerCase().split(/\s+/).map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
}
function getNames(){
  const raw = $('#names').value.split(/\r?\n|,|;/).map(s=>s.trim()).filter(Boolean);
  const normalized = raw.map(normalizeName);
  const uniq = [];
  for(const n of normalized){ if(!uniq.includes(n)) uniq.push(n); }
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

// Seed
function parseURL(){ const p=new URLSearchParams(location.search); return {seed:p.get('seed')||null, namesParam:p.get('names')}; }
function toSeedFromNow(){
  const d=new Date(), pad=(n)=>String(n).padStart(2,'0');
  return [d.getFullYear(),pad(d.getMonth()+1),pad(d.getDate()),pad(d.getHours()),pad(d.getMinutes()),pad(d.getSeconds())].join('');
}
function namesToParam(names){ return encodeURIComponent(names.join(',')); }

// ===== Rendering players (chips) =====
function renderPlayersChips(names){
  const row = $('#playersRow');
  row.innerHTML = '';
  names.forEach(n=>{
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.setAttribute('role','listitem');
    chip.setAttribute('tabindex','0');
    chip.textContent = n;
    row.appendChild(chip);
  });
}

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

// ===== Animation helpers (chips fly til slots) =====
function rect(el){ return el.getBoundingClientRect(); }
function makeFlyingClone(fromEl){
  const r = rect(fromEl);
  const clone = fromEl.cloneNode(true);
  clone.classList.add('flying');
  Object.assign(clone.style, {left:`${r.left}px`, top:`${r.top}px`, width:`${r.width}px`, height:`${r.height}px`});
  document.body.appendChild(clone);
  return clone;
}
function animateChipToSlot(name, targetSlot){
  const chip = $$('#playersRow .chip').find(c => c.textContent === name);
  if(!chip || !targetSlot) return Promise.resolve();
  const clone = makeFlyingClone(chip);
  const tr = rect(targetSlot);
  const from = rect(clone);
  const dx = (tr.left + tr.width/2) - (from.left + from.width/2);
  const dy = (tr.top + tr.height/2) - (from.top + from.height/2);

  // start
  requestAnimationFrame(()=>{
    clone.style.transform = `translate(${dx}px, ${dy}px) scale(1.0)`;
    clone.style.opacity = '0.95';
  });

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

function clearSlots(){
  $$('.slot').forEach(s=>{
    s.classList.remove('filled');
    s.innerHTML = ''; // reset til tom “plass-holder”
  });
}

// ===== Core draw =====
function renderResultText(pairs){
  $('#announce').textContent = `Trekning klar: Bil 1: ${pairs[0].join(' og ')}, Bil 2: ${pairs[1].join(' og ')}.`;
}

async function animateAssignment(pairs){
  clearSlots();
  // Map navn -> target slot DOM
  const targetMap = new Map();
  const [p1, p2] = pairs;
  const s11 = document.querySelector('.slot[data-car="1"][data-slot="1"]');
  const s12 = document.querySelector('.slot[data-car="1"][data-slot="2"]');
  const s21 = document.querySelector('.slot[data-car="2"][data-slot="1"]');
  const s22 = document.querySelector('.slot[data-car="2"][data-slot="2"]');

  targetMap.set(p1[0], s11);
  targetMap.set(p1[1], s12);
  targetMap.set(p2[0], s21);
  targetMap.set(p2[1], s22);

  // Animer i rekkefølge for litt “show”
  for(const name of [p1[0], p1[1], p2[0], p2[1]]){
    // legg inn en liten delay mellom flyvninger
    /* eslint-disable no-await-in-loop */
    await new Promise(r=>setTimeout(r, 90));
    await animateChipToSlot(name, targetMap.get(name));
  }
  confetti();
}

function draw({forceNewSeed=false}={}){
  const names = getNames();
  if(names.length !== 4){ alert('Du må oppgi nøyaktig fire unike navn.'); return; }
  const normalized = names.map(normalizeName);
  const sorted = sortNamesStable(normalized);
  const combos = combosOfFour(sorted);

  const {seed:seedFromURL} = parseURL();
  let seed = seedFromURL;
  if(forceNewSeed || !seed){ seed = toSeedFromNow(); }

  const u = hashToUnit(`${seed}::${sorted.join('|')}`);
  const idx = Math.floor(u*3);
  const pairs = combos[idx];

  // UI updates
  $('#seedInfo').textContent = `Seed: ${seed}`;
  const now = new Date();
  $('#timeIn
